import api from "./client";

export async function getNotes() {
  const res = await api.get("/notes");
  return res.data;
}

export async function getNote(id) {
  const res = await api.get(`/notes/${id}`);
  return res.data;
}

// ✅ FIX: nhận object {title, content, bg, folder_id}
export async function createNote(payload) {
  const { title, content, bg, folder_id = null } = payload || {};

  // Nếu backend của bạn CHƯA có cột bg thì xóa dòng bg bên dưới
  const res = await api.post("/notes", {
    title,
    content,
    bg,
    folder_id,
  });

  return res.data;
}

export async function updateNote(id, data) {
  const res = await api.put(`/notes/${id}`, data);
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
