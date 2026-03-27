/* View Toggle Component
function ViewToggle({view, onToggle}) {
  return (
    <div className="view-toggle">
      <button
        className={view === 'grid' ? 'active' : ''}
        onClick={()=>onToggle('grid')}
        aria-label="Grid View"
     >
        <i className="fa-grid"></i>
      </button>
      <button
        className={view === 'list' ? 'active' : ''}
        onClick={()=>onToggle('list')}
        aria-label="List View"
     >
        <i className="fa-list"></i>
      </button>
    </div>
  );
}

export default ViewToggle;
