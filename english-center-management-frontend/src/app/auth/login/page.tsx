'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';

const ZenlishLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email hoặc mật khẩu không đúng');
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        let tries = 0;
        let session = null;
        while (tries < 10) {
          session = await getSession();
          // Nếu session đã có accessToken thì break
          if (session?.accessToken) break;
          await new Promise((r) => setTimeout(r, 200));
          tries++;
        }
        if (!session) {
          setError('Không lấy được thông tin phiên đăng nhập');
          setIsLoading(false);
          return;
        }
        const accessToken = session.accessToken;
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (!userRes.ok) {
          setError('Không lấy được thông tin người dùng');
          setIsLoading(false);
          return;
        }
        const userData = await userRes.json();
        // Lưu userData vào localStorage
        localStorage.setItem('userData', JSON.stringify(userData));

        const role = userData?.role_name;
        // Redirect theo role
        switch (role) {
          case 'admin':
            router.push('/admin');
            break;
          case 'teacher':
            router.push('/teacher');
            break;
          case 'student':
            router.push('/student');
            break;
          case 'staff':
            router.push('/staff');
            break;
          default:
            router.push('/');
        }
      }
    } catch (error: any) {
      console.error('Lỗi đăng nhập:', error);
      setError('Đã xảy ra lỗi khi đăng nhập');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4'>
      <div className='bg-white rounded-xl shadow-2xl p-8 w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-blue-600 mb-2'>Zenlish</h1>
          <p className='text-gray-500 text-lg'>Hệ thống quản lý học viên</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg'>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className='space-y-6'
        >
          {/* Email Field */}
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Email
            </label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Nhập email của bạn'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-700 placeholder-gray-400'
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Mật khẩu
            </label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Nhập mật khẩu của bạn'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-700 placeholder-gray-400'
              disabled={isLoading}
            />
          </div>

          {/* Sign In Button */}
          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none disabled:cursor-not-allowed'
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        {/* Additional Links */}
        <div className='mt-6 text-center'>
          <a
            href='#'
            className='text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200'
          >
            Quên mật khẩu?
          </a>
        </div>
      </div>
    </div>
  );
};

export default ZenlishLogin;
