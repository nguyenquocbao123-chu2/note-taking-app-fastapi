import api from "./client";

export async function getNotes() {
  const res = await api.get("/notes");
  return res.data;
}

export async function getNote(id) {
  const res = await api.get(`/notes/${id}`);
  return res.data;
}

export async function createNote(title, content, folderId = null) {
  const res = await api.post("/notes", {
    title,
    content,
    folder_id: folderId,
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
  const res = await api.get("/search", {
    params: { q },
  });
  return res.data;
}
