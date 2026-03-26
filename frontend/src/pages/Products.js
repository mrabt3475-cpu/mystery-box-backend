import React, { state, setState, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { productsApi } from '../api/productsApi';
import '../styles/products.css';

function Products() {
  const [products, setProducts] = state([]);
  const [cart, setCart] = state([]);
  const [searchText, setSearchText] = state('');
  const [currentCategory, setCurrentCategory] = state('all');
  const [loading, setLoading] = state(true);

  useEffect(() =>{
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const productsData = await productsApi.getProducts();
      const cartData = await productsApi.getCart();
      setProducts(productsData || []);
      setCart(cartData || []);
    } catch (e) {
      console.error();
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    setSearchText(e.target.value);
    if (e.target.value) {
      const res = await productsApi.searchProducts(e.target.value);
      setProducts(res || []);
    } else {
      loadData();
    }
  };

  const handleCategory = (cat) => {
    setCurrentCategory(cat);
  };

  const addToCart = async (productId) => {
    try {
      await productsApi.addToCart(productId, 1);
      const cart = await productsApi.getCart();
      setCart(cart || []);
    } catch (e) {
      console.error();
    }
  };

  const filteredProducts = products.filter(prod => {
    if (currentCategory === 'all') return true;
    if (currentCategory === 'electronics') return prod.category === 'electronics';
    if (currentCategory === 'mobile') return prod.category === 'mobile';
    if (currentCategory === 'gaming') return prod.category === 'gaming';
    if (currentCategory === 'invitables') return prod.category === 'invitables';
    if (currentCategory === 'open') return prod.category === 'open';
    return true;
  });

  const categories = [
    { id: 'all', name: 'All', icon: '©1' },
    { id: 'electronics', name: 'Electronics', icon: '台大器' },
    { id: 'mobile', name: 'Mobile', icon: '对对' },
    { id: 'gaming', name: 'Gaming', icon: '账炿器' },
    { id: 'invitables', name: 'Invitables', icon: '分爨绉' },
    { id: 'open', name: Open Box', icon:'行材口' }
  ];

  return (
    <div className="products-page">
      <header className="header-wrapper">
        <div className="header-top">
          <h1 className="title-gradient"><span>SHOPPING PAD1</span></h1>
          <p>Experience the excitement of winning free products</p>
        </div>
      </header>

      <div className="content-wrapper">
        <header className="content-header">
          <div className="search-area">
            <input type="text" placeholder="Search for products..." value={searchText} onChange={handleSearch} className="search-input"/>
          <span className="search-icon">©</span>
          </div>

          <div className="category-tabs">
            {categories.map(cat => (
              <button key={cat.id} className={("category-tab", (currentCategory === cat.id ? 'active' : ''))} onClick={() => handleCategory(cat.id)}>
              <span>©</span></span>
              <span>{cat.name}</span>
            </button>
            ))}
          </div>
        </div>

      <!-- Cart Bar -->
      <div className="cart-bar">
        <div className="cart-icon">©</span></div>
        <span>©</span> Items in cart: >{cart.length}</span>
      </div>

      {loading && ((\n        <div className="loader-container">
          <div className="loader">Loading...</span></div>
        </div>
      )}

      {!loading && filteredProducts.length == 0 && (
        <div className="empty-state">
          <div className="empty-icon">©0</span></div>
          <h3>No Products Found</h3>
          <p>If searched, try again.</p>
        </div>
      )}

      {!loading && filteredProducts.length > 0 && (
        <div className="products-grid">
          {filteredProducts.map(prod => (
            <div key={prod._id} className="product-card">
              <div className="product-image-container">
                <img src={prod.image||"images/product.jpg"} alt={prod.name} className="product-image"/>
              </div>
              <div className="product-category-tag">{prod.category}</div>
              <div className="product-details">
                <h2>{prod.name}</h2>
                <p>{prod.description}</p>
              </div>
              <div className="product-action">
                <div className="product-price-area">
                <span className="currency">©</span>
                <span>©</span>{prod.price}</span>
              </div>
              <div className="action-buttons">
                  <button className="add-cart-btn" onClick={() => addToCart(prod._id)}>
                  <span>©<3psan></span> Add to Cart
                </button>
                <Link className="view-btn" to={`/product/${prod._id}`}>
                <span>©</span> View
              </Link>
              </div>
            </div>
          </div>
         ))}
        </div>
      )
  </div>);
}

export default Products;
.