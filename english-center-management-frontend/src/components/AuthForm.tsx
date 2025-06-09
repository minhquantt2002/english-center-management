'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { authAPI } from '@/lib/api';
import { RegisterData } from '@/types/auth';

interface AuthFormProps {
  type: 'login' | 'register';
}

export default function AuthForm({ type }: AuthFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (type === 'login') {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setMessage('Email hoặc mật khẩu không đúng');
        } else if (result?.ok) {
          setMessage('Đăng nhập thành công');
          router.push('/dashboard');
          router.refresh();
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setMessage('Mật khẩu không khớp');
          setLoading(false);
          return;
        }

        const registerData: RegisterData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };

        const result = await authAPI.register(registerData);

        if (result.success) {
          setMessage('Đăng ký thành công! Đang chuyển hướng...');
          // Tự động đăng nhập sau khi đăng ký
          setTimeout(async () => {
            const loginResult = await signIn('credentials', {
              email: formData.email,
              password: formData.password,
              redirect: false,
            });
            
            if (loginResult?.ok) {
              router.push('/dashboard');
              router.refresh();
            }
          }, 1000);
        } else {
          setMessage(result.message);
        }
      }
    } catch {
      setMessage('Đã xảy ra lỗi không mong muốn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {type === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {type === 'register' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Họ tên
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Nhập họ tên của bạn"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nhập email của bạn"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nhập mật khẩu"
              />
            </div>
            
            {type === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Nhập lại mật khẩu"
                />
              </div>
            )}
          </div>

          {message && (
            <div className={`text-center text-sm ${
              message.includes('thành công') || message.includes('success') 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : (type === 'login' ? 'Đăng nhập' : 'Đăng ký')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}