'use client';

import React, { useState, useEffect } from 'react';
import StudentSidebar from './_components/StudentSidebar';
import StudentNavbar from './_components/StudentNavbar';

interface StudentLayoutProps {
  children: React.ReactNode;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
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
    <div className='flex h-screen overflow-hidden'>
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
        <StudentSidebar />
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
        <StudentNavbar onToggleSidebar={toggleSidebar} />

        {/* Page content */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto pt-16 pb-6'>
          <div className='container mx-auto px-6 py-6'>{children}</div>
        </main>
      </div>

      {/* Mobile bottom padding for safe area */}
      {isMobile && <div className='h-safe-area-inset-bottom' />}
    </div>
  );
};

export default StudentLayout;
