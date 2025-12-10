from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/tags", tags=["Tags"])

@router.get("/")
def get_tags(db: Session = Depends(get_db)):
    return db.query(models.Tag).all()
