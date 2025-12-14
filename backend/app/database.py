import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, Session, create_engine

# Load biến môi trường từ file .env
load_dotenv()

# Nếu chưa có DATABASE_URL thì fallback SQLite để không "hỏng bài"
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    echo=True,
    connect_args=connect_args,
)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
