import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Middleware logic có thể thêm ở đây nếu cần
    console.log("Token:", req.nextauth.token)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Kiểm tra các protected routes
        const { pathname } = req.nextUrl
        
        // Cho phép truy cập các route public
        if (pathname.startsWith('/auth') || pathname === '/') {
          return true
        }
        
        // Yêu cầu authentication cho các route khác
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    // Thêm các protected routes khác ở đây
  ]
}