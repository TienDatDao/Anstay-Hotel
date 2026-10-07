import os
import gspread
from typing import Dict, Any

CREDENTIALS_FILE = "credentials.json"
SHEET_NAME = "ANSTAY_BOOKINGS"  # Tên chính xác của file Google Sheets bạn tạo

def get_sheet():
    """Khởi tạo kết nối gspread tới Google Sheet."""
    if not os.path.exists(CREDENTIALS_FILE):
        return None
    try:
        gc = gspread.service_account(filename=CREDENTIALS_FILE)
        return gc.open(SHEET_NAME).sheet1
    except Exception as e:
        print(f"[Google Sheets Error] Kết nối thất bại: {e}")
        return None

def sync_booking_to_sheet(booking_id: int, data: Dict[str, Any]):
    """Ghi thêm một hàng mới vào Google Sheet."""
    sheet = get_sheet()
    if not sheet:
        print("[Google Sheets Warning] Bỏ qua đồng bộ vì chưa cấu hình file credentials.json hoặc chưa tạo file Sheet.")
        return

    try:
        # Định dạng danh sách phòng: "LP01 Standard Room x 2; LP03 Deluxe Room x 1"
        rooms_summary = "; ".join([
            f"{r['code']} {r['name']} x {r['qty']}" for r in data["selected_rooms"]
        ])
        
        row_values = [
            f"#{booking_id}",
            data["name"],
            data["phone"],
            data.get("email", ""),
            data["check_in"],
            data["check_out"],
            data["nights"],
            rooms_summary,
            data["total_rooms"],
            f"{data['adults']} lớn, {data['kids']} trẻ",
            f"{data['total_price']:,}đ".replace(",", "."),
            data.get("note", ""),
            "Chờ xác nhận"  # Cột trạng thái để lễ tân bấm chọn/sửa
        ]
        
        sheet.append_row(row_values)
        print(f"[Google Sheets Success] Đã đồng bộ đơn #{booking_id}")
    except Exception as e:
        print(f"[Google Sheets Error] Không thể ghi hàng mới: {e}")