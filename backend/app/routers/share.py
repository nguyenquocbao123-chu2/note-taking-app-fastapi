import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.models import Note, SharedLink
from app.core.auth import get_current_user
from app.database import get_session

router = APIRouter()


@router.post("/create/{note_id}")
def create_shared_link(note_id: int,
                       session: Session = Depends(get_session),
                       user=Depends(get_current_user)):

    note = session.exec(
        select(Note).where(Note.id == note_id, Note.owner_id == user.id)
    ).first()

    if not note:
        raise HTTPException(404, "Note không tồn tại")

    slug = uuid.uuid4().hex[:10]

    link = SharedLink(
        note_id=note_id,
        public_slug=slug,
        is_public=True
    )

    session.add(link)
    session.commit()
    session.refresh(link)

    return {"public_url": f"/public/{slug}"}


@router.get("/public/{slug}")
def get_public_note(slug: str,
                    session: Session = Depends(get_session)):

    link = session.exec(
        select(SharedLink).where(SharedLink.public_slug == slug)
    ).first()

    if not link or not link.is_public:
        raise HTTPException(404, "Link không hợp lệ")

    note = session.exec(
        select(Note).where(Note.id == link.note_id)
    ).first()

    return {
        "title": note.title,
        "content": note.content,
        "created_at": note.created_at,
        "updated_at": note.updated_at
    }


@router.delete("/disable/{note_id}")
def disable_share(note_id: int,
                  session: Session = Depends(get_session),
                  user=Depends(get_current_user)):

    link = session.exec(
        select(SharedLink).where(SharedLink.note_id == note_id)
    ).first()

    if not link:
        raise HTTPException(404, "Note này chưa bật chia sẻ")

    link.is_public = False
    session.add(link)
    session.commit()

    return {"message": "Đã tắt chia sẻ công khai"}
