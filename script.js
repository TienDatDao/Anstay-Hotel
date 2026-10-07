/* ANSTAY HOTEL – script.js */
'use strict';

/* =========================================================
   1. DỮ LIỆU KHÁCH SẠN VÀ PHÒNG
   ========================================================= */
const HOTEL = {
  totalRooms: 40,
  checkIn: '14:00',
  checkOut: '12:00',
  phone: '0988 226 789',
  email: 'booking@anstayhotel.vn',
  address: 'Khu A, hồ Đại Lải, Xuân Hòa, Phú Thọ, Việt Nam'
};

const IMG = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1100&q=80`;

const ROOMS = [
  {
    code: 'LP01',
    name: 'Standard Room',
    area: 22,
    guests: 2,
    quantity: 12,
    bed: '1 giường đôi',
    price: 650000,
    img: IMG('photo-1631049307264-da0ec9d70304'),
    desc: 'Phòng gọn gàng, đầy đủ tiện nghi cần thiết cho chuyến đi ngắn ngày.',
    amen: ['Wi-Fi miễn phí', 'Điều hòa', 'Smart TV', 'Phòng tắm riêng']
  },
  {
    code: 'LP02',
    name: 'Superior Room',
    area: 26,
    guests: 2,
    quantity: 8,
    bed: '1 giường đôi hoặc 2 giường đơn',
    price: 750000,
    img: IMG('photo-1618773928121-c32242e63f39'),
    desc: 'Rộng rãi hơn, có bàn làm việc nhỏ, phù hợp cặp đôi và khách công tác.',
    amen: ['Wi-Fi miễn phí', 'Điều hòa', 'Smart TV', 'Bàn làm việc', 'Nước uống']
  },
  {
    code: 'LP03',
    name: 'Deluxe Room',
    area: 30,
    guests: 3,
    quantity: 7,
    bed: '1 giường đôi lớn',
    price: 850000,
    img: IMG('photo-1590490360182-c33d57733427'),
    desc: 'Không gian thoáng, nội thất ấm áp, ánh sáng tự nhiên và góc nghỉ thư giãn.',
    amen: ['Wi-Fi miễn phí', 'Smart TV', 'Tủ lạnh mini', 'Máy sấy tóc', 'Đồ vệ sinh cá nhân']
  },
  {
    code: 'LP04',
    name: 'Executive Room',
    area: 35,
    guests: 3,
    quantity: 5,
    bed: '1 giường King',
    price: 990000,
    img: IMG('photo-1611892440504-42a792e24d32'),
    desc: 'Hạng phòng cao cấp hơn với giường King, khu làm việc riêng và phòng tắm đứng tiện nghi.',
    amen: ['Wi-Fi miễn phí', 'Smart TV lớn', 'Tủ lạnh mini', 'Bàn làm việc', 'Máy sấy tóc', 'Dọn phòng ưu tiên']
  },
  {
    code: 'LP05',
    name: 'Junior Balcony',
    area: 38,
    guests: 3,
    quantity: 4,
    bed: '1 giường đôi lớn',
    price: 1090000,
    img: IMG('photo-1578683010236-d716f9a3f461'),
    desc: 'Phòng có ban công riêng, tạo không gian thư giãn thoáng đãng trong kỳ lưu trú.',
    amen: ['Ban công', 'Wi-Fi miễn phí', 'Smart TV', 'Tủ lạnh mini', 'Nước uống']
  },
  {
    code: 'LP06',
    name: 'Family Room',
    area: 45,
    guests: 5,
    quantity: 4,
    bed: '1 giường đôi lớn + 2 giường đơn',
    price: 1250000,
    img: IMG('photo-1582719478250-c89cae4dc85b'),
    desc: 'Phòng rộng dành cho gia đình hoặc nhóm bạn, phù hợp tối đa 5 khách.',
    amen: ['Phù hợp gia đình / nhóm', 'Wi-Fi miễn phí', 'Điều hòa', 'Smart TV', 'Tủ lạnh mini', 'Phòng tắm riêng']
  }
];

const $ = s => document.querySelector(s); const $$ = s => [...document.querySelectorAll(s)];
const money = v => Number(v || 0).toLocaleString('vi-VN') + 'đ';

/* =========================================================
   2. ẢNH DỰ PHÒNG
   ========================================================= */
function fallbackImage(label = 'ANSTAY HOTEL') {
  const safe = String(label).replace(/[<>&"']/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#6f655b"/><text x="600" y="420" text-anchor="middle" font-family="Arial" font-size="44" fill="#ffffff">${safe}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function attachImageFallback(img, label) {
  if (!img) return;
  img.addEventListener('error', () => {
    if (img.src.startsWith('data:image/svg+xml')) return;
    img.src = fallbackImage(label || img.alt);
  }, { once: true });
}

/* =========================================================
   3. MENU MOBILE & HEADER SCROLL
   ========================================================= */
const header = $('#header');
const nav = $('#mainNav');
const menuToggle = $('#menuToggle');
const toTop = $('#toTop');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    header.classList.toggle('menu-open', isOpen);
  });
}

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    if (menuToggle) menuToggle.classList.remove('open');
    header.classList.remove('menu-open');
  });
});

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
  toTop.classList.toggle('show', window.scrollY > 500);
}, { passive: true });

toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* =========================================================
   4. RENDER PHÒNG NGHỈ
   ========================================================= */
const roomGrid = $('#roomGrid');
const toggleRoomsBtn = $('#toggleRooms');
let showAllRooms = false;

function renderRooms() {
  if (!roomGrid) return;
  roomGrid.innerHTML = '';
  ROOMS.forEach((room, index) => {
    const card = document.createElement('article');
    card.className = `room-card${index >= 3 ? ' is-hidden' : ''}`;
    card.innerHTML = `
      <div class="room-image-wrap">
        <img src="${room.img}" alt="${room.name}" loading="lazy">
        <span class="room-stock">Quy mô: ${room.quantity} phòng</span>
      </div>
      <div class="room-body">
        <span class="room-code">${room.code}</span>
        <h3>${room.name}</h3>
        <p class="meta">${room.area} m² · Tối đa ${room.guests} khách · ${room.bed}</p>
        <p class="desc">${room.desc}</p>
        <ul class="tags">${room.amen.slice(0, 3).map(i => `<li>${i}</li>`).join('')}</ul>
        <p class="price">${money(room.price)} <small>/ phòng / đêm</small></p>
        <div class="room-actions">
          <button class="btn btn-outline btn-sm" type="button" data-detail="${index}">Xem chi tiết</button>
          <button class="btn btn-primary btn-sm" type="button" data-book="${index}">Chọn phòng</button>
        </div>
      </div>`;
    roomGrid.appendChild(card);
    attachImageFallback(card.querySelector('img'), room.name);
  });
}
renderRooms();

if (toggleRoomsBtn) {
  toggleRoomsBtn.addEventListener('click', () => {
    showAllRooms = !showAllRooms;
    roomGrid.querySelectorAll('.room-card').forEach((card, idx) => {
      if (idx < 3) return;
      card.classList.toggle('is-hidden', !showAllRooms);
    });
    toggleRoomsBtn.textContent = showAllRooms ? 'Thu gọn' : 'Xem tất cả phòng';
  });
}

roomGrid.addEventListener('click', e => {
  const detail = e.target.closest('[data-detail]');
  const book = e.target.closest('[data-book]');
  if (detail) openRoomModal(Number(detail.dataset.detail));
  if (book) bookRoom(Number(book.dataset.book));
});

/* =========================================================
   5. MODAL CHI TIẾT VÀ MODAL THÔNG BÁO
   ========================================================= */
const roomModal = $('#roomModal');
const noticeModal = $('#noticeModal');
let currentRoomIndex = 0;

function openModal(modal) {
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModals() {
  roomModal.hidden = true;
  noticeModal.hidden = true;
  document.body.style.overflow = '';
}

function openRoomModal(idx) {
  const room = ROOMS[idx];
  currentRoomIndex = idx;
  $('#mImg').src = room.img;
  $('#mCode').textContent = room.code;
  $('#mTitle').textContent = room.name;
  $('#mMeta').textContent = `${room.area} m² · ${room.bed}`;
  $('#mDesc').textContent = room.desc;
  $('#mQuantity').textContent = `${room.quantity} phòng`;
  $('#mCapacity').textContent = `Tối đa ${room.guests} khách / phòng`;
  $('#mAmen').innerHTML = room.amen.map(i => `<li>${i}</li>`).join('');
  $('#mPrice').innerHTML = `${money(room.price)} <small>/ phòng / đêm</small>`;
  openModal(roomModal);
}

function showNotice(title, text, type = 'error') {
  const icon = $('.notice-icon');
  $('#nTitle').textContent = title;
  $('#nText').textContent = text;
  icon.textContent = type === 'success' ? '✓' : '!';
  icon.classList.toggle('is-success', type === 'success');
  icon.classList.toggle('is-error', type !== 'success');
  openModal(noticeModal);
}

$$('.modal').forEach(m => m.addEventListener('click', e => {
  if (e.target === m || e.target.closest('[data-close]')) closeModals();
}));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModals(); });
$('#mBook').addEventListener('click', () => { closeModals(); bookRoom(currentRoomIndex); });

/* =========================================================
   6. QUẢN LÝ NHIỀU LOẠI PHÒNG
   ========================================================= */
const roomSelectionList = $('#roomSelectionList');
const addRoomRowBtn = $('#addRoomRow');
const roomSelectionError = $('#roomSelectionError');
let nextRowId = 1;

function roomOptionMarkup(selectedIdx = '') {
  return '<option value="">-- Chọn hạng phòng --</option>' + ROOMS.map((r, i) => {
    const sel = String(i) === String(selectedIdx) ? ' selected' : '';
    return `<option value="${i}"${sel}>${r.code} – ${r.name} (${money(r.price)})</option>`;
  }).join('');
}

function addRoomSelectionRow(initialIdx = '') {
  if (roomSelectionList.children.length >= ROOMS.length) return null;

  const row = document.createElement('div');
  row.className = 'room-select-row';
  row.dataset.rowId = String(nextRowId++);
  row.innerHTML = `
    <div class="field room-type-field">
      <label>Hạng phòng *</label>
      <select class="room-type-select">${roomOptionMarkup(initialIdx)}</select>
      <small class="error"></small>
    </div>
    <div class="field room-qty-field">
      <label>Số lượng *</label>
      <input class="room-qty" type="number" min="1" value="1">
      <small class="error"></small>
    </div>
    <button class="room-remove" type="button" aria-label="Xóa">×</button>`;

  roomSelectionList.appendChild(row);

  const sel = row.querySelector('.room-type-select');
  const qty = row.querySelector('.room-qty');

  sel.addEventListener('change', () => {
    clearFieldError(sel);
    updateSummary();
  });
  qty.addEventListener('input', () => {
    clearFieldError(qty);
    updateSummary();
  });
  row.querySelector('.room-remove').addEventListener('click', () => {
    if (roomSelectionList.children.length === 1) {
      sel.value = '';
      qty.value = '1';
    } else {
      row.remove();
    }
    updateSummary();
  });

  updateSummary();
  return row;
}

addRoomRowBtn.addEventListener('click', () => addRoomSelectionRow(''));

function bookRoom(idx) {
  const rows = [...roomSelectionList.querySelectorAll('.room-select-row')];
  const existing = rows.find(r => r.querySelector('.room-type-select').value === String(idx));

  if (existing) {
    $('#booking').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => existing.querySelector('.room-qty').focus(), 500);
    return;
  }

  const empty = rows.find(r => r.querySelector('.room-type-select').value === '');
  const target = empty || addRoomSelectionRow(idx);
  if (target) {
    target.querySelector('.room-type-select').value = String(idx);
    updateSummary();
  }
  $('#booking').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => $('#bName').focus(), 500);
}

/* =========================================================
   7. NGÀY THÁNG VÀ TÍNH TỔNG TIỀN
   ========================================================= */
const inEl = $('#bIn');
const outEl = $('#bOut');
const adultsEl = $('#bAdults');
const kidsEl = $('#bKids');

function toISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function parseDate(v) {
  const [y, m, d] = v.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const todayDate = new Date();
todayDate.setHours(0, 0, 0, 0);
inEl.min = toISO(todayDate);
outEl.min = toISO(new Date(todayDate.getTime() + 86400000));

function calcNights() {
  if (!inEl.value || !outEl.value) return 0;
  const diff = Math.round((parseDate(outEl.value) - parseDate(inEl.value)) / 86400000);
  return diff > 0 ? diff : 0;
}

function getSelectedRooms() {
  return [...roomSelectionList.querySelectorAll('.room-select-row')].map(row => {
    const sel = row.querySelector('.room-type-select');
    const qtyInput = row.querySelector('.room-qty');
    const room = sel.value === '' ? null : ROOMS[Number(sel.value)];
    const qty = Math.max(parseInt(qtyInput.value, 10) || 0, 0);
    return { row, sel, qtyInput, room, qty };
  });
}

function getBookingTotals() {
  const nights = calcNights();
  const selected = getSelectedRooms().filter(i => i.room && i.qty > 0);
  const totalRooms = selected.reduce((sum, i) => sum + i.qty, 0);
  const totalCapacity = selected.reduce((sum, i) => sum + i.room.guests * i.qty, 0);
  const adults = Math.max(parseInt(adultsEl.value, 10) || 0, 0);
  const kids = Math.max(parseInt(kidsEl.value, 10) || 0, 0);
  const totalGuests = adults + kids;
  const totalPrice = selected.reduce((sum, i) => sum + i.room.price * i.qty * nights, 0);
  return { nights, selected, totalRooms, totalCapacity, adults, kids, totalGuests, totalPrice };
}

function updateSummary() {
  const totals = getBookingTotals();
  const box = $('#summaryRooms');
  if (!totals.selected.length) {
    box.innerHTML = '<p class="summary-empty">Chưa chọn phòng.</p>';
  } else {
    box.innerHTML = totals.selected.map(i => `
      <div class="summary-room-line">
        <div><strong>${i.room.code} – ${i.room.name}</strong><span>${i.qty} phòng × ${money(i.room.price)}/đêm</span></div>
        <strong>${money(i.room.price * i.qty * totals.nights)}</strong>
      </div>`).join('');
  }
  $('#sumNights').textContent = String(totals.nights);
  $('#sumQty').textContent = String(totals.totalRooms);
  $('#sumCapacity').textContent = `${totals.totalCapacity} khách`;
  $('#sumGuests').textContent = `${totals.totalGuests} khách`;
  $('#sumTotal').textContent = money(totals.totalPrice);
}

inEl.addEventListener('change', () => {
  if (inEl.value) {
    const next = new Date(parseDate(inEl.value).getTime() + 86400000);
    outEl.min = toISO(next);
    if (outEl.value && parseDate(outEl.value) <= parseDate(inEl.value)) outEl.value = '';
  }
  clearFieldError(inEl);
  updateSummary();
});

outEl.addEventListener('change', () => { clearFieldError(outEl); updateSummary(); });
[adultsEl, kidsEl].forEach(i => i.addEventListener('input', () => { clearFieldError(i); updateSummary(); }));

/* =========================================================
   8. VALIDATION LỖI CHI TIẾT
   ========================================================= */
function setError(input, msg) {
  const field = input.closest('.field');
  if (!field) return !msg;
  field.classList.toggle('invalid', Boolean(msg));
  const err = field.querySelector('.error');
  if (err) err.textContent = msg || '';
  return !msg;
}

function clearFieldError(input) {
  const field = input.closest('.field');
  if (!field) return;
  field.classList.remove('invalid');
  const err = field.querySelector('.error');
  if (err) err.textContent = '';
}

const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const phoneOk = v => /^[0-9+\s().-]{8,18}$/.test(v);

function validateBooking() {
  let ok = true;
  let firstBad = null;
  const missingFields = [];

  const check = (input, msg, fieldName) => {
    if (!setError(input, msg)) {
      ok = false;
      if (fieldName) missingFields.push(fieldName);
      firstBad = firstBad || input;
    }
  };

  const name = $('#bName').value.trim();
  const phone = $('#bPhone').value.trim();
  const email = $('#bEmail').value.trim();

  // Họ tên và SĐT bắt buộc; email không bắt buộc nhưng phải đúng định dạng nếu có nhập.
  check($('#bName'), name ? '' : 'Vui lòng nhập họ và tên.', 'Họ và tên');
  check($('#bPhone'), !phone ? 'Vui lòng nhập số điện thoại.' : (phoneOk(phone) ? '' : 'Số điện thoại không hợp lệ.'), 'Số điện thoại');
  check($('#bEmail'), email && !emailOk(email) ? 'Email không đúng định dạng.' : '');

  // Bắt buộc Ngày nhận & trả phòng
  check(inEl, inEl.value ? '' : 'Vui lòng chọn ngày nhận phòng.', 'Ngày nhận phòng');
  let outMsg = '';
  if (!outEl.value) outMsg = 'Vui lòng chọn ngày trả phòng.';
  else if (inEl.value && parseDate(outEl.value) <= parseDate(inEl.value)) outMsg = 'Ngày trả phòng phải sau ngày nhận.';
  check(outEl, outMsg, 'Ngày trả phòng');

  // Bắt buộc chọn hạng phòng
  const rows = getSelectedRooms();
  let hasValidRoom = false;
  rows.forEach(item => {
    if (!item.room) {
      check(item.sel, 'Vui lòng chọn hạng phòng.', 'Hạng phòng');
    } else {
      hasValidRoom = true;
    }
  });

  if (!hasValidRoom) {
    roomSelectionError.textContent = 'Vui lòng chọn ít nhất một hạng phòng.';
    ok = false;
    firstBad = firstBad || rows[0]?.sel;
    missingFields.push('Hạng phòng');
  } else {
    roomSelectionError.textContent = '';
  }

  // Số lượng người lớn
  const adults = parseInt(adultsEl.value, 10);
  check(adultsEl, adults >= 1 ? '' : 'Cần ít nhất 1 người lớn.', 'Số người lớn');

  // Bắt buộc tích vào ô đồng ý chính sách
  const agree = $('#bAgree');
  const agreeCheck = agree.checked;
  check(agree, agreeCheck ? '' : 'Bạn cần đồng ý với chính sách của khách sạn.', 'Đồng ý với chính sách');

  return { ok, firstBad, missingFields };
}

/* =========================================================
   9. SUBMIT GỬI VỀ BACKEND FASTAPI
   ========================================================= */
const API_URL = 'http://127.0.0.1:8000/api';

function generateUUID() {
  return 'req-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
}

// Lắng nghe sự kiện submit của Form Đặt phòng
const bookingForm = $('#bookingForm');
bookingForm.addEventListener('submit', async event => {
  // 1. Chặn đứng hành vi reload trang mặc định của HTML
  event.preventDefault();
  event.stopPropagation();

  // 2. Chạy hàm kiểm tra các điều kiện bắt buộc
  const val = validateBooking();

  // NẾU THIẾU THÔNG TIN HOẶC CHƯA TÍCH CAM KẾT:
  if (!val.ok) {
    showNotice(
      'Chưa hoàn tất biểu mẫu',
      `Vui lòng kiểm tra lại các trường sau: ${val.missingFields.join(', ')}.`
    );
    if (val.firstBad) {
      val.firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
      val.firstBad.focus({ preventScroll: true });
    }
    return; // Dừng lại, không gửi request
  }

  // 3. Khi đã điền đủ và tích cam kết -> Bắt đầu gửi dữ liệu
  const button = $('#bookingSubmit');
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = 'Đang lưu vào hệ thống...';

  const totals = getBookingTotals();
  const payload = {
    client_request_id: generateUUID(),
    name: $('#bName').value.trim(),
    phone: $('#bPhone').value.trim(),
    email: $('#bEmail').value.trim(),
    check_in: inEl.value,
    check_out: outEl.value,
    nights: totals.nights,
    selected_rooms: totals.selected.map(i => ({
      code: i.room.code,
      name: i.room.name,
      price: i.room.price,
      qty: i.qty
    })),
    total_rooms: totals.totalRooms,
    adults: totals.adults,
    kids: parseInt(kidsEl.value, 10) || 0,
    total_guests: totals.totalGuests,
    total_price: totals.totalPrice,
    note: $('#bNote').value.trim()
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const apiError = new Error(errData.detail || `Máy chủ trả về lỗi ${res.status}.`);
      apiError.name = 'ApiError';
      throw apiError;
    }

    const data = await res.json();

    // Hiển thị thông báo thành công kèm ID nhận được từ CSDL SQL
    showNotice(
      'Đặt phòng thành công!',
      `Yêu cầu của quý khách đã được lưu chính thức vào cơ sở dữ liệu với mã đơn: #${data.booking_id}. Tổng chi phí: ${money(totals.totalPrice)}. Khách sạn Anstay sẽ sớm liên hệ lại.`,
      'success'
    );

    // Reset lại form và dòng phòng
    bookingForm.reset();
    roomSelectionList.innerHTML = '';
    addRoomSelectionRow('');
    updateSummary();

  } catch (err) {
    console.error('Fetch error:', err);
    if (err.name === 'AbortError') {
      showNotice('Kết nối quá hạn', 'Đường truyền mạng quá chậm. Vui lòng thử lại sau.');
    } else if (err.name === 'ApiError') {
      showNotice('Không thể gửi yêu cầu', err.message);
    } else {
      showNotice(
        'Không thể kết nối máy chủ',
        'Chưa thể kết nối tới cơ sở dữ liệu backend. Vui lòng đảm bảo bạn đã mở Terminal và chạy lệnh: uvicorn app:app --reload --port 8000'
      );
    }
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
});

// Xóa viền đỏ khi người dùng nhập vào ô
document.addEventListener('input', e => {
  if (e.target.matches('#bookingForm input, #bookingForm select, #bookingForm textarea')) {
    clearFieldError(e.target);
  }
});
document.addEventListener('change', e => {
  if (e.target.matches('#bookingForm input, #bookingForm select, #bookingForm textarea')) {
    clearFieldError(e.target);
  }
});

/* =========================================================
   10. HIỆU ỨNG CUỘN (SCROLL REVEAL)
   ========================================================= */
const revealElements = $$('.reveal-on-scroll, .section-head');
if ('IntersectionObserver' in window) {
  revealElements.forEach(el => el.classList.add('reveal-pending'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach(el => observer.observe(el));
} else {
  revealElements.forEach(el => el.classList.add('in-view'));
}

addRoomSelectionRow(''); // Khởi tạo sau khi các phần tử ngày tháng đã được khởi tạo.