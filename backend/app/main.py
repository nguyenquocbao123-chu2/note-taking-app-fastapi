from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime

app = FastAPI()

# Cho phép React truy cập API FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # frontend chạy ở 5173
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =======================
#   DATA STRUCTURE
# =======================

class Note(BaseModel):
    id: int
    folder: str
    title: str
    content: str
    tags: List[str]
    created_at: datetime

FOLDERS = ["Personal", "Work", "School"]
notes_by_folder: Dict[str, List[Note]] = {f: [] for f in FOLDERS}
next_id = 1

# =======================
#   API ENDPOINTS
# =======================

@app.get("/folders")
def get_folders():
    return FOLDERS

@app.get("/notes/{folder}")
def get_notes(folder: str):
    return notes_by_folder.get(folder, [])

@app.post("/notes")
def create_note(note: Note):
    global next_id
    note.id = next_id
    next_id += 1
    note.created_at = datetime.utcnow()

    notes_by_folder[note.folder].append(note)
    return {"message": "Note created", "note": note}
