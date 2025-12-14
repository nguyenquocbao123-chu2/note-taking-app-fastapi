from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, SQLModel
from sqlalchemy.orm import selectinload

from app.database import get_session
from app.core.auth import get_current_user
from app.models import Note, Tag, User, NoteTag

router = APIRouter(prefix="", tags=["Notes"])


# =========================
# SCHEMAS
# =========================
class NoteCreate(SQLModel):
    title: str = ""
    content: str = ""
    bg: str = "#ffffff"
    folder_id: Optional[int] = None
    tag_ids: List[int] = []


class NoteUpdate(SQLModel):
    title: Optional[str] = None
    content: Optional[str] = None
    bg: Optional[str] = None
    folder_id: Optional[int] = None
    is_archived: Optional[bool] = None
    tag_ids: Optional[List[int]] = None


class TagRead(SQLModel):
    id: int
    name: str


class NoteRead(SQLModel):
    id: int
    title: str
    content: str
    bg: str
    folder_id: Optional[int]
    owner_id: int
    is_archived: bool
    is_deleted: bool
    deleted_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    tags: List[TagRead] = []


# =========================
# HELPERS
# =========================
def _set_tags(session: Session, user: User, note_id: int, tag_ids: List[int]):
    tag_ids = list(dict.fromkeys([int(x) for x in (tag_ids or [])]))

    old_links = session.exec(select(NoteTag).where(NoteTag.note_id == note_id)).all()
    for lk in old_links:
        session.delete(lk)

    if not tag_ids:
        session.commit()
        return

    tags = session.exec(
        select(Tag).where(Tag.owner_id == user.id, Tag.id.in_(tag_ids))
    ).all()

    found_ids = {t.id for t in tags}
    missing = [tid for tid in tag_ids if tid not in found_ids]
    if missing:
        raise HTTPException(status_code=400, detail=f"Tag không hợp lệ: {missing}")

    for tid in tag_ids:
        session.add(NoteTag(note_id=note_id, tag_id=tid))

    session.commit()


def _get_note_with_tags(session: Session, note_id: int, user_id: int) -> Optional[Note]:
    stmt = (
        select(Note)
        .where(Note.id == note_id, Note.owner_id == user_id)
        .options(selectinload(Note.tags))
    )
    return session.exec(stmt).first()


# =========================
# 1) LIST NOTES (chỉ note chưa xoá)
# =========================
@router.get("", response_model=List[NoteRead])
def list_notes(
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    stmt = (
        select(Note)
        .where(Note.owner_id == user.id, Note.is_deleted == False)  # noqa: E712
        .order_by(Note.id.desc())
        .options(selectinload(Note.tags))
    )
    return session.exec(stmt).all()


# =========================
# 1b) LIST ARCHIVED NOTES
# =========================
@router.get("/archived", response_model=List[NoteRead])
def list_archived_notes(
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    stmt = (
        select(Note)
        .where(
            Note.owner_id == user.id,
            Note.is_deleted == False,     # noqa: E712
            Note.is_archived == True,     # noqa: E712
        )
        .order_by(Note.id.desc())
        .options(selectinload(Note.tags))
    )
    return session.exec(stmt).all()


# =========================
# 2) LIST TRASH (chỉ note đã xoá)
# =========================
@router.get("/trash", response_model=List[NoteRead])
def list_trash(
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    stmt = (
        select(Note)
        .where(Note.owner_id == user.id, Note.is_deleted == True)  # noqa: E712
        .order_by(Note.deleted_at.desc().nullslast(), Note.id.desc())
        .options(selectinload(Note.tags))
    )
    return session.exec(stmt).all()


# =========================
# 3) CREATE NOTE
# =========================
@router.post("", response_model=NoteRead)
def create_note(
    payload: NoteCreate,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    note = Note(
        title=(payload.title or "").strip(),
        content=(payload.content or ""),
        bg=payload.bg or "#ffffff",
        folder_id=payload.folder_id,
        owner_id=user.id,
        is_archived=False,
        is_deleted=False,
        deleted_at=None,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    session.add(note)
    session.commit()
    session.refresh(note)

    _set_tags(session, user, note.id, payload.tag_ids)
    return _get_note_with_tags(session, note.id, user.id)


# =========================
# 4) UPDATE NOTE (không cho sửa note đã xoá)
# =========================
@router.put("/{note_id}", response_model=NoteRead)
def update_note(
    note_id: int,
    payload: NoteUpdate,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    note = session.get(Note, note_id)
    if not note or note.owner_id != user.id or note.is_deleted:
        raise HTTPException(status_code=404, detail="Không tìm thấy ghi chú")

    if payload.title is not None:
        note.title = payload.title
    if payload.content is not None:
        note.content = payload.content
    if payload.bg is not None:
        note.bg = payload.bg
    if payload.folder_id is not None:
        note.folder_id = payload.folder_id
    if payload.is_archived is not None:
        note.is_archived = payload.is_archived

    note.updated_at = datetime.utcnow()
    session.add(note)
    session.commit()

    if payload.tag_ids is not None:
        _set_tags(session, user, note_id, payload.tag_ids)

    return _get_note_with_tags(session, note_id, user.id)


# =========================
# 4b) ARCHIVE / UNARCHIVE
# =========================
@router.put("/{note_id}/archive", response_model=NoteRead)
def archive_note(
    note_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    note = session.get(Note, note_id)
    if not note or note.owner_id != user.id or note.is_deleted:
        raise HTTPException(status_code=404, detail="Không tìm thấy ghi chú")

    note.is_archived = True
    note.updated_at = datetime.utcnow()
    session.add(note)
    session.commit()
    return _get_note_with_tags(session, note_id, user.id)


@router.put("/{note_id}/unarchive", response_model=NoteRead)
def unarchive_note(
    note_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    note = session.get(Note, note_id)
    if not note or note.owner_id != user.id or note.is_deleted:
        raise HTTPException(status_code=404, detail="Không tìm thấy ghi chú")

    note.is_archived = False
    note.updated_at = datetime.utcnow()
    session.add(note)
    session.commit()
    return _get_note_with_tags(session, note_id, user.id)


# =========================
# 5) SOFT DELETE → đưa vào thùng rác
# =========================
@router.delete("/{note_id}")
def soft_delete_note(
    note_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    note = session.get(Note, note_id)
    if not note or note.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Không tìm thấy ghi chú")

    note.is_deleted = True
    note.deleted_at = datetime.utcnow()
    note.updated_at = datetime.utcnow()

    session.add(note)
    session.commit()
    return {"ok": True}


# =========================
# 6) RESTORE note từ thùng rác
# =========================
@router.put("/{note_id}/restore")
def restore_note(
    note_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    note = session.get(Note, note_id)
    if not note or note.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Không tìm thấy ghi chú")

    note.is_deleted = False
    note.deleted_at = None
    note.updated_at = datetime.utcnow()

    session.add(note)
    session.commit()
    return {"ok": True}


# =========================
# 7) HARD DELETE NOTE (XOÁ VĨNH VIỄN) - match FE: /hard
# =========================
@router.delete("/{note_id}/hard")
def hard_delete_note(
    note_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    note = session.get(Note, note_id)
    if not note or note.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Không tìm thấy ghi chú")

    links = session.exec(select(NoteTag).where(NoteTag.note_id == note_id)).all()
    for lk in links:
        session.delete(lk)

    session.delete(note)
    session.commit()
    return {"ok": True}
