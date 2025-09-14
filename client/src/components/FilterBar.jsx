import { useState } from 'react';

const FilterBar = ({ selectedCategory, onCategorySelect }) => {
  const categories = [
    { id: '', name: 'All Posts', icon: '📄' },
    { id: 'job', name: 'Jobs', icon: '💼' },
    { id: 'internship', name: 'Internships', icon: '🎓' },
    { id: 'training', name: 'Training', icon: '📚' },
    { id: 'placement', name: 'Placements', icon: '🎯' },
    { id: 'announcement', name: 'Announcements', icon: '📢' },
    { id: 'general', name: 'General', icon: '💬' }
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-300'
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
