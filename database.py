import os
import sqlite3
import json
from typing import List, Dict, Any, Optional

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "hotel.db")

def get_connection():
    """Tạo kết nối tới SQLite, thiết lập row_factory để trả về dạng dictionary."""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Khởi tạo các bảng cơ sở dữ liệu nếu chưa tồn tại."""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Bảng đặt phòng
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_request_id TEXT UNIQUE,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            check_in TEXT NOT NULL,
            check_out TEXT NOT NULL,
            nights INTEGER NOT NULL,
            rooms_detail TEXT NOT NULL,
            total_rooms INTEGER NOT NULL,
            adults INTEGER NOT NULL,
            kids INTEGER NOT NULL,
            total_guests INTEGER NOT NULL,
            total_price INTEGER NOT NULL,
            note TEXT,
            status TEXT DEFAULT 'Chờ xác nhận',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # Bảng liên hệ
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    conn.commit()
    conn.close()

def insert_booking(data: Dict[str, Any]) -> int:
    """Lưu yêu cầu đặt phòng vào SQL. Nếu trùng client_request_id sẽ trả về ID cũ."""
    conn = get_connection()
    cursor = conn.cursor()
    
    rooms_json = json.dumps(data["selected_rooms"], ensure_ascii=False)
    
    try:
        cursor.execute("""
            INSERT INTO bookings (
                client_request_id, name, phone, email, check_in, check_out,
                nights, rooms_detail, total_rooms, adults, kids, total_guests,
                total_price, note
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data["client_request_id"],
            data["name"],
            data["phone"],
            data.get("email", ""),
            data["check_in"],
            data["check_out"],
            data["nights"],
            rooms_json,
            data["total_rooms"],
            data["adults"],
            data["kids"],
            data["total_guests"],
            data["total_price"],
            data.get("note", "")
        ))
        conn.commit()
        booking_id = cursor.lastrowid
    except sqlite3.IntegrityError:
        # Nếu bị gửi lặp do mạng lag (trùng client_request_id), lấy lại ID cũ
        cursor.execute("SELECT id FROM bookings WHERE client_request_id = ?", (data["client_request_id"],))
        row = cursor.fetchone()
        booking_id = row["id"]
    finally:
        conn.close()
        
    return booking_id

def insert_contact(name: str, email: str, phone: Optional[str], message: str) -> int:
    """Lưu thông tin liên hệ vào SQL."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO contacts (name, email, phone, message)
        VALUES (?, ?, ?, ?)
    """, (name, email, phone or "", message))
    conn.commit()
    contact_id = cursor.lastrowid
    conn.close()
    return contact_id