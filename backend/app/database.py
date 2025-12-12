from sqlmodel import create_engine, Session

DATABASE_URL = "postgresql://note_user:note123@localhost:5432/note_app"

engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session
