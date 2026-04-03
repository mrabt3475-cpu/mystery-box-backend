import React, { useState, useEffect, useCallback } from 'react';
import './Pagination.css';

const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange, 
  maxButtons = 5,
  showInfo = true,
  infoText = 'صفحة'
}) => {
  const [inputPage, setInputPage] = useState(currentPage);

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const getPageNumbers = useCallback(() => {
    const pages = [];
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages, maxButtons]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    const page = parseInt(inputPage, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      handlePageChange(page);
    } else {
      setInputPage(currentPage);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      {/* First & Prev Buttons */}
      <button
        className="pagination-btn pagination-first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        title="الأولى"
      >
        ‹‹
      </button>
      <button
        className="pagination-btn pagination-prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="السابق"
      >
        ‹
      </button>

      {/* Page Numbers */}
      <div className="pagination-numbers">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next & Last Buttons */}
      <button
        className="pagination-btn pagination-next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="التالي"
      >
        ›
      </button>
      <button
        className="pagination-btn pagination-last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        title="الأخيرة"
      >
        ››
      </button>

      {/* Page Info & Jump */}
      {showInfo && (
        <form className="pagination-jump" onSubmit={handleInputSubmit}>
          <span className="pagination-info">
            {infoText} {currentPage} من {totalPages}
          </span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
            className="pagination-input"
          />
          <button type="submit" className="pagination-go">
            Go
          </button>
        </form>
      )}
    </div>
  );
};

export default Pagination;
