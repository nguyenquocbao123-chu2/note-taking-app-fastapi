from __future__ import annotations
from typing import Optional, List
from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlmodel import SQLModel, Field


# ===========================================================
# NOTE-TAG JOIN TABLE
# ===========================================================
class NoteTag(SQLModel, table=True):
    note_id: int = Field(foreign_key="note.id", primary_key=True)
    tag_id: int = Field(foreign_key="tag.id", primary_key=True)


# ===========================================================
# USER
# ===========================================================
class User(SQLModel, table=True):
    id: Optional[int] = mapped_column(primary_key=True)
    email: str = mapped_column(unique=True, index=True)
    password_hash: str
    full_name: Optional[str] = None
    created_at: datetime = mapped_column(default=datetime.utcnow)

    notes: Mapped[List["Note"]] = relationship(back_populates="owner")
    folders: Mapped[List["Folder"]] = relationship(back_populates="owner")


# ===========================================================
# FOLDER
# ===========================================================
class Folder(SQLModel, table=True):
    id: Optional[int] = mapped_column(primary_key=True)
    name: str
    parent_id: Optional[int] = Field(default=None, foreign_key="folder.id")
    owner_id: int = Field(foreign_key="user.id")

    owner: Mapped["User"] = relationship(back_populates="folders")
    notes: Mapped[List["Note"]] = relationship(back_populates="folder")


# ===========================================================
# TAG
# ===========================================================
class Tag(SQLModel, table=True):
    id: Optional[int] = mapped_column(primary_key=True)
    name: str
    owner_id: int = Field(foreign_key="user.id")

    notes: Mapped[List["Note"]] = relationship(
        secondary=NoteTag.__table__,
        back_populates="tags"
    )


# ===========================================================
# NOTE
# ===========================================================
class Note(SQLModel, table=True):
    id: Optional[int] = mapped_column(primary_key=True)
    title: str
    content: str
    folder_id: Optional[int] = Field(default=None, foreign_key="folder.id")
    owner_id: int = Field(foreign_key="user.id")
    is_archived: bool = Field(default=False)

    created_at: datetime = mapped_column(default=datetime.utcnow)
    updated_at: datetime = mapped_column(default=datetime.utcnow)

    owner: Mapped["User"] = relationship(back_populates="notes")
    folder: Mapped[Optional["Folder"]] = relationship(back_populates="notes")
    tags: Mapped[List["Tag"]] = relationship(
        secondary=NoteTag.__table__,
        back_populates="notes"
    )


# ===========================================================
# SHARED LINK
# ===========================================================
class SharedLink(SQLModel, table=True):
    id: Optional[int] = mapped_column(primary_key=True)
    note_id: int = Field(foreign_key="note.id")
    public_slug: str = mapped_column(unique=True, index=True)
    expired_at: Optional[datetime] = None
    is_public: bool = Field(default=True)
