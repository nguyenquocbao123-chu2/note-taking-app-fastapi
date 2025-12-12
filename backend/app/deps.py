from sqlmodel import Session
from fastapi import Depends
from app.database import get_session

def get_db() -> Session:
    return next(get_session())
