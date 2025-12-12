from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.schemas import UserCreate, Token
from app.models import User
from app.core.security import hash_password, verify_password, create_access_token
from app.database import get_session

router = APIRouter()


@router.post("/register", response_model=Token)
def register(data: UserCreate, session: Session = Depends(get_session)):
    # check duplicate
    exists = session.exec(select(User).where(User.email == data.email)).first()
    if exists:
        raise HTTPException(400, "Email đã tồn tại")

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        full_name=data.full_name,
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    token = create_access_token({"sub": user.id})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
def login(data: UserCreate, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == data.email)).first()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(401, "Sai email hoặc mật khẩu")

    token = create_access_token({"sub": user.id})
    return {"access_token": token, "token_type": "bearer"}
