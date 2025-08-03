/**
 * Utility functions để xử lý JWT token
 */

export interface TokenPayload {
  sub: string;
  user_id: string;
  role: string;
  exp: number;
  iat: number;
}

/**
 * Decode JWT token và trả về payload
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Kiểm tra xem token có hết hạn chưa
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token);
  if (!payload) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

/**
 * Lấy thời gian còn lại của token (tính bằng giây)
 */
export const getTokenTimeRemaining = (token: string): number => {
  const payload = decodeToken(token);
  if (!payload) return 0;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - currentTime);
};

/**
 * Format thời gian còn lại thành string dễ đọc
 */
export const formatTokenTimeRemaining = (token: string): string => {
  const remaining = getTokenTimeRemaining(token);
  
  if (remaining === 0) return 'Đã hết hạn';
  
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  
  if (hours > 0) {
    return `${hours} giờ ${minutes} phút`;
  } else {
    return `${minutes} phút`;
  }
};

/**
 * Kiểm tra xem token có sắp hết hạn không (dưới 5 phút)
 */
export const isTokenExpiringSoon = (token: string): boolean => {
  const remaining = getTokenTimeRemaining(token);
  return remaining > 0 && remaining < 300; // 5 phút = 300 giây
}; 