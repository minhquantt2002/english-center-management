'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (status === 'unauthenticated' || !session) {
      console.log('unauthenticated');
      router.replace('/auth/login');
    } else {
      // router.replace('/staff/');
      // Lấy role_name từ localStorage
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        const role = userData?.role_name;
        switch (role) {
          case 'admin':
            router.replace('/admin');
            break;
          case 'teacher':
            router.replace('/teacher');
            break;
          case 'student':
            router.replace('/student');
            break;
          case 'staff':
            router.replace('/staff');
            break;
          default:
            router.replace('/');
        }
      }
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center'>
        <div className='bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4'></div>
          <p className='text-gray-600'>Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  return null;
}
