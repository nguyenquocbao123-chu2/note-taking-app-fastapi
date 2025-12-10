from sqlalchemy import Column, Integer, String, Text, ForeignKey, Table
from sqlalchemy.orm import relationship
from .db import Base

note_tags_table = Table(
    "note_tags",
    Base.metadata,
    Column("note_id", ForeignKey("notes.id"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id"), primary_key=True),
)


class Folder(Base):
    __tablename__ = "folders"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    notes = relationship("Note", back_populates="folder")


class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, index=True)
    folder_id = Column(Integer, ForeignKey("folders.id"))
    title = Column(String, nullable=False)
    content = Column(Text)
    created_at = Column(String)

    folder = relationship("Folder", back_populates="notes")
    tags = relationship("Tag", secondary=note_tags_table, back_populates="notes")


class Tag(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    notes = relationship("Note", secondary=note_tags_table, back_populates="tags")
