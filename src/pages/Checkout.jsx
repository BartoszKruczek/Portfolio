import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function Checkout({ cartItems, totalPrice, clearCart, user, addOrder }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Dane, 2: Płatność, 3: Procesowanie
  const [formData, setFormData] = useState({
    name: '', address: '', city: '', zip: '', method: 'blik'
  });

  const banks = [
    { id: 'ipko', name: 'iPKO', logo: '🦁' },
    { id: 'mbank', name: 'mBank', logo: '🌸' },
    { id: 'ing', name: 'ING', logo: '🦁' },
    { id: 'blik', name: 'BLIK', logo: '🔢' },
    { id: 'revolut', name: 'Revolut', logo: '💳' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const goToPayment = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFinalOrder = async (bankName) => {
    setStep(3); // Start symulacji

    const newOrder = {
      date: new Date().toLocaleString(),
      total: totalPrice,
      userEmail: user ? user.email : 'Gość',
      status: 'Opłacone',
      paymentMethod: bankName,
      items: cartItems.map(i => ({ name: i.name, qty: i.quantity })),
      createdAt: new Date()
    };

    // Symulujemy opóźnienie banku (2 sekundy)
    setTimeout(async () => {
      try {
        await addOrder(newOrder);
        toast.success("Płatność zaakceptowana!", { icon: '💰' });
        clearCart();
        navigate('/login');
      } catch (error) {
        toast.error("Błąd połączenia");
        setStep(2);
      }
    }, 2500);
  };

  if (step === 3) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
        <div className="loader" style={{ 
          width: '50px', height: '50px', border: '5px solid var(--border)', 
          borderTop: '5px solid var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' 
        }}></div>
        <h2 style={{ marginTop: '20px' }}>Łączenie z bramką płatniczą...</h2>
        <p style={{ color: 'var(--text-muted)' }}>Proszę nie odświeżać strony.</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '60px 5%', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
        <div style={{ flex: 1, height: '4px', background: 'var(--accent)', borderRadius: '2px' }}></div>
        <div style={{ flex: 1, height: '4px', background: step >= 2 ? 'var(--accent)' : 'var(--border)', borderRadius: '2px' }}></div>
      </div>

      {step === 1 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
          <form onSubmit={goToPayment} className="login-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3>1. Dane do wysyłki</h3>
            <input name="name" placeholder="Imię i Nazwisko" required onChange={handleChange} />
            <input name="address" placeholder="Adres" required onChange={handleChange} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input name="zip" placeholder="Kod" required onChange={handleChange} />
              <input name="city" placeholder="Miasto" required onChange={handleChange} />
            </div>
            <button type="submit" className="add-btn" style={{ marginTop: '20px' }}>Przejdź do płatności</button>
          </form>

          <div className="login-card" style={{ height: 'fit-content' }}>
            <h4>Podsumowanie</h4>
            <h2 style={{ color: 'var(--accent)', margin: '15px 0' }}>{totalPrice.toFixed(2)} PLN</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Produkty: {cartItems.length}</p>
          </div>
        </div>
      ) : (
        <div className="login-card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3 style={{ marginBottom: '30px' }}>2. Wybierz metodę płatności</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px' }}>
            {banks.map(bank => (
              <div 
                key={bank.id} 
                onClick={() => handleFinalOrder(bank.name)}
                style={{ 
                  padding: '20px', border: '1px solid var(--border)', borderRadius: '15px', 
                  cursor: 'pointer', transition: '0.2s', background: 'var(--bg-body)'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{bank.logo}</div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{bank.name}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setStep(1)} style={{ marginTop: '30px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            ← Wróć do danych
          </button>
        </div>
      )}
    </div>
  );
}

export default Checkout;