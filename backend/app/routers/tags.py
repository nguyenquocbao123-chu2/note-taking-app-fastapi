from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.schemas import TagCreate, TagRead
from app.models import Tag, Note, NoteTag
from app.core.auth import get_current_user
from app.database import get_session

router = APIRouter()


@router.post("/", response_model=TagRead)
def create_tag(data: TagCreate,
               session: Session = Depends(get_session),
               user=Depends(get_current_user)):

    tag = Tag(name=data.name, owner_id=user.id)
    session.add(tag)
    session.commit()
    session.refresh(tag)
    return tag


@router.get("/", response_model=list[TagRead])
def list_tags(session: Session = Depends(get_session),
              user=Depends(get_current_user)):
    tags = session.exec(
        select(Tag).where(Tag.owner_id == user.id)
    ).all()
    return tags


@router.post("/add-to-note/{note_id}/{tag_id}")
def add_tag_to_note(note_id: int,
                    tag_id: int,
                    session: Session = Depends(get_session),
                    user=Depends(get_current_user)):

    note = session.exec(
        select(Note).where(Note.id == note_id, Note.owner_id == user.id)
    ).first()

    if not note:
        raise HTTPException(404, "Note không tồn tại")

    tag = session.exec(
        select(Tag).where(Tag.id == tag_id, Tag.owner_id == user.id)
    ).first()

    if not tag:
        raise HTTPException(404, "Tag không tồn tại")

    exists = session.exec(
        select(NoteTag).where(NoteTag.note_id == note_id, NoteTag.tag_id == tag_id)
    ).first()

    if exists:
        return {"message": "Tag đã được gắn vào note này"}

    nt = NoteTag(note_id=note_id, tag_id=tag_id)
    session.add(nt)
    session.commit()
    return {"message": "Đã gắn tag vào note"}


@router.delete("/remove-from-note/{note_id}/{tag_id}")
def remove_tag_from_note(note_id: int,
                         tag_id: int,
                         session: Session = Depends(get_session),
                         user=Depends(get_current_user)):

    record = session.exec(
        select(NoteTag).where(NoteTag.note_id == note_id, NoteTag.tag_id == tag_id)
    ).first()

    if not record:
        raise HTTPException(404, "Note không có tag này")

    session.delete(record)
    session.commit()
    return {"message": "Đã gỡ tag khỏi note"}
