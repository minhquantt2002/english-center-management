import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Nếu có token và đang ở trang auth, redirect về trang chủ
    if (token && pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Kiểm tra các protected routes
        const { pathname } = req.nextUrl;

        // Cho phép truy cập các route public
        if ((pathname.startsWith('/auth') || pathname === '/') && !token) {
          return true;
        }

        // Yêu cầu authentication cho các route khác
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/staff/:path*',
    '/teacher/:path*',
    '/student/:path*',
    '/auth/:path*',
  ],
};
