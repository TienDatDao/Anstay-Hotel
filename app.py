from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import database
import sheets

app = FastAPI(title="Anstay Hotel API")

# Cấu hình CORS để front-end gọi được API mà không bị chặn
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Khi deploy thực tế, thay bằng domain chính thức
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Khởi tạo bảng cơ sở dữ liệu khi khởi động
@app.on_event("startup")
def on_startup():
    database.init_db()

# --- Schema dữ liệu ---
class SelectedRoomItem(BaseModel):
    code: str
    name: str
    price: int
    qty: int

class BookingRequest(BaseModel):
    client_request_id: str
    name: str
    phone: str
    email: Optional[str] = ""
    check_in: str
    check_out: str
    nights: int
    selected_rooms: List[SelectedRoomItem]
    total_rooms: int
    adults: int
    kids: int
    total_guests: int
    total_price: int
    note: Optional[str] = ""

class ContactRequest(BaseModel):
    name: str
    email: str
    phone: Optional[str] = ""
    message: str

# --- Endpoints ---
@app.post("/api/bookings")
def create_booking(req: BookingRequest, bg: BackgroundTasks):
    try:
        # 1. Ghi dữ liệu trực tiếp vào SQL Database trước
        booking_id = database.insert_booking(req.model_dump())
        
        # 2. Đưa tác vụ đẩy sang Google Sheets vào hàng đợi chạy ngầm (Background Task)
        bg.add_task(sheets.sync_booking_to_sheet, booking_id, req.model_dump())
        
        # 3. Trả ngay mã số ID cho người dùng để xác nhận thành công
        return {
            "status": "success",
            "booking_id": booking_id,
            "message": "Đã lưu yêu cầu đặt phòng thành công vào hệ thống CSDL."
        }
    except Exception as e:
        print(f"[Error API Booking] {e}")
        raise HTTPException(status_code=500, detail="Không thể lưu trữ yêu cầu vào cơ sở dữ liệu.")

@app.post("/api/contacts")
def create_contact(req: ContactRequest):
    try:
        contact_id = database.insert_contact(req.name, req.email, req.phone, req.message)
        return {
            "status": "success",
            "contact_id": contact_id,
            "message": "Đã tiếp nhận thông tin liên hệ."
        }
    except Exception as e:
        print(f"[Error API Contact] {e}")
        raise HTTPException(status_code=500, detail="Lỗi khi ghi nhận thông tin liên hệ.")