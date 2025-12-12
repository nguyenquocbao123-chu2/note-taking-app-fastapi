from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


# ================= USER =====================
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None


class UserRead(BaseModel):
    id: int
    email: str
    full_name: Optional[str]

    class Config:
        from_attributes = True


# ================= AUTH TOKEN =====================
class Token(BaseModel):
    access_token: str
    token_type: str


# ================= FOLDER =====================

class FolderBase(BaseModel):
    name: str
    parent_id: Optional[int] = None


class FolderCreate(FolderBase):
    pass


class FolderRead(FolderBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True


# ================= NOTE =====================

class NoteBase(BaseModel):
    title: str
    content: str


class NoteCreate(NoteBase):
    folder_id: Optional[int] = None


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    folder_id: Optional[int] = None
    is_archived: Optional[bool] = None


class NoteRead(NoteBase):
    id: int
    folder_id: Optional[int]
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ================= TAG =====================

class TagCreate(BaseModel):
    name: str


class TagRead(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True
