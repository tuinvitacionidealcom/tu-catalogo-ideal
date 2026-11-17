import React from 'react';

const CategoryTabs = ({ categories = [], selectedCategory = 'all', onSelectCategory }) => {
  if (!categories || categories.length <= 1) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelectCategory('all')}
        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
          selectedCategory === 'all'
            ? 'bg-brand text-white shadow-sm shadow-brand/20'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
        }`}
      >
        Todos
      </button>

      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer uppercase ${
            selectedCategory === cat
              ? 'bg-brand text-white shadow-sm shadow-brand/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
