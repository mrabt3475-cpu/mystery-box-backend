import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const featuredBoxes = [
    { id: 1, name: 'Premium Box', price: 29.99, image: 'https://picsum.photos/400/300?random=1', type: 'premium', discount: 20 },
    { id: 2, name: 'Mystery Box', price: 19.99, image: 'https://picsum.photos/400/300?random=2', type: 'standard', badge: 'HOT' },
    { id: 3, name: 'VIP Box', price: 49.99, image: 'https://picsum.photos/400/300?random=3', type: 'vip', badge: 'NEW' },
    { id: 4, name: 'Starter Box', price: 9.99, image: 'https://picsum.photos/400/300?random=4', type: 'basic' },
  ];

  const categories = [
    { name: 'Gaming', icon: '🎮', count: 150 },
    { name: 'Electronics', icon: '📱', count: 89 },
    { name: 'Fashion', icon: '👟', count: 234 },
    { name: 'Crypto', icon: '₿', count: 67 },
    { name: 'Gift Cards', icon: '🎁', count: 312 },
    { name: 'Subscriptions', icon: '⭐', count: 45 },
  ];


  const stats = [
    { value: '50K+', label: 'Happy Users' },
    { value: '$2M+', label: 'Prizes Won' },
    { value: '1000+', label: 'Products' },
    { value: '99.9%', label: 'Uptime' },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="particle" style={{ '--delay': `${i * 0.5}s`, '--x': `${Math.random() * 100}%` }}></div>
            ))}
          </div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>🎉</span> New boxes added daily!
            </div>
            <h1 className="hero-title">
              Unlock <span className="gradient-text">Mystery</span> Prizes
            </h1>
            <p className="hero-subtitle">
              Open mystery boxes and win amazing prizes. From gaming gear to crypto, 
              electronics to gift cards - your next adventure awaits!
            </p>
            <div className="hero-actions">
              <Link to="/boxes" className="btn btn-primary btn-lg">
                <span>🎁</span> Explore Boxes
              </Link>
              <Link to="/products" className="btn btn-secondary btn-lg">
                Browse Products
              </Link>
            </div>
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item" style={{ animationDelay: `${index * 0.1}s` }}>
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-box">
              <div className="box-glow"></div>
              <div className="box-3d">
                <span className="box-icon">🎁</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Browse by Category</h2>
            <p>Find exactly what you're looking for</p>
          </div>
          <div className="categories-grid">
            {categories.map((cat, index) => (
              <Link 
                to={`/products?category=${cat.name}`} 
                key={index} 
                className="category-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
                <span className="category-count">{cat.count} products</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Boxes */}
      <section className="section boxes-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Boxes</h2>
            <p>Hand-picked boxes with amazing prizes</p>
          </div>
          <div className="grid grid-4">
            {featuredBoxes.map((box, index) => (
              <Link to={`/boxes/${box.id}`} key={box.id} className="card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="card-image">
                  <img src={box.image} alt={box.name} />
                  {box.badge && (
                    <span className={`card-badge badge-${box.badge.toLowerCase()}`}>
                      {box.badge}
                    </span>
                  )}
                  {box.discount && (
                    <span className="card-badge badge-sale">-{box.discount}%</span>
                  )}
                </div>
                <div className="card-content">
                  <h3 className="card-title">{box.name}</h3>
                  <div className="card-price">
                    ${box.price}
                    {box.discount && <span>${(box.price / (1 - box.discount/100)).toFixed(2)}</span>}
                  </div>
                  <button className="btn btn-primary mt-2" style={{ width: '100%' }}>
                    Open Now
                  </button>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/boxes" className="btn btn-outline">
              View All Boxes
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section how-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Start winning in 3 simple steps</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">🎁</div>
              <h3>Choose a Box</h3>
              <p>Browse our collection of mystery boxes and find one that excites you</p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon">💳</div>
              <h3>Open It Up</h3>
              <p>Use your balance or payment method to open the box</p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">🏆</div>
              <h3>Win Prizes</h3>
              <p>Get instant results and win amazing prizes!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-content">
              <h2>Ready to Start Winning?</h2>
              <p>Join thousands of happy users who have won amazing prizes</p>
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
            </div>
            <div className="cta-visual">
              <div className="cta-glow"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
