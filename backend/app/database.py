import os
from sqlmodel import create_engine, Session
from dotenv import load_dotenv

# Load biến môi trường từ file .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL chưa được cấu hình trong .env")

engine = create_engine(
    DATABASE_URL,
    echo=True,
    connect_args={"check_same_thread": False}
    if DATABASE_URL.startswith("sqlite")
    else {},
)

def get_session():
    with Session(engine) as session:
        yield session
