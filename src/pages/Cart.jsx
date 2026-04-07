import React from 'react';
import { Link } from 'react-router-dom';

function Cart({ cartItems, onUpdateQuantity, onRemove }) {
  // Obliczanie sumy całkowitej
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );

  // Widok, gdy koszyk jest pusty
  if (cartItems.length === 0) {
    return (
      <div style={{ 
        padding: '100px 20px', 
        textAlign: 'center', 
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Twój koszyk jest pusty 🛒</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
          Wygląda na to, że nie dodałeś jeszcze żadnych produktów.
        </p>
        <Link to="/" className="add-btn" style={{ textDecoration: 'none', maxWidth: '250px' }}>
          Wróć do zakupów
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page" style={{ padding: '40px 5%', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '40px', fontSize: '2.5rem', fontWeight: '800' }}>Twój Koszyk</h1>
      
      <div className="cart-container">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-row">
            {/* Zdjęcie i Nazwa */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: '2' }}>
              <img 
                src={item.image} 
                alt={item.name} 
                style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} 
              />
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{item.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.price.toFixed(2)} PLN</p>
                <button className="remove-btn" onClick={() => onRemove(item.id)}>Usuń</button>
              </div>
            </div>

            {/* Selektor Ilości (Nowy Design) */}
            <div style={{ flex: '1', display: 'flex', justifyContent: 'center' }}>
              <div className="quantity-controls">
                <button 
                  className="qty-btn" 
                  onClick={() => onUpdateQuantity(item.id, 'decrement')}
                >
                  −
                </button>
                <span className="qty-number">{item.quantity}</span>
                <button 
                  className="qty-btn" 
                  onClick={() => onUpdateQuantity(item.id, 'increment')}
                >
                  +
                </button>
              </div>
            </div>

            {/* Suma za dany produkt */}
            <div style={{ flex: '1', textAlign: 'right' }}>
              <p style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--accent)' }}>
                {(item.price * item.quantity).toFixed(2)} PLN
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Podsumowanie Koszyka */}
      <div style={{ 
        marginTop: '40px', 
        padding: '30px', 
        background: 'var(--bg-card)', 
        borderRadius: '20px', 
        border: '1px solid var(--border)',
        textAlign: 'right'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Razem do zapłaty:</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)' }}>
            {totalPrice.toFixed(2)} PLN
          </h2>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
          <Link to="/" style={{ 
            textDecoration: 'none', 
            color: 'var(--text-muted)', 
            fontWeight: '600',
            alignSelf: 'center'
          }}>
            Kontynuuj zakupy
          </Link>
          <button className="add-btn" style={{ maxWidth: '300px', padding: '15px 40px' }}>
            Przejdź do kasy
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;