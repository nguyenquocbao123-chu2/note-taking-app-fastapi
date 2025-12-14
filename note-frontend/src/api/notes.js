import api from "./client";

export async function getNotes() {
  const res = await api.get("/notes");
  return res.data;
}

export async function getNote(id) {
  const res = await api.get(`/notes/${id}`);
  return res.data;
}

// ✅ createNote nhận object: { title, content, bg, folder_id }
export async function createNote(payload = {}) {
  const title = (payload.title ?? "").toString();
  const content = (payload.content ?? "").toString();
  const bg = payload.bg ?? "#ffffff";
  const folder_id = payload.folder_id ?? null;

  // tránh tạo note rỗng
  if (!title.trim() && !content.trim()) {
    return null;
  }

  const body = {
    title,
    content,
    folder_id,
    bg, // backend có bg thì OK
  };

  // nếu bg bị undefined/null thì loại bỏ luôn cho sạch
  if (body.bg == null) delete body.bg;

  const res = await api.post("/notes", body);
  return res.data;
}

export async function updateNote(id, data = {}) {
  const body = { ...data };

  // Nếu bg bị undefined/null thì đừng gửi
  if (body.bg == null) delete body.bg;

  const res = await api.put(`/notes/${id}`, body);
  return res.data;
}

export async function deleteNote(id) {
  const res = await api.delete(`/notes/${id}`);
  return res.data;
}

export async function searchNotes(q) {
  const res = await api.get("/search", { params: { q } });
  return res.data;
}
