from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.schemas import UserCreate, Token, UserLogin
from app.models import User
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter(tags=["auth"])



# ======================
# REGISTER (KHÔNG LOGIN)
# ======================
@router.post("/register")
def register(data: UserCreate, session: Session = Depends(get_session)):
    exists = session.exec(
        select(User).where(User.email == data.email)
    ).first()

    if exists:
        raise HTTPException(status_code=400, detail="Email đã tồn tại")

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        full_name=data.full_name,
    )

    try:
        session.add(user)
        session.commit()
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail="Lỗi tạo tài khoản")

    return {
        "message": "Đăng ký thành công. Vui lòng đăng nhập."
    }


# ======================
# LOGIN
# ======================
@router.post("/login", response_model=Token)
def login(data: UserLogin, session: Session = Depends(get_session)):
    user = session.exec(
        select(User).where(User.email == data.email)
    ).first()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Sai email hoặc mật khẩu")

    token = create_access_token({"sub": str(user.id)})

    return {
        "access_token": token,
        "token_type": "bearer"
    }
