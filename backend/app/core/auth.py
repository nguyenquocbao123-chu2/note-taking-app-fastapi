from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlmodel import Session, select
from app.core.security import SECRET_KEY, ALGORITHM
from app.models import User
from app.database import get_session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme),
                     session: Session = Depends(get_session)) -> User:

    credentials_exc = HTTPException(
        status_code=401,
        detail="Không thể xác thực người dùng",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        uid: int = payload.get("sub")
        if uid is None:
            raise credentials_exc

    except JWTError:
        raise credentials_exc

    user = session.exec(select(User).where(User.id == uid)).first()
    if not user:
        raise credentials_exc

    return user
