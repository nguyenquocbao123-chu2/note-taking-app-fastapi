from sqlmodel import SQLModel
from app.database import engine



from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, notes, folders, tags, search, share

app = FastAPI(title="Note Taking App Backend")

from app.database import init_db
init_db()





@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# ==========================
# FIX CORS ERROR TẠI ĐÂY
# ==========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # CHO PHÉP TẤT CẢ
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# ROUTERS
# ==========================
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(notes.router, prefix="/notes", tags=["Notes"])
app.include_router(folders.router, prefix="/folders", tags=["Folders"])
app.include_router(tags.router, prefix="/tags", tags=["Tags"])
app.include_router(search.router, prefix="/search", tags=["Search"])
app.include_router(share.router, prefix="/share", tags=["Share"])

@app.get("/")
def root():
    return {"message": "Backend chạy OK"}

