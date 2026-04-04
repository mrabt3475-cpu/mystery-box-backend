/**
 * 🎨 Pagination Component
 * 
 * ترقيم الصفحات
 */

import React from 'react';
import './Pagination.css';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  maxVisiblePages = 5,
  showFirstLast = true,
  showPrevNext = true,
  className = '',
  ...props
}) => {
  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange?.(page);
    }
  };

  const pages = getPageNumbers();

  return (
    <div className={`ui-pagination ${className}`} {...props}>
      {/* First Page */}
      {showFirstLast && (
        <button
          className="ui-pagination__btn ui-pagination__btn--nav"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          ‹‹
        </button>
      )}
      
      {/* Previous Page */}
      {showPrevNext && (
        <button
          className="ui-pagination__btn ui-pagination__btn--nav"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹
        </button>
      )}
      
      {/* Page Numbers */}
      <div className="ui-pagination__pages">
        {pages.map(page => (
          <button
            key={page}
            className={`ui-pagination__btn ${page === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
      
      {/* Next Page */}
      {showPrevNext && (
        <button
          className="ui-pagination__btn ui-pagination__btn--nav"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          ›
        </button>
      )}
      
      {/* Last Page */}
      {showFirstLast && (
        <button
          className="ui-pagination__btn ui-pagination__btn--nav"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          ››
        </button>
      )}
    </div>
  );
};

export default Pagination;