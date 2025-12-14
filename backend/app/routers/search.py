from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlmodel import Session
from app.database import get_session
from app.core.auth import get_current_user

router = APIRouter()

def build_prefix_tsquery(q: str) -> str:
    # biến "hoc fast" -> "hoc:* & fast:*"
    terms = [t.strip() for t in q.split() if t.strip()]
    # escape ký tự đặc biệt của tsquery
    safe = []
    for t in terms:
        t = t.replace("'", "''")
        safe.append(f"{t}:*")
    return " & ".join(safe) if safe else ""

@router.get("/")
def search_notes(
    q: str = "",
    session: Session = Depends(get_session),
    user=Depends(get_current_user),
):
    q = (q or "").strip()
    if not q:
        return []

    # ✅ 1-2 ký tự: dùng ILIKE để ra kết quả
    if len(q) <= 2:
        sql = text("""
            SELECT *
            FROM note
            WHERE owner_id = :uid
              AND (coalesce(title,'') ILIKE :likeq OR coalesce(content,'') ILIKE :likeq)
            ORDER BY id DESC
        """)
        result = session.execute(sql, {"uid": user.id, "likeq": f"%{q}%"})
        return result.mappings().all()

    # ✅ >= 3 ký tự: full-text + prefix
    tsq = build_prefix_tsquery(q)
    sql = text("""
        SELECT *
        FROM note
        WHERE owner_id = :uid
          AND to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(content,''))
              @@ to_tsquery('simple', :tsq)
        ORDER BY ts_rank(
            to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(content,'')),
            to_tsquery('simple', :tsq)
        ) DESC
        LIMIT 100
    """)
    result = session.execute(sql, {"uid": user.id, "tsq": tsq})
    return result.mappings().all()
