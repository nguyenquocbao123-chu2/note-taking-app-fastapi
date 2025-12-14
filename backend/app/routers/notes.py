from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import datetime

from app.schemas import NoteCreate, NoteRead, NoteUpdate
from app.models import Note
from app.core.auth import get_current_user
from app.database import get_session

router = APIRouter()


@router.post("/", response_model=NoteRead)
def create_note(
    data: NoteCreate,
    session: Session = Depends(get_session),
    user=Depends(get_current_user),
):
    payload = data.dict()

    # ✅ đảm bảo có bg mặc định
    if not payload.get("bg"):
        payload["bg"] = "#ffffff"

    note = Note(**payload, owner_id=user.id)

    session.add(note)
    session.commit()
    session.refresh(note)
    return note


@router.get("/", response_model=list[NoteRead])
def list_notes(
    session: Session = Depends(get_session),
    user=Depends(get_current_user),
):
    notes = session.exec(
        select(Note).where(Note.owner_id == user.id)
    ).all()
    return notes


@router.get("/{note_id}", response_model=NoteRead)
def get_note(
    note_id: int,
    session: Session = Depends(get_session),
    user=Depends(get_current_user),
):
    note = session.exec(
        select(Note).where(Note.id == note_id, Note.owner_id == user.id)
    ).first()

    if not note:
        raise HTTPException(status_code=404, detail="Note không tồn tại")

    return note


@router.put("/{note_id}", response_model=NoteRead)
def update_note(
    note_id: int,
    data: NoteUpdate,
    session: Session = Depends(get_session),
    user=Depends(get_current_user),
):
    note = session.exec(
        select(Note).where(Note.id == note_id, Note.owner_id == user.id)
    ).first()

    if not note:
        raise HTTPException(status_code=404, detail="Note không tồn tại")

    updates = data.dict(exclude_unset=True)

    # ✅ nếu bg gửi lên rỗng thì set lại trắng
    if "bg" in updates and not updates["bg"]:
        updates["bg"] = "#ffffff"

    for field, value in updates.items():
        setattr(note, field, value)

    # ✅ cập nhật thời gian sửa
    note.updated_at = datetime.utcnow()

    session.add(note)
    session.commit()
    session.refresh(note)
    return note


@router.delete("/{note_id}")
def delete_note(
    note_id: int,
    session: Session = Depends(get_session),
    user=Depends(get_current_user),
):
    note = session.exec(
        select(Note).where(Note.id == note_id, Note.owner_id == user.id)
    ).first()

    if not note:
        raise HTTPException(status_code=404, detail="Note không tồn tại")

    session.delete(note)
    session.commit()
    return {"message": "Đã xoá"}
