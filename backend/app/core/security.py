from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from fastapi import HTTPException

SECRET_KEY = "super_secret_key_123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# bcrypt là chuẩn, nhưng có thể lỗi môi trường (đặc biệt Python quá mới)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _ensure_bcrypt_password_limit(password: str):
    # bcrypt chỉ xử lý tối đa 72 bytes
    if len(password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=400,
            detail="Mật khẩu quá dài (bcrypt giới hạn 72 bytes). Hãy dùng mật khẩu ngắn hơn.",
        )


def hash_password(password: str) -> str:
    _ensure_bcrypt_password_limit(password)
    try:
        return pwd_context.hash(password)
    except Exception:
        # Nếu bcrypt/passlib trên máy bị lỗi, báo rõ để sửa môi trường thay vì 500 mơ hồ
        raise HTTPException(
            status_code=500,
            detail="Lỗi mã hóa mật khẩu (bcrypt). Hãy cài đúng bcrypt/passlib hoặc dùng Python 3.10–3.12.",
        )


def verify_password(password: str, hashed: str) -> bool:
    _ensure_bcrypt_password_limit(password)
    try:
        return pwd_context.verify(password, hashed)
    except Exception:
        return False


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode["exp"] = expire
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
