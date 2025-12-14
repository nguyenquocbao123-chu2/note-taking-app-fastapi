from typing import Optional, List
from datetime import datetime

from sqlmodel import SQLModel, Field, Relationship


# =========================
# NOTE - TAG LINK
# =========================
class NoteTag(SQLModel, table=True):
    note_id: int = Field(foreign_key="note.id", primary_key=True)
    tag_id: int = Field(foreign_key="tag.id", primary_key=True)


# =========================
# USER
# =========================
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    password_hash: str
    full_name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    notes: List["Note"] = Relationship(back_populates="owner")
    folders: List["Folder"] = Relationship(back_populates="owner")


# =========================
# FOLDER
# =========================
class Folder(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    parent_id: Optional[int] = Field(default=None, foreign_key="folder.id")
    owner_id: int = Field(foreign_key="user.id")

    owner: Optional[User] = Relationship(back_populates="folders")
    notes: List["Note"] = Relationship(back_populates="folder")


# =========================
# TAG
# =========================
class Tag(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    owner_id: int = Field(foreign_key="user.id")

    notes: List["Note"] = Relationship(
        back_populates="tags",
        link_model=NoteTag
    )


# =========================
# NOTE
# =========================
class Note(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    content: str
    bg: str = Field(default="#ffffff")

    folder_id: Optional[int] = Field(default=None, foreign_key="folder.id")
    owner_id: int = Field(foreign_key="user.id")
    is_archived: bool = False

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    owner: Optional[User] = Relationship(back_populates="notes")
    folder: Optional[Folder] = Relationship(back_populates="notes")
    tags: List[Tag] = Relationship(
        back_populates="notes",
        link_model=NoteTag
    )


# =========================
# SHARED LINK
# =========================
class SharedLink(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    note_id: int = Field(foreign_key="note.id")
    public_slug: str = Field(index=True, unique=True)
    expired_at: Optional[datetime] = None
    is_public: bool = True
