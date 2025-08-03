# Hệ thống Xử lý Token Expiration

## Tổng quan

Hệ thống này tự động xử lý khi JWT token hết hạn, đảm bảo người dùng được thông báo và chuyển hướng về trang đăng nhập một cách mượt mà.

## Các thành phần chính

### 1. API Client (`src/lib/api.ts`)
- Tự động phát hiện lỗi 401 (Unauthorized)
- Xóa localStorage và redirect về login khi token hết hạn
- Xử lý tất cả API calls (GET, POST, PUT, DELETE)

### 2. Token Expiration Hook (`src/hooks/useTokenExpiration.ts`)
- Kiểm tra token expiration mỗi phút
- Hiển thị modal cảnh báo khi token sắp hết hạn (dưới 5 phút)
- Hiển thị modal thông báo khi token đã hết hạn
- Tự động logout và redirect

### 3. Token Utilities (`src/utils/tokenUtils.ts`)
- `decodeToken()`: Decode JWT token
- `isTokenExpired()`: Kiểm tra token hết hạn
- `isTokenExpiringSoon()`: Kiểm tra token sắp hết hạn
- `formatTokenTimeRemaining()`: Format thời gian còn lại

### 4. Modals
- `TokenExpirationModal`: Thông báo token đã hết hạn
- `TokenWarningModal`: Cảnh báo token sắp hết hạn

## Cách hoạt động

### 1. Kiểm tra định kỳ
```typescript
// Kiểm tra mỗi phút
const interval = setInterval(checkTokenExpiration, 60000);
```

### 2. Phát hiện token sắp hết hạn
- Khi token còn dưới 5 phút: Hiển thị warning modal
- Người dùng có thể tiếp tục làm việc hoặc refresh

### 3. Phát hiện token đã hết hạn
- Khi token hết hạn: Hiển thị expiration modal
- Tự động logout và redirect về `/auth/login`
- Xóa tất cả dữ liệu localStorage

### 4. Xử lý API errors
- Khi API trả về 401: Tự động logout
- Xử lý tất cả HTTP methods

## Cấu hình

### Token Expiration Time
- Backend: 120 phút (trong `backend/src/config.py`)
- Frontend: Cảnh báo trước 5 phút

### LocalStorage Keys được xóa
- `token`
- `userData`

## Sử dụng

### Trong Components
```typescript
import { useTokenExpiration } from '../hooks/useTokenExpiration';

const MyComponent = () => {
  const { session, status } = useTokenExpiration();
  // Component logic...
};
```

### Kiểm tra token thủ công
```typescript
import { isTokenExpired, formatTokenTimeRemaining } from '../utils/tokenUtils';

const token = session?.accessToken;
if (isTokenExpired(token)) {
  // Handle expired token
}

const timeLeft = formatTokenTimeRemaining(token);
console.log(`Token còn lại: ${timeLeft}`);
```

## Troubleshooting

### Token không được decode
- Kiểm tra format JWT token
- Đảm bảo token có đúng 3 phần (header.payload.signature)

### Modal không hiển thị
- Kiểm tra SessionWrapper đã được wrap đúng
- Kiểm tra console logs

### Không redirect về login
- Kiểm tra NextAuth configuration
- Đảm bảo `/auth/login` route tồn tại

## Testing

### Test token expiration
1. Đăng nhập vào hệ thống
2. Chờ token hết hạn (hoặc sửa thời gian trong backend)
3. Thực hiện API call
4. Kiểm tra modal hiển thị và redirect

### Test warning modal
1. Đăng nhập vào hệ thống
2. Chờ token sắp hết hạn (dưới 5 phút)
3. Kiểm tra warning modal hiển thị 