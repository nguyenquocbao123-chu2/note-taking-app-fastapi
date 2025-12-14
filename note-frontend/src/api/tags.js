// src/api/tags.js
import api from "./client";

export async function getTags() {
  const res = await api.get("/tags");
  return res.data;
  
}
export async function getNotesByTag(tagId) {
  const res = await api.get(`/tags/${tagId}/notes`);
  return res.data;
}


// ✅ THÊM DÒNG NÀY (alias để khỏi lỗi import listTags)
export async function listTags() {
  return getTags();
}

export async function createTag(name) {
  const res = await api.post("/tags", { name });
  return res.data;
}

export async function renameTag(tagId, name) {
  const res = await api.put(`/tags/${tagId}`, { name });
  return res.data;
}

export async function deleteTag(tagId) {
  const res = await api.delete(`/tags/${tagId}`);
  return res.data;
}

export async function addTagToNote(noteId, tagId) {
  const res = await api.post(`/tags/add-to-note/${noteId}/${tagId}`);
  return res.data;
}

export async function removeTagFromNote(noteId, tagId) {
  const res = await api.delete(`/tags/remove-from-note/${noteId}/${tagId}`);
  return res.data;
}
