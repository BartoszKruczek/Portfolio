import { Link } from 'react-router-dom';

function ProductCard({ product, onBtnClick }) {
  return (
    <div className="product-card">
      {/* Zdjęcie teraz jest linkiem */}
      <Link to={`/product/${product.id}`} className="product-image">
        <img src={product.image} alt={product.name} />
      </Link>
      
      <div className="product-info">
        {/* Nazwa też jest linkiem */}
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>{product.name}</h3>
        </Link>
        <p className="price">{product.price.toFixed(2)} PLN</p>
        <button className="add-btn" onClick={() => onBtnClick(product)}>
          Dodaj do koszyka
        </button>
      </div>
    </div>
  );
}

export default ProductCard;