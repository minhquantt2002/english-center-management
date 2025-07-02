import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  GraduationCap,
  BookOpen,
  PlayCircle,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const mainMenuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <BarChart3 size={20} />,
      isActive: activeItem === 'dashboard',
    },
    {
      id: 'students',
      label: 'Students',
      icon: <Users size={20} />,
      isActive: activeItem === 'students',
    },
    {
      id: 'teachers',
      label: 'Teachers',
      icon: <GraduationCap size={20} />,
      isActive: activeItem === 'teachers',
    },
    {
      id: 'classes',
      label: 'Classes',
      icon: <BookOpen size={20} />,
      isActive: activeItem === 'classes',
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: <PlayCircle size={20} />,
      isActive: activeItem === 'courses',
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <FileText size={20} />,
      isActive: activeItem === 'reports',
    },
  ];

  const settingsItems: MenuItem[] = [
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={20} />,
      isActive: activeItem === 'settings',
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: <LogOut size={20} />,
      isActive: activeItem === 'logout',
    },
  ];

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    console.log(`Clicked on: ${itemId}`);
  };

  const renderMenuItem = (item: MenuItem) => (
    <button
      key={item.id}
      onClick={() => handleItemClick(item.id)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 rounded-lg mx-2 ${
        item.isActive
          ? 'bg-blue-50 text-blue-600 border-r-3 border-blue-600'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <span className={item.isActive ? 'text-blue-600' : 'text-gray-500'}>
        {item.icon}
      </span>
      <span className='font-medium'>{item.label}</span>
    </button>
  );

  return (
    <div className='w-64 h-screen bg-white border-r border-gray-200 flex flex-col'>
      {/* Header */}
      <div className='p-6 border-b border-gray-100'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
            <GraduationCap className='text-blue-600' size={24} />
          </div>
          <h1 className='text-xl font-bold text-blue-600'>Zenlish</h1>
        </div>
      </div>

      {/* Main Navigation */}
      <div className='flex-1 py-6'>
        <div className='mb-6'>
          <h2 className='text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 mb-3'>
            MAIN
          </h2>
          <nav className='space-y-1'>{mainMenuItems.map(renderMenuItem)}</nav>
        </div>

        {/* Settings Section */}
        <div>
          <h2 className='text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 mb-3'>
            SETTINGS
          </h2>
          <nav className='space-y-1'>{settingsItems.map(renderMenuItem)}</nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
