'use client';

import React, { useState, useEffect } from 'react';
import TeacherSidebar from './_components/TeacherSidebar';
import TeacherNavbar from './_components/TeacherNavbar';

interface TeacherLayoutProps {
  children: React.ReactNode;
}

const TeacherLayout: React.FC<TeacherLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className='flex h-screen bg-white overflow-hidden'>
      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
          ${
            isMobile
              ? sidebarOpen
                ? 'translate-x-0'
                : '-translate-x-full'
              : 'translate-x-0'
          }
        `}
      >
        <TeacherSidebar />
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm'
          onClick={closeSidebar}
        />
      )}

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col overflow-hidden ${
          isMobile ? '' : 'ml-64'
        }`}
      >
        {/* Navbar */}
        <TeacherNavbar onToggleSidebar={toggleSidebar} />

        {/* Page content */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto pt-16 pb-6'>
          <div className='container mx-auto p-2'>{children}</div>
        </main>
      </div>

      {/* Mobile bottom padding for safe area */}
      {isMobile && <div className='h-safe-area-inset-bottom bg-white' />}
    </div>
  );
};

export default TeacherLayout;
