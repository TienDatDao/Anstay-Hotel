import os
import sqlite3

DB_FILE = "hotel.db"

def reset_sqlite():
    """Xóa toàn bộ dữ liệu trong các bảng SQLite và reset khóa chính tự tăng."""
    if not os.path.exists(DB_FILE):
        print(f"[-] Không tìm thấy file cơ sở dữ liệu '{DB_FILE}'. Chưa có dữ liệu để xóa.")
        return

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    try:
        # 1. Xóa toàn bộ dữ liệu trong bảng bookings và contacts
        cursor.execute("DELETE FROM bookings;")
        cursor.execute("DELETE FROM contacts;")

        # 2. Reset bộ đếm ID tự tăng (AUTOINCREMENT) về 0 (để đơn tiếp theo bắt đầu từ #1)
        cursor.execute("DELETE FROM sqlite_sequence WHERE name IN ('bookings', 'contacts');")

        # 3. Thu dọn và giải phóng dung lượng đĩa
        conn.commit()
        cursor.execute("VACUUM;")
        print("[✓] Đã xóa sạch dữ liệu trong bảng 'bookings' và 'contacts' (ID đã đặt lại về #1).")

    except sqlite3.OperationalError as e:
        print(f"[!] Lỗi khi truy vấn SQLite (có thể bảng chưa được tạo): {e}")
    finally:
        conn.close()

def reset_google_sheets():
    """Xóa các dòng dữ liệu trên Google Sheets, chỉ giữ lại hàng tiêu đề (Dòng 1)."""
    try:
        import gspread
        credentials_file = "credentials.json"
        sheet_name = "ANSTAY_BOOKINGS"

        if not os.path.exists(credentials_file):
            print("[-] Bỏ qua Google Sheets vì không tìm thấy 'credentials.json'.")
            return

        gc = gspread.service_account(filename=credentials_file)
        sheet = gc.open(sheet_name).sheet1

        # Lấy tổng số dòng hiện có
        all_values = sheet.get_all_values()
        total_rows = len(all_values)

        if total_rows > 1:
            # Xóa từ dòng thứ 2 đến hết (giữ lại dòng 1 làm tiêu đề)
            sheet.delete_rows(2, total_rows)
            print(f"[✓] Đã xóa {total_rows - 1} dòng dữ liệu trên Google Sheets '{sheet_name}'.")
        else:
            print("[✓] Google Sheets hiện không có dữ liệu đặt phòng nào để xóa.")

    except Exception as e:
        print(f"[!] Bỏ qua dọn dẹp Google Sheets (lỗi kết nối hoặc chưa chia sẻ quyền): {e}")

if __name__ == "__main__":
    confirm = input("CẢNH BÁO: Thao tác này sẽ XÓA SẠCH toàn bộ đơn đặt phòng và liên hệ!\nBạn có chắc chắn muốn xóa không? (y/n): ")
    if confirm.strip().lower() in ("y", "yes"):
        print("\n--- Đang tiến hành reset ---")
        reset_sqlite()
        reset_google_sheets()
        print("--- Hoàn tất reset hệ thống! ---\n")
    else:
        print("Đã hủy thao tác.")