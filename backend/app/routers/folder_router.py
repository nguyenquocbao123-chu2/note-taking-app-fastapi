from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/folders", tags=["Folders"])


@router.get("/")
def get_folders(db: Session = Depends(get_db)):
    return db.query(models.Folder).all()


@router.post("/")
def create_folder(folder: schemas.FolderBase, db: Session = Depends(get_db)):
    new_folder = models.Folder(name=folder.name)
    db.add(new_folder)
    db.commit()
    db.refresh(new_folder)
    return new_folder
