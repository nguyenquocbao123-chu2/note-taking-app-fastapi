# Note Taking App

Ứng dụng **Note Taking App** là hệ thống web hỗ trợ người dùng tạo, quản lý và lưu trữ ghi chú cá nhân.
Hệ thống được xây dựng bằng **FastAPI + PostgreSQL** cho Backend và **ReactJS (Vite)** cho Frontend, đáp ứng yêu cầu bảo mật, hiệu năng và khả năng mở rộng.

Ứng dụng áp dụng **JWT Authentication** nhằm đảm bảo xác thực và phân quyền dữ liệu theo từng người dùng.

# Mục Tiêu Dự Án

- Xây dựng một hệ thống ghi chú cá nhân dạng Web có tính thực tế
- Áp dụng kiến thức môn *Phát triển Ứng dụng Mã Nguồn Mở*
- Rèn luyện kỹ năng:
    + Backend API
    + ORM & Database
    + Xác thực – phân quyền
    + Kết nối Frontend – Backend
- Tạo nền tảng cho các ứng dụng quản lý cá nhân trong tương lai

# Công Nghệ Sử Dụng

* Backend:
        Python,
        FastAPI,
        SQLAlchemy ORM,
        Alembic,
        PostgreSQL,
        JWT Authentication,
        Uvicorn

* Frontend:
        ReactJS,
        Vite,
        JavaScript (ES6),
        CSS,
        Axios,
        React Router DOM

* Môi Trường Phát Triển:
        Visual Studio Code,
        Git,
        GitHub

# Kiến Trúc Hệ Thống

Frontend (ReactJS)
        ↓
FastAPI Backend (REST API)
        ↓
PostgreSQL Database

- Frontend gọi API thông qua HTTP
- Backend xử lý nghiệp vụ và xác thực JWT
- Database lưu trữ thông tin người dùng và ghi chú

# Cài Đặt & Chạy Dự Án

1. Chạy Backend (FastAPI)

- Tạo môi trường ảo:
python -m venv venv

- Kích hoạt môi trường ảo:
venv\Scripts\activate        (Windows)
source venv/bin/activate     (Linux / Mac)

- Cài đặt thư viện:
pip install -r requirements.txt

- Chạy migration:
alembic upgrade head

- Chạy ứng dụng:
uvicorn app.main:app --reload

- Truy cập:
http://127.0.0.1:8000/docs

2. Chạy Frontend (React + Vite)

npm install
npm run dev

- Truy cập:
http://localhost:5173

# Xác Thực & Phân Quyền

Hệ thống sử dụng JWT (JSON Web Token):

- Người dùng chỉ thao tác dữ liệu ghi chú cá nhân
- Token lưu trong localStorage
- Gửi kèm header:
Authorization: Bearer <token>

# Chức Năng Chính

1. Người Dùng:
Đăng ký,
Đăng nhập,
Đăng xuất

2. Quản Lý Ghi Chú:
Tạo ghi chú,
Xem danh sách ghi chú,
Chỉnh sửa ghi chú,
Xóa ghi chú,
Tìm kiếm ghi chú,
Gắn tag,
Lưu trữ ghi chú

# API Chính

POST /auth/register
POST /auth/login
GET /notes
POST /notes
PUT /notes/{id}
DELETE /notes/{id}

# Demo Hệ Thống

- Trang đăng nhập
- Trang danh sách ghi chú
- Trang tạo / chỉnh sửa ghi chú
- Swagger UI

# Thông Tin Sinh Viên

1. Sinh viên 1:
- Họ tên: Nguyễn Quốc Bảo
- MSSV: 23050141
- Trường: Đại học Bình Dương
- Môn: Phát triển Ứng dụng Mã Nguồn Mở

2. Sinh viên 2:
- Họ tên: Hồ Chanh Phát
- MSSV: 23050142
- Trường: Đại học Bình Dương
- Môn: Phát triển Ứng dụng Mã Nguồn Mở

# Kết Luận

Dự án đã xây dựng thành công ứng dụng Note Taking App với đầy đủ chức năng quản lý ghi chú cá nhân,
đáp ứng tốt yêu cầu môn học và có khả năng mở rộng trong thực tế.

link ứng dụng đã up render https://note-taking-app-fastapi-1.onrender.com/
