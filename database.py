import sqlite3
from datetime import datetime

DB_NAME = "database.db"


class Database:
    def __init__(self):
        self.conn = sqlite3.connect(DB_NAME, check_same_thread=False)
        self.cursor = self.conn.cursor()
        self.create_tables()

    def create_tables(self):
        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS users(
            telegram_id INTEGER PRIMARY KEY,
            username TEXT,
            first_name TEXT,
            last_name TEXT,
            tiktok TEXT,
            created_at TEXT
        )
        """)

        self.conn.commit()

    def add_user(
        self,
        telegram_id,
        username,
        first_name,
        last_name,
        tiktok
    ):

        self.cursor.execute("""
        INSERT OR REPLACE INTO users
        (
            telegram_id,
            username,
            first_name,
            last_name,
            tiktok,
            created_at
        )
        VALUES(?,?,?,?,?,?)
        """,
        (
            telegram_id,
            username,
            first_name,
            last_name,
            tiktok,
            datetime.now().strftime("%d.%m.%Y %H:%M")
        ))

        self.conn.commit()

    def get_all_users(self):

        self.cursor.execute("""
        SELECT *
        FROM users
        ORDER BY created_at DESC
        """)

        return self.cursor.fetchall()

    def get_user(self, telegram_id):

        self.cursor.execute("""
        SELECT *
        FROM users
        WHERE telegram_id=?
        """, (telegram_id,))

        return self.cursor.fetchone()

    def search(self, text):

        self.cursor.execute("""
        SELECT *
        FROM users
        WHERE
        username LIKE ?
        OR
        first_name LIKE ?
        OR
        tiktok LIKE ?
        """,
        (
            f"%{text}%",
            f"%{text}%",
            f"%{text}%"
        ))

        return self.cursor.fetchall()

    def delete(self, telegram_id):

        self.cursor.execute("""
        DELETE
        FROM users
        WHERE telegram_id=?
        """, (telegram_id,))

        self.conn.commit()

    def count(self):

        self.cursor.execute("""
        SELECT COUNT(*)
        FROM users
        """)

        return self.cursor.fetchone()[0]


db = Database()