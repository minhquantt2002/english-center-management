'use client';

import React, { useState } from 'react';

const ZenlishLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');

  const handleSubmit = () => {
    console.log('Login attempt:', { email, password, role });
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4'>
      <div className='bg-white rounded-xl shadow-2xl p-8 w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-blue-600 mb-2'>Zenlish</h1>
          <p className='text-gray-500 text-lg'>Student Management System</p>
        </div>

        {/* Login Form */}
        <div className='space-y-6'>
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
              placeholder='Enter your email'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-700 placeholder-gray-400'
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Password
            </label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter your password'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-700 placeholder-gray-400'
            />
          </div>

          {/* Role Selection */}
          <div>
            <label
              htmlFor='role'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Role
            </label>
            <select
              id='role'
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-700 bg-white'
            >
              <option value='Admin'>Admin</option>
              <option value='Teacher'>Teacher</option>
              <option value='Student'>Student</option>
            </select>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleSubmit}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none'
          >
            Sign In
          </button>
        </div>

        {/* Additional Links */}
        <div className='mt-6 text-center'>
          <a
            href='#'
            className='text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200'
          >
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default ZenlishLogin;
