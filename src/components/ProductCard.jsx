import { Link } from 'react-router-dom';

function ProductCard({ product, onBtnClick, isFavorite, onToggleFav, avgRating, reviewCount }) {
  // Zaokrąglamy średnią do pełnych gwiazdek (np. 4.2 -> 5 zgodnie z Twoją zasadą)
  const stars = Math.ceil(avgRating || 0);

  return (
    <div className="product-card">
      <div className="product-image" style={{ position: 'relative', overflow: 'hidden' }}>
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ 
              width: '100%', 
              display: 'block',
              aspectRatio: '1 / 1', 
              objectFit: 'cover'
            }}
          />
        </Link>
        <button 
          onClick={() => onToggleFav(product.id)}
          style={{ 
            position: 'absolute', top: '10px', right: '10px', 
            background: 'white', border: 'none', borderRadius: '50%', 
            width: '35px', height: '35px', cursor: 'pointer', 
            fontSize: '1.2rem', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
          }}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="product-info" style={{ padding: '20px' }}>
        <div style={{ minHeight: '85px' }}> {/* Zwiększamy nieco wysokość dla gwiazdek */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>{product.name}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>{product.category}</p>
          
          {/* SEKCJA GWIAZDEK */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
            <span style={{ color: '#ffc107' }}>
              {'★'.repeat(stars)}
              <span style={{ color: 'var(--border)' }}>{'★'.repeat(5 - stars)}</span>
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              ({reviewCount || 0})
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <span style={{ fontWeight: '800', fontSize: '1.2rem' }}>
            {product.price.toFixed(2)} PLN
          </span>
          <button 
            className="add-btn" 
            style={{ width: '40px', height: '40px', borderRadius: '12px' }} 
            onClick={() => onBtnClick(product)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
