-- ===============================
--  TABLE: users
-- ===============================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===============================
--  TABLE: folders
-- ===============================
CREATE TABLE folders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===============================
--  TABLE: notes
-- ===============================
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    folder_id INT REFERENCES folders(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===============================
--  TABLE: note_tags
-- ===============================
CREATE TABLE note_tags (
    id SERIAL PRIMARY KEY,
    note_id INT REFERENCES notes(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL
);
