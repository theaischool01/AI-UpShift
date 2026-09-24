import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  Layers,
  Sparkles,
  ChevronDown,
  Check
} from 'lucide-react';

function CustomDropdown({
  id,
  value,
  onChange,
  options = [],
  icon: Icon,
  placeholder = 'Select option',
  openDropdown,
  setOpenDropdown,
  ariaLabel
}) {
  const isOpen = openDropdown === id;
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  const handleToggle = () => {
    setOpenDropdown(isOpen ? null : id);
  };

  const handleSelect = (val) => {
    onChange(val);
    setOpenDropdown(null);
  };

  return (
    <div 
      ref={dropdownRef} 
      className="relative select-none"
      style={{ position: 'relative' }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className="learner-custom-dropdown-trigger"
        style={{
          height: '46px',
          width: '100%',
          padding: '0 14px',
          fontSize: '13px',
          fontWeight: 600,
          color: '#111827',
          backgroundColor: '#FFFFFF',
          border: `1px solid ${isOpen ? '#E31B23' : '#D9DEE6'}`,
          borderRadius: '11px',
          outline: 'none',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          cursor: 'pointer',
          boxShadow: isOpen ? '0 0 0 3px rgba(227, 27, 35, 0.1)' : '0 1px 2px rgba(0, 0, 0, 0.02)',
          transition: 'all 0.16s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          {Icon && (
            <Icon 
              size={15} 
              style={{ color: isOpen || (value && value !== 'ALL' && value !== 'priority') ? '#E31B23' : '#6B7280', flexShrink: 0 }} 
            />
          )}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown 
          size={14} 
          style={{ 
            color: '#6B7280', 
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.18s ease',
          }} 
        />
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="learner-custom-dropdown-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            minWidth: '100%',
            width: 'max-content',
            maxWidth: '320px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E5EA',
            borderRadius: '12px',
            padding: '6px',
            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
            zIndex: 60,
            maxHeight: '280px',
            overflowY: 'auto',
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                style={{
                  height: '40px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#FFF1F1' : 'transparent',
                  color: isSelected ? '#E31B23' : '#111827',
                  fontSize: '13px',
                  fontWeight: isSelected ? 700 : 500,
                  transition: 'background-color 0.12s ease, color 0.12s ease',
                  margin: '1px 0',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  {opt.code && (
                    <span 
                      style={{
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontSize: '10.5px',
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        backgroundColor: isSelected ? '#E31B23' : '#F3F4F6',
                        color: isSelected ? '#FFFFFF' : '#4B5563',
                        flexShrink: 0
                      }}
                    >
                      {opt.code}
                    </span>
                  )}
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {opt.name || opt.label}
                  </span>
                </div>

                {isSelected && (
                  <Check size={14} style={{ color: '#E31B23', flexShrink: 0, marginLeft: '6px' }} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function OpportunityFilters({
  searchQuery,
  setSearchQuery,
  selectedTrack,
  setSelectedTrack,
  sortBy = 'priority',
  setSortBy = () => {},
  tracks = [],
  onFilterChange = () => {},
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const containerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const activeSelectedTrack = selectedTrack || 'ALL';
  const handleSelectTrack = setSelectedTrack || (() => {});
  const availableTracks = tracks;

  // Global click outside & Escape key listeners
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearchInput = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      onFilterChange();
    }, 300);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onFilterChange();
  };

  // Format module track options
  const trackOptions = [
    { value: 'ALL', label: 'All Modules (M1–M6)', name: 'All Modules (M1–M6)' },
    ...availableTracks.map((t) => ({
      value: t.id,
      label: `${t.code} — ${t.name}`,
      code: t.code,
      name: t.name
    }))
  ];

  // Format priority / sorting options
  const sortOptions = [
    { value: 'priority', label: 'Priority' },
    { value: 'newest', label: 'Newest Posted' },
    { value: 'pay', label: 'Most Pay' },
    { value: 'trending', label: 'Trending' },
    { value: 'local_business', label: 'Local Businesses' }
  ];

  return (
    <div ref={containerRef} className="w-full">
      {/* Search, Track Module Filter + Marketplace Sort */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5 w-full">
        {/* Search Input */}
        <div className="learner-search-wrap flex-1" style={{ position: 'relative' }}>
          <Search className="learner-search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInput}
            placeholder="Search opportunities..."
            className="learner-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827]"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#9CA3AF',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Controls Group: Track Module Filter + Marketplace Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          {/* Module Filter */}
          <div className="w-full sm:w-[185px]">
            <CustomDropdown
              id="track"
              value={activeSelectedTrack}
              onChange={(val) => {
                handleSelectTrack(val);
                onFilterChange();
              }}
              options={trackOptions}
              icon={Layers}
              placeholder="All Modules (M1–M6)"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              ariaLabel="Filter by UpShift Module"
            />
          </div>

          {/* Marketplace Sort Selector */}
          <div className="w-full sm:w-[175px]">
            <CustomDropdown
              id="sort"
              value={sortBy}
              onChange={(val) => {
                setSortBy(val);
                onFilterChange();
              }}
              options={sortOptions}
              icon={Sparkles}
              placeholder="Priority"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              ariaLabel="Sort marketplace opportunities"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
