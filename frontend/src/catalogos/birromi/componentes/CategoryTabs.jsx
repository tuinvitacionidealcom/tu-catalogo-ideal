import React, { useRef, useEffect } from 'react';

const CategoryTabs = ({ categories = [], activeCategory, onSelectCategory }) => {
  const containerRef = useRef(null);

  // Auto-scroll when category changes
  useEffect(() => {
    const activeTab = containerRef.current?.querySelector('[data-active="true"]');
    if (activeTab && containerRef.current) {
      const container = containerRef.current;
      const scrollLeft = activeTab.offsetLeft - (container.clientWidth / 2) + (activeTab.clientWidth / 2);
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [activeCategory]);

  return (
    <div className="sticky top-0 bg-white/90 backdrop-blur-md z-30 border-b border-slate-100 shadow-xs">
      <div 
        ref={containerRef}
        className="flex items-center gap-2 overflow-x-auto py-3.5 px-4 scrollbar-none"
      >
        <button
          onClick={() => onSelectCategory('all')}
          data-active={activeCategory === 'all'}
          className={`px-4 py-2 rounded-full font-sans font-bold text-xs whitespace-nowrap transition-all duration-300 cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-brand text-white shadow-md'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          Todos
        </button>
        
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            data-active={activeCategory === category}
            className={`px-4 py-2 rounded-full font-sans font-bold text-xs whitespace-nowrap uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeCategory === category
                ? 'bg-brand text-white shadow-md'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
