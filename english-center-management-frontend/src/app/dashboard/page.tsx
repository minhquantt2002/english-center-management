'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Dashboard
            </h1>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h2 className="text-lg font-medium text-blue-900 mb-4">
                Thông tin tài khoản
              </h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-blue-500">
                    Họ tên
                  </dt>
                  <dd className="mt-1 text-sm text-blue-900">
                    {user?.name || 'Chưa có thông tin'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-blue-500">
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-blue-900">
                    {user?.email || 'Chưa có thông tin'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-blue-500">
                    ID
                  </dt>
                  <dd className="mt-1 text-sm text-blue-900">
                    {user?.id || 'Chưa có thông tin'}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Chức năng
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">Cập nhật thông tin</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Chỉnh sửa thông tin cá nhân của bạn
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">Đổi mật khẩu</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Thay đổi mật khẩu bảo mật
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">Cài đặt</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Tùy chỉnh các thiết lập tài khoản
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}