from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/notes", tags=["Notes"])


@router.get("/{folder_id}")
def get_notes(folder_id: int, db: Session = Depends(get_db)):
    return db.query(models.Note).filter(models.Note.folder_id == folder_id).all()


@router.post("/")
def create_note(note: schemas.NoteBase, db: Session = Depends(get_db)):
    new_note = models.Note(
        title=note.title,
        content=note.content,
        folder_id=1  # tạm hardcode, sẽ sửa sau
    )
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note
