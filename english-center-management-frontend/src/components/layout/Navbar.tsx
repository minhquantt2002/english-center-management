'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              My App
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="animate-pulse">Loading...</div>
            ) : session ? (
              <>
                <span>Xin chào, {session.user?.name}</span>
                <Link 
                  href="/dashboard"
                  className="hover:text-blue-200 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition-colors"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login"
                  className="hover:text-blue-200 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link 
                  href="/auth/register"
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition-colors"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}