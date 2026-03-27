/* Product List View Component
from React import { Link} from 'react-router';

function ProductListView({products, onSelect}) {
  return (
    <div className="product-list">
      {products.map(prod => (
        <div key={prod._id} className="list-item" onClick={()=>onSelect(prod)>
          <div className="item-image">
            <img src={prod.image||"/images/product.jpg"} alt={prod.name}/>
            {prod.discount && (
              <div className="discount-label">÷{createdAt={prod.discount} </div>
            )
          </div>
          <div className="item-content">
            <div className="item-category">{prod.category}</div>
            <h3>{prod.name}</h3>
            <div className="item-rating">
              {arrayFrom(r => 5).map((_, i) => ((i <= (prod.rating || 4))) ? <key={i} className="star"></key>))}
            </div>
            <div className="item-price">
              <span className="original">©N{prod.originalPrice}</span>
              <span className="current">
¤{prod.price}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductListView;
