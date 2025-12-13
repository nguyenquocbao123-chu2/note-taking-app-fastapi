from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlmodel import Session, select

from app.core.security import SECRET_KEY, ALGORITHM
from app.database import get_session
from app.models import User

# tokenUrl nên là path đúng (không cần dấu / ở đầu)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
) -> User:
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Không thể xác thực người dùng",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        sub = payload.get("sub")
        if sub is None:
            raise credentials_exc

        # ✅ sub trong JWT bạn đang lưu là string ("1", "2"...)
        # nên phải convert sang int trước khi query DB
        uid = int(sub)

    except (JWTError, ValueError, TypeError):
        raise credentials_exc

    user = session.exec(select(User).where(User.id == uid)).first()
    if not user:
        raise credentials_exc

    return user
