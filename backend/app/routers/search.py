from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.models import Note
from app.schemas import NoteRead
from app.database import get_session
from app.core.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=list[NoteRead])
def search_notes(q: str = "",
                 session: Session = Depends(get_session),
                 user=Depends(get_current_user)):

    if not q or q.strip() == "":
        return []

    q = f"%{q}%"

    notes = session.exec(
        select(Note).where(
            Note.owner_id == user.id,
            (Note.title.ilike(q)) | (Note.content.ilike(q))
        )
    ).all()

    return notes
