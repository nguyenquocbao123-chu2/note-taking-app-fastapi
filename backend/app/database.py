import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, Session, create_engine

# Load biến môi trường từ file .env (local)
# Trên Render thì env được set sẵn, load_dotenv không hại gì
load_dotenv()

# Nếu chưa có DATABASE_URL thì fallback SQLite để không "hỏng bài"
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# ✅ ÉP DÙNG psycopg3 khi là Postgres
# Render thường trả về "postgres://..."
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

# Chỉ dùng connect_args cho SQLite
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
