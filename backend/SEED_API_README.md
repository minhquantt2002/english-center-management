# API Fake Data cho Hệ thống Quản lý Trung tâm Tiếng Anh

## Tổng quan

API này cung cấp các endpoint để tạo dữ liệu fake cho hệ thống quản lý trung tâm tiếng Anh, giúp test và demo hệ thống một cách dễ dàng.

## Các Endpoint

### 1. Tạo tất cả dữ liệu fake

**POST** `/seed/seed-all`

Tạo toàn bộ dữ liệu fake bao gồm:

- Users (Admin, Staff, Teacher, Student)w
- Courses (Khóa học)
- Classes (Lớp học)
- Schedules (Lịch học)
- Enrollments (Đăng ký khóa học)
- Exams (Bài thi)
- Scores (Điểm số)
- Feedbacks (Đánh giá)

**Response:**

```json
{
  "message": "Đã tạo thành công dữ liệu fake cho hệ thống",
  "summary": {
    "users_created": 29,
    "courses_created": 6,
    "classes_created": 6,
    "schedules_created": 18,
    "enrollments_created": 72,
    "exams_created": 18,
    "scores_created": 144,
    "feedbacks_created": 50
  }
}
```

### 2. Tạo chỉ users fake

**POST** `/seed/seed-users`

Tạo các loại users:

- **2 Admin users**: admin1@englishcenter.com, admin2@englishcenter.com (password: admin123)
- **3 Staff users**: staff1@englishcenter.com, staff2@englishcenter.com, staff3@englishcenter.com (password: staff123)
- **4 Teacher users**: sarah.johnson@englishcenter.com, michael.brown@englishcenter.com, nguyen.thi.f@englishcenter.com, david.wilson@englishcenter.com (password: teacher123)
- **20 Student users**: student1@gmail.com đến student20@gmail.com (password: student123)

### 3. Tạo chỉ courses fake

**POST** `/seed/seed-courses`

Tạo 6 khóa học:

1. **Tiếng Anh Giao Tiếp Cơ Bản** (Beginner, 12 tuần, 2.5M VND)
2. **Tiếng Anh Giao Tiếp Nâng Cao** (Intermediate, 16 tuần, 3.2M VND)
3. **Luyện Thi IELTS** (Advanced, 20 tuần, 4.5M VND)
4. **Luyện Thi TOEIC** (Intermediate, 18 tuần, 3.8M VND)
5. **Tiếng Anh Trẻ Em** (Beginner, 10 tuần, 2M VND)
6. **Tiếng Anh Doanh Nghiệp** (Upper-intermediate, 14 tuần, 3.5M VND)

### 4. Xóa tất cả dữ liệu

**DELETE** `/seed/clear-all`

Xóa toàn bộ dữ liệu trong database (cẩn thận khi sử dụng!)

## Dữ liệu được tạo

### Users

- **Admin**: Quản lý toàn bộ hệ thống
- **Staff**: Nhân viên tư vấn, quản lý học viên, tài chính
- **Teacher**: Giáo viên với thông tin chuyên môn chi tiết
- **Student**: Học viên với thông tin cá nhân và phụ huynh

### Courses

- Các khóa học với mức độ khác nhau
- Thông tin về thời lượng, học phí
- Mô tả chi tiết về nội dung khóa học

### Classes

- Lớp học được tạo tự động cho mỗi khóa học
- Phân công giáo viên ngẫu nhiên
- Lịch học và trạng thái lớp

### Schedules

- Lịch học cho mỗi lớp (2-3 buổi/tuần)
- Thời gian học đa dạng (sáng, chiều, tối)

### Enrollments

- Đăng ký khóa học của học viên
- Trạng thái đăng ký (active, completed, dropped)

### Exams

- Bài thi cho mỗi lớp (2-4 bài/lớp)
- Các loại: Mid-term, Final, Quiz, Assignment

### Scores

- Điểm số chi tiết (Listening, Reading, Speaking, Writing)
- Tổng điểm và xếp loại (A, B, C, D)
- Nhận xét của giáo viên

### Feedbacks

- Đánh giá của giáo viên cho học viên
- Rating từ 3-5 sao
- Nội dung feedback chi tiết

## Cách sử dụng

### 1. Khởi động server

```bash
cd backend
python main.py
```

### 2. Tạo dữ liệu fake

```bash
# Tạo tất cả dữ liệu
curl -X POST http://localhost:8000/seed/seed-all

# Hoặc tạo từng phần
curl -X POST http://localhost:8000/seed/seed-users
curl -X POST http://localhost:8000/seed/seed-courses
```

### 3. Đăng nhập test

Sử dụng các tài khoản đã tạo để test hệ thống:

**Admin:**

- Email: admin1@englishcenter.com
- Password: admin123

**Staff:**

- Email: staff1@englishcenter.com
- Password: staff123

**Teacher:**

- Email: sarah.johnson@englishcenter.com
- Password: teacher123

**Student:**

- Email: student1@gmail.com
- Password: student123

## Lưu ý

1. **Backup dữ liệu**: Trước khi sử dụng `/seed/seed-all` hoặc `/seed/clear-all`, hãy backup dữ liệu quan trọng
2. **Database**: Đảm bảo database đã được tạo và migrate
3. **Dependencies**: Cần cài đặt đầy đủ các thư viện Python
4. **Test**: Dữ liệu fake chỉ dùng cho mục đích test và demo

## Troubleshooting

### Lỗi import

Nếu gặp lỗi import, kiểm tra:

- Cấu trúc thư mục backend/src
- Các file **init**.py đã được tạo
- Dependencies đã được cài đặt

### Lỗi database

Nếu gặp lỗi database:

- Kiểm tra kết nối database
- Đảm bảo các bảng đã được tạo
- Kiểm tra quyền truy cập database

### Lỗi field names

Nếu gặp lỗi field names:

- Kiểm tra models trong src/models/
- Đảm bảo tên field trong seed controller khớp với models
