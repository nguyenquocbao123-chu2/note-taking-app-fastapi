from fastapi import FastAPI
from .db import Base, engine
from .routers import folder_router, note_router, tag_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(folder_router.router)
app.include_router(note_router.router)
app.include_router(tag_router.router)


@app.get("/")
def root():
    return {"status": "OK", "message": "Note API running!"}
