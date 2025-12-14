import api from "./client";

export const getNotes = async () => {
  const res = await api.get("/notes");
  return res.data;
};

export const getTrashNotes = async () => {
  const res = await api.get("/notes/trash");
  return res.data;
};

export const createNote = async (payload) => {
  const res = await api.post("/notes", payload);
  return res.data;
};

export const updateNote = async (id, payload) => {
  const res = await api.put(`/notes/${id}`, payload);
  return res.data;
};

// SOFT DELETE -> vào thùng rác
export const deleteNote = async (id) => {
  const res = await api.delete(`/notes/${id}`);
  return res.data;
};

export const restoreNote = async (id) => {
  const res = await api.put(`/notes/${id}/restore`);
  return res.data;
};

export const searchNotes = async (q) => {
  const res = await api.get(`/search`, { params: { q } });
  return res.data;
};

export const deleteForeverNote = async (noteId) => {
  const res = await api.delete(`/notes/${noteId}/hard`);
  return res.data;
};

// =====================
// ✅ ARCHIVE
// =====================
export const getArchivedNotes = async () => {
  const res = await api.get("/notes/archived");
  return res.data;
};

export const archiveNote = async (id) => {
  const res = await api.put(`/notes/${id}/archive`);
  return res.data;
};

export const unarchiveNote = async (id) => {
  const res = await api.put(`/notes/${id}/unarchive`);
  return res.data;
};
