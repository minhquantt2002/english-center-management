import React from 'react';
import { Bell } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className='bg-white border-b border-gray-200 px-6 py-4'>
      <div className='flex items-center justify-between'>
        {/* Left side - Title and Welcome message */}
        <div>
          <h1 className='text-2xl font-bold text-gray-900 mb-1'>
            Admin Dashboard
          </h1>
          <p className='text-gray-500 text-sm'>
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Right side - Notifications and User profile */}
        <div className='flex items-center gap-4'>
          {/* Notification Bell */}
          <div className='relative'>
            <button className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200'>
              <Bell size={20} />
            </button>
            {/* Notification badge */}
            <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium'>
              3
            </span>
          </div>

          {/* User Profile */}
          <div className='flex items-center gap-3'>
            {/* Avatar */}
            <div className='w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-0.5'>
              <div className='w-full h-full rounded-full bg-white flex items-center justify-center'>
                <img
                  src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
                  alt='Admin User'
                  className='w-full h-full rounded-full object-cover'
                />
              </div>
            </div>

            {/* User Info */}
            <div className='text-right'>
              <p className='text-sm font-semibold text-gray-900'>Admin User</p>
              <p className='text-xs text-gray-500'>Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
