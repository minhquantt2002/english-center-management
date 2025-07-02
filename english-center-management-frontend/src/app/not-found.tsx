'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col'>
      {/* Header */}
      <header className='p-6'>
        <div className='text-2xl font-bold text-teal-600'>Zenlish</div>
      </header>

      {/* Main Content */}
      <main className='flex-1 flex flex-col items-center justify-center px-6 text-center'>
        {/* Illustration */}
        <div className='mb-8'>
          <div className='w-64 h-48 bg-gradient-to-b from-blue-200 to-blue-300 rounded-2xl relative overflow-hidden'>
            {/* Sky background */}
            <div className='absolute inset-0 bg-gradient-to-b from-blue-200 to-pink-200'>
              {/* Clouds */}
              <div className='absolute top-4 left-8 w-12 h-6 bg-white rounded-full opacity-80'></div>
              <div className='absolute top-6 right-12 w-8 h-4 bg-white rounded-full opacity-80'></div>

              {/* Moon */}
              <div className='absolute top-3 left-16 w-6 h-6 bg-yellow-200 rounded-full'></div>

              {/* Stars */}
              <div className='absolute top-8 left-20 w-1 h-1 bg-white rounded-full'></div>
              <div className='absolute top-12 right-20 w-1 h-1 bg-white rounded-full'></div>
            </div>

            {/* Ground */}
            <div className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-pink-200 to-pink-300 rounded-b-2xl'></div>

            {/* Books stack */}
            <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2'>
              <div className='w-16 h-3 bg-red-400 rounded-sm mb-1'></div>
              <div className='w-14 h-3 bg-blue-400 rounded-sm mb-1 ml-1'></div>
              <div className='w-15 h-3 bg-green-400 rounded-sm mb-1'></div>
              <div className='w-13 h-3 bg-yellow-400 rounded-sm mb-1 ml-0.5'></div>
            </div>

            {/* Character with graduation cap */}
            <div className='absolute bottom-16 left-1/2 transform -translate-x-1/2'>
              {/* Graduation cap */}
              <div className='w-8 h-2 bg-gray-800 rounded-full mb-1 relative'>
                <div className='absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-800 rounded-sm rotate-45'></div>
                <div className='absolute -top-2 -right-1 w-1 h-6 bg-yellow-400'></div>
              </div>
              {/* Face */}
              <div className='w-6 h-6 bg-pink-200 rounded-full mx-auto relative'>
                <div className='absolute top-2 left-1.5 w-0.5 h-0.5 bg-black rounded-full'></div>
                <div className='absolute top-2 right-1.5 w-0.5 h-0.5 bg-black rounded-full'></div>
                <div className='absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-black rounded-full'></div>
              </div>
            </div>

            {/* Clock */}
            <div className='absolute bottom-12 left-6 w-8 h-8 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center'>
              <div className='w-1 h-2 bg-black rounded-full'></div>
            </div>

            {/* Soccer ball */}
            <div className='absolute bottom-10 right-8 w-6 h-6 bg-white rounded-full border border-black'>
              <div className='absolute top-1 left-1 w-1 h-1 bg-black rounded-full'></div>
              <div className='absolute bottom-1 right-1 w-1 h-1 bg-black rounded-full'></div>
            </div>

            {/* Plants */}
            <div className='absolute bottom-6 left-4 w-2 h-4 bg-green-400 rounded-t-full'></div>
            <div className='absolute bottom-6 right-6 w-2 h-4 bg-green-400 rounded-t-full'></div>
          </div>
        </div>

        {/* 404 Number */}
        <div className='text-8xl font-bold text-teal-600 mb-6'>404</div>

        {/* Title */}
        <h1 className='text-3xl font-bold text-gray-800 mb-4'>
          Không tìm thấy trang
        </h1>

        {/* Description */}
        <p className='text-gray-600 mb-8 max-w-md'>
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        {/* Action Buttons */}
        <div className='flex gap-4 mb-12'>
          <Link
            href='/'
            className='bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
              />
            </svg>
            Quay lại trang chủ
          </Link>

          <button
            onClick={() => window.history.back()}
            className='border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              />
            </svg>
            Quay lại
          </button>
        </div>

        {/* Additional Options */}
        <div className='text-center'>
          <p className='text-gray-600 mb-4'>Hoặc bạn có thể:</p>
          <div className='flex flex-wrap justify-center gap-6 text-sm'>
            <Link
              href='/courses'
              className='text-teal-600 hover:text-teal-700 flex items-center gap-1'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                />
              </svg>
              Khóa học
            </Link>
            <Link
              href='/students'
              className='text-teal-600 hover:text-teal-700 flex items-center gap-1'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
                />
              </svg>
              Học viên
            </Link>
            <Link
              href='/contact'
              className='text-teal-600 hover:text-teal-700 flex items-center gap-1'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                />
              </svg>
              Liên hệ
            </Link>
            <Link
              href='/help'
              className='text-teal-600 hover:text-teal-700 flex items-center gap-1'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              Trợ giúp
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='p-6 text-center text-sm text-gray-500'>
        © 2024 Zenlish. Trung tâm tiếng Anh hàng đầu.
      </footer>
    </div>
  );
}
