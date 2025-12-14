Note Taking App (FastAPI)

Môn học: Phát triển Ứng dụng Mã Nguồn Mở

Sinh viên thực hiện:

Nguyễn Quốc Bảo – MSSV: 23050141

Hồ Chanh Phát – MSSV: 23050142

1. Giới thiệu

Note Taking App là ứng dụng web giúp người dùng tạo và quản lý ghi chú cá nhân.
Hệ thống được xây dựng theo mô hình Client – Server, sử dụng FastAPI cho Backend và ReactJS (Vite) cho Frontend.

Ứng dụng áp dụng JWT Authentication nhằm đảm bảo bảo mật và phân quyền dữ liệu theo từng người dùng.

2. Công nghệ sử dụng
Backend

Python

FastAPI

SQLAlchemy

Alembic

PostgreSQL

JWT Authentication

Uvicorn

Frontend

ReactJS

Vite

JavaScript (ES6)

CSS

Axios

React Router DOM

3. Kiến trúc hệ thống

Ứng dụng được thiết kế theo mô hình 3-tier architecture:

Frontend: Hiển thị giao diện, gửi request HTTP

Backend: Xử lý nghiệp vụ, xác thực JWT, cung cấp REST API

Database: Lưu trữ thông tin người dùng và ghi chú

4. Chức năng chính
Người dùng

Đăng ký tài khoản

Đăng nhập

Đăng xuất

Ghi chú

Tạo ghi chú

Xem danh sách ghi chú

Chỉnh sửa ghi chú

Xóa ghi chú

Tìm kiếm ghi chú

Thêm tag cho ghi chú

Lưu trữ ghi chú

5. Hướng dẫn cài đặt và chạy dự án
5.1. Chạy Backend (FastAPI)

Tạo và kích hoạt môi trường ảo:

python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Linux / Mac


Cài đặt thư viện:

pip install -r requirements.txt


Chạy migration (nếu có):

alembic upgrade head


Chạy Backend:

uvicorn app.main:app --reload


Backend chạy tại:

http://127.0.0.1:8000


API Docs:

http://127.0.0.1:8000/docs

5.2. Chạy Frontend (React + Vite)
npm install
npm run dev


Frontend chạy tại:

http://localhost:5173

6. Kết nối Frontend – Backend

Frontend giao tiếp với Backend thông qua REST API.
JWT Token được lưu trong localStorage và gửi kèm trong header:

Authorization: Bearer <token>


Các API chính:

POST /auth/register

POST /auth/login

GET /notes

POST /notes

PUT /notes/{id}

DELETE /notes/{id}

7. Kết quả đạt được

Backend và Frontend kết nối thành công

Hệ thống hoạt động ổn định

Đáp ứng tiêu chí môn học

8. Hướng phát triển

Cải thiện giao diện người dùng

Triển khai hệ thống lên Cloud

9. Tài liệu tham khảo

https://fastapi.tiangolo.com

https://react.dev

https://vitejs.dev

https://jwt.io
