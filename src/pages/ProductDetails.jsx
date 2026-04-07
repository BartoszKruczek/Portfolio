import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../products';

function ProductDetails({ onAddToCart }) {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Produkt nie znaleziony!</h2>
        <Link to="/">Wróć do strony głównej</Link>
      </div>
    );
  }

  return (
    <div className="product-details-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      {/* PRZYCISK POWROTU */}
      <Link to="/" style={{ 
        display: 'inline-block', 
        marginBottom: '20px', 
        textDecoration: 'none', 
        color: '#764ba2',
        fontWeight: '600'
      }}>
        ← Wróć do sklepu
      </Link>

      <div className="product-details" style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: '40px' 
      }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
        </div>
        
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{product.name}</h1>
          <p style={{ fontSize: '2rem', color: '#764ba2', fontWeight: 'bold', marginBottom: '20px' }}>
            {product.price.toFixed(2)} PLN
          </p>
          <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '20px' }} />
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#555', marginBottom: '30px' }}>
            {product.description}
          </p>
          <button 
            className="add-btn" 
            onClick={() => onAddToCart(product)}
            style={{ padding: '15px 40px', fontSize: '1.1rem', width: 'auto' }}
          >
            Dodaj do koszyka
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;