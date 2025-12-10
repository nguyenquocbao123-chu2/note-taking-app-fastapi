from pydantic import BaseModel
from typing import List, Optional


class TagBase(BaseModel):
    name: str


class Tag(TagBase):
    id: int

    class Config:
        orm_mode = True


class NoteBase(BaseModel):
    title: str
    content: str
    tags: List[int] = []


class Note(NoteBase):
    id: int

    class Config:
        orm_mode = True


class FolderBase(BaseModel):
    name: str


class Folder(FolderBase):
    id: int
    notes: List[Note] = []

    class Config:
        orm_mode = True
