from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.schemas import FolderCreate, FolderRead
from app.models import Folder, Note
from app.core.auth import get_current_user
from app.database import get_session

router = APIRouter()


@router.post("/", response_model=FolderRead)
def create_folder(data: FolderCreate,
                  session: Session = Depends(get_session),
                  user=Depends(get_current_user)):

    folder = Folder(
        name=data.name,
        parent_id=data.parent_id,
        owner_id=user.id
    )

    session.add(folder)
    session.commit()
    session.refresh(folder)
    return folder


@router.get("/", response_model=list[FolderRead])
def list_folders(session: Session = Depends(get_session),
                 user=Depends(get_current_user)):

    folders = session.exec(
        select(Folder).where(Folder.owner_id == user.id)
    ).all()

    return folders


@router.get("/{folder_id}", response_model=FolderRead)
def get_folder(folder_id: int,
               session: Session = Depends(get_session),
               user=Depends(get_current_user)):

    folder = session.exec(
        select(Folder).where(
            Folder.id == folder_id,
            Folder.owner_id == user.id
        )
    ).first()

    if not folder:
        raise HTTPException(404, "Folder không tồn tại")

    return folder


@router.put("/{folder_id}", response_model=FolderRead)
def update_folder(folder_id: int,
                  data: FolderCreate,
                  session: Session = Depends(get_session),
                  user=Depends(get_current_user)):

    folder = session.exec(
        select(Folder).where(
            Folder.id == folder_id,
            Folder.owner_id == user.id
        )
    ).first()

    if not folder:
        raise HTTPException(404, "Folder không tồn tại")

    folder.name = data.name
    folder.parent_id = data.parent_id

    session.add(folder)
    session.commit()
    session.refresh(folder)
    return folder


@router.delete("/{folder_id}")
def delete_folder(folder_id: int,
                  session: Session = Depends(get_session),
                  user=Depends(get_current_user)):

    folder = session.exec(
        select(Folder).where(
            Folder.id == folder_id,
            Folder.owner_id == user.id
        )
    ).first()

    if not folder:
        raise HTTPException(404, "Folder không tồn tại")

    # Kiểm tra note trong folder
    notes = session.exec(
        select(Note).where(Note.folder_id == folder_id)
    ).all()

    if notes:
        raise HTTPException(400, "Folder không thể xoá vì đang chứa ghi chú")

    # Kiểm tra folder con
    children = session.exec(
        select(Folder).where(Folder.parent_id == folder_id)
    ).all()

    if children:
        raise HTTPException(400, "Folder không thể xoá vì đang chứa folder con")

    session.delete(folder)
    session.commit()
    return {"message": "Đã xoá folder thành công"}
