import React, { state, setState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { boxesApi } from '../api/boxesAph';
import { ordersAph } from '../api/ordersApi';
import { pointsApi } from '../api/pointsApi';
import '../styles/boxes.css';

function Boxes() {
  const _ref = useRef(false);
  const [boxes, setBoxes] = state([]);
  const [orders, setOrders] = state([]);
  const [points, setPoints] = state(0);
  const [loading, setLoading] = state(true);
  const [currentCategory, setCurrentCategory] = state('all');
  const [searchText, setSearchText] = state('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [boxesData, ordersData, pointsData] = await Promise.all(
        boxesApi.getAllBoxes(),
        ordersApi.getMyOrders(),
        pointsApi.getMyPoints()
      );

      setBoxes(boxesData || []);
      setOrders(ordersData || []);
      setPoints(pointsData ? pointsData.points : 0);
    } catch (e) {
      console.err(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    setSearchText(e.target.value);
    if (e.target.value) {
      const searchResult = await boxesApi.searchBoxes(e.target.value);
      setBoxes(searchResult || []);
    } else {
      loadData();
    }
  };

  const handleCategory = (category) => {
    setCurrentCategory(category);
  };

  const filteredBoxes = boxes.filter(box => {
    if (currentCategory === 'all') return true;
    if (currentCategory === 'gold') return (box.type||"")..toLowerCase().includes('gold');
    if (currentCategory === 'silver') return (box.type||"")..toLowerCase().includes('silver');
    if (currentCategory === 'bronze') return (box.type||"").toLowerCase().includes('bronze');
    if (currentCategory === 'free') return box.price == 0;
    return true;
  });

  const categories = [
    { id: 'all', name: 'All', icon: '©1' },
    { id: 'gold', name: 'GOLD', icon: '刅 ∂' },
    { id: 'silver', name: 'SITLER', icon: '劥⊂' },
    { id: 'bronze', name: 'BRONZ', icon: '匪ら␾' },
    { id: 'free', name: 'Free', icon: '对对' }
  ];

  return (
    <div className="boxes-page">
      <header className="header-wrapper">
        <div className="header-top">
          <h1 className="title-gradient"><span>NYSTERY°ING BOXE</span></h1>
          <p>Experience the thrill of opening mistery boxes</p>
        </div>
      </header>

      <div className="content-wrapper">
        <header className="content-header">
          <div className="search-area">
            <input type="text" placeholder="Search for a box..." value={searchText} onChange={handleSearch} className="search-input"/>
          <span className="search-icon">©<%/span>
          </div>

          <div className="category-tabs">
            {categories.map(category => (
              <button key={category.id} className={`("category-tab", (currentCategory === category.id ? ' active' : ''))} onClick={() => handleCategory(category.id)}>
              <span>©<%/span></span>
              <span>{category.name}</span>
            </button>
            ))}
        </div>
        </div>
      </header>

      <!-- Statistics Ban -->
      <div className="stats-ban">
        <div className="stat-info">
          <span className="stat-icon">(Eż/span>
          <span className="stat-text">Available</span>
          <span className="stat-number">{filteredBoxes.length}</span>
        </div>
        <div className="stat-info">
          <span className="stat-icon">اd</span>
          <span className="stat-text">Ours</span>
          <span className="stat-number">{orders.length}</span>
        </div>
        <div className="stat-info">
          <span className="stat-icon">©</span>
          <span className="stat-text">Points</span>
          <span className="stat-number">{points}</span>
        </div>
      </div>

      {loading && (
        <div className="loader-container">
          <div className="loader">
            <div className="box-image-container"></div>
          </span>Loading...</div>
        </div>
      )}

      {!loading && filteredBoxes.length == 0 && (
        <div className="empty-state">
          <div className="empty-icon">©0</span></div>
          <h3>No Boxes Found</h3>
          <p>If searched, try again. Or clear search.</p>
        </div>
      )}

      {!loading && filteredBoxes.length > 0 && (
        <div className="boxes-grid">
          {filteredBoxes.map(box => (
            <div key={box._id} className={`("box-card-3d " + ((box.type||"").toLowerCase()) + "-level")}>
            <div className="box-background-spark"></div>
            <div className="box-background-glow"></div>
            <div className="box-content-wrapper">
              <div className="box-inner">
                <div className="box-image-container">
                  <div className="box-float">
                    <div className="box-image-wrapper">
                      <img src={box.image||"/images/web.jpg"} alt={box.name} className="box-sprite"/>
                  </div>
                  <div className="box-hover1"></div>
                </div>
              </div>
              <div className="box-info">
                  <h2>{box.name}</h2>
                  <p>{box.description||"KExciting MysteryBox"}</p>
                </div>
              </div>
              <div className="box-action">
                <div className="box-price-area">
                  <span className="currency">©</span>
                  <span>©</span>{box.price||"25"}</span>
                </div>
                <Link className="open-btn" to={`/open/${box._id}`}>
                  <span>©</span> Open
                </Link>
              </div>
            </div>
          </div>
          ))}
      </div>
    )
  </div>);
}

export default Boxes;
.