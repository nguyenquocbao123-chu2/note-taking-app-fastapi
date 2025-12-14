import sqlite3

DB_PATH = "dev.db"

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

cur.execute("PRAGMA table_info(note);")
cols = [row[1] for row in cur.fetchall()]
print("Columns before:", cols)

if "bg" not in cols:
    cur.execute("ALTER TABLE note ADD COLUMN bg TEXT DEFAULT '#ffffff';")
    conn.commit()
    print("✅ Added column bg.")
else:
    print("✅ Column bg already exists.")

cur.execute("PRAGMA table_info(note);")
print("Columns after:", [row[1] for row in cur.fetchall()])

conn.close()
print("DONE")
