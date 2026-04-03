import React, { useState, useEffect, useCallback, useRef } from 'react';
import './SearchInput.css';

const SearchInput = ({ 
  onSearch, 
  placeholder = 'بحث...',
  debounce = 500,
  initialValue = '',
  showClear = true,
  className = ''
}) => {
  const [value, setValue] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsSearching(true);

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout for debounce
    debounceRef.current = setTimeout(() => {
      onSearch?.(newValue);
      setIsSearching(false);
    }, debounce);
  }, [onSearch, debounce]);

  const handleClear = () => {
    setValue('');
    onSearch?.('');
    setIsSearching(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    onSearch?.(value);
    setIsSearching(false);
  };

  return (
    <form className={`search-input-wrapper ${className}`} onSubmit={handleSubmit}>
      <div className="search-input-container">
        <span className="search-icon">
          {isSearching ? (
            <span className="search-spinner"></span>
          ) : (
            '🔍'
          )}
        </span>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="search-input"
        />
        {showClear && value && (
          <button 
            type="button" 
            className="search-clear"
            onClick={handleClear}
          >
            ×
          </button>
        )}
        <button type="submit" className="search-submit">
          بحث
        </button>
      </div>
    </form>
  );
};

export default SearchInput;
