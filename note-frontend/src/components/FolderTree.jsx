import React, { useMemo, useState } from "react";
import "./FolderTree.css";

function groupKeyFromNote(note) {
  const t = (note?.title || "").trim();
  if (!t) return "Không tiêu đề";
  const ch = t[0].toUpperCase();
  if (!/[A-Z0-9À-Ỵ]/i.test(ch)) return "#";
  return ch;
}

function buildTreeFromNotes(notes = []) {
  const groupsMap = new Map();
  for (const n of notes) {
    const key = groupKeyFromNote(n);
    if (!groupsMap.has(key)) groupsMap.set(key, []);
    groupsMap.get(key).push(n);
  }

  const groupNames = Array.from(groupsMap.keys()).sort((a, b) =>
    a.localeCompare(b, "vi")
  );

  const children = groupNames.map((g) => ({
    id: `group:${g}`,
    type: "folder",
    name: g,
    children: (groupsMap.get(g) || []).map((note) => ({
      id: `note:${note.id}`,
      type: "note",
      note,
      title: note.title || "(Không tiêu đề)",
    })),
  }));

  return [
    { id: "root:notes", type: "folder", name: "Ghi chú", children },
  ];
}

function TreeNode({ node, depth, expanded, toggle, onSelectNote }) {
  const paddingLeft = 10 + depth * 14;

  if (node.type === "folder") {
    const open = !!expanded[node.id];
    return (
      <li className="ft-item">
        <button
          type="button"
          className="ft-row ft-folder"
          style={{ paddingLeft }}
          onClick={() => toggle(node.id)}
        >
          <span className={`ft-arrow ${open ? "open" : ""}`}>▶</span>
          <span className="ft-icon">{open ? "📂" : "📁"}</span>
          <span className="ft-name">{node.name}</span>
          <span className="ft-count">{node.children?.length || 0}</span>
        </button>

        <ul className={`ft-children ${open ? "open" : ""}`}>
          {node.children?.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              toggle={toggle}
              onSelectNote={onSelectNote}
            />
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li className="ft-item">
      <button
        type="button"
        className="ft-row ft-note"
        style={{ paddingLeft }}
        onClick={() => onSelectNote?.(node.note)}
        title={node.title}
      >
        <span className="ft-arrow-placeholder" />
        <span className="ft-icon">📝</span>
        <span className="ft-name">{node.title}</span>
      </button>
    </li>
  );
}

export default function FolderTree({ notes = [], onSelectNote, title = "Ghi chú" }) {
  const treeData = useMemo(() => buildTreeFromNotes(notes), [notes]);
  const [expanded, setExpanded] = useState({ "root:notes": true });

  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="folder-tree">
      <div className="ft-title">{title}</div>

      {(!notes || notes.length === 0) ? (
        <div className="ft-empty">📁 Chưa có dữ liệu</div>
      ) : (
        <ul className="ft-root">
          {treeData.map((n) => (
            <TreeNode
              key={n.id}
              node={n}
              depth={0}
              expanded={expanded}
              toggle={toggle}
              onSelectNote={onSelectNote}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
