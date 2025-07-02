'use client';

import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { mockCategories } from '../../../data';
import { Category, CategoryItem } from '../../../types';

const SystemCategoriesManagement = () => {
  // Use mock categories data
  const [categories, setCategories] = useState(mockCategories);

  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    'classrooms',
    'course-levels',
    'study-programs',
    'time-slots',
  ]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const addNewCategory = () => {
    const newCategory: Category = {
      id: `category-${Date.now()}`,
      name: 'New Category',
      icon: '📁',
      color: 'bg-gray-100 text-gray-600',
      items: [],
      type: 'other',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCategories([...categories, newCategory]);
  };

  const addNewItem = (categoryId: string, itemType: string) => {
    const newItem: CategoryItem = {
      id: `item-${Date.now()}`,
      name: `New ${itemType}`,
    };

    setCategories(
      categories.map((cat) =>
        cat.id === categoryId ? { ...cat, items: [...cat.items, newItem] } : cat
      )
    );
  };

  const deleteItem = (categoryId: string, itemId: string) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
          : cat
      )
    );
  };

  const CategoryCard = ({ category }: { category: Category }) => {
    const isExpanded = expandedCategories.includes(category.id);

    return (
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
        <div
          className='flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50'
          onClick={() => toggleCategory(category.id)}
        >
          <div className='flex items-center space-x-3'>
            <div
              className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center text-sm font-medium`}
            >
              {category.icon}
            </div>
            <div>
              <h3 className='font-medium text-gray-900'>{category.name}</h3>
              <p className='text-sm text-gray-500'>
                {category.items.length} items
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            {isExpanded ? (
              <ChevronUp className='w-4 h-4 text-gray-400' />
            ) : (
              <ChevronDown className='w-4 h-4 text-gray-400' />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className='border-t border-gray-200'>
            <div className='p-4 space-y-2'>
              {category.items.map((item) => (
                <div
                  key={item.id}
                  className='flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-md group'
                >
                  <span className='text-gray-700'>{item.name}</span>
                  <div className='flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <button className='p-1 text-blue-500 hover:bg-blue-50 rounded'>
                      <Edit className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => deleteItem(category.id, item.id)}
                      className='p-1 text-red-500 hover:bg-red-50 rounded'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() =>
                  addNewItem(category.id, category.name.slice(0, -1))
                }
                className='w-full flex items-center justify-center space-x-2 py-3 mt-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors'
              >
                <Plus className='w-4 h-4' />
                <span>Add New {category.name.slice(0, -1)}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              System Categories Management
            </h1>
            <p className='text-gray-600 mt-1'>
              Manage predefined lists and categories for the Zenish application
            </p>
          </div>
          <button
            onClick={addNewCategory}
            className='bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition-colors'
          >
            <Plus className='w-4 h-4' />
            <span>Add New Category</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <h2 className='text-lg font-medium text-gray-900 mb-4'>
            Quick Actions
          </h2>
          <div className='flex flex-wrap gap-4'>
            <button className='flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors'>
              <Download className='w-4 h-4' />
              <span>Export Categories</span>
            </button>
            <button className='flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors'>
              <Upload className='w-4 h-4' />
              <span>Import Categories</span>
            </button>
            <button className='flex items-center space-x-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors'>
              <RotateCcw className='w-4 h-4' />
              <span>Reset to Default</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemCategoriesManagement;
