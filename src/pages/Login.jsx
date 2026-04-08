import { useState } from 'react';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { toast } from 'react-hot-toast';

function Login({ user, orders, favorites }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Stan dla podglądu konkretnego zamówienia
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filtrowanie zamówień zalogowanego użytkownika
  const userOrders = orders ? orders.filter(o => o.userEmail === user?.email) : [];

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      toast.success("Zalogowano przez Google!");
    } catch (error) {
      toast.error("Błąd logowania Google");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Konto założone!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Witaj z powrotem!");
      }
    } catch (error) {
      toast.error("Błąd: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- WIDOK DLA ZALOGOWANEGO UŻYTKOWNIKA ---
  if (user) {
    return (
      <div style={{ padding: '60px 5%', maxWidth: '800px', margin: '0 auto' }}>
        <div className="login-card" style={{ padding: '40px' }}>
          
          {/* PROFIL UŻYTKOWNIKA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px' }}>
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '50%', 
              background: 'var(--accent)', overflow: 'hidden', border: '3px solid var(--accent)' 
            }}>
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ fontSize: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>👤</div>
              )}
            </div>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Cześć, {user.displayName || user.email.split('@')[0]}!</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>ID: {user.uid}</p>
            </div>
          </div>

          {/* SKRÓCONE STATYSTYKI */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
            <div style={{ background: 'var(--bg-body)', padding: '20px', borderRadius: '15px', textAlign: 'center', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px' }}>ZAMÓWIENIA</span>
              <p style={{ fontSize: '1.8rem', fontWeight: '900', marginTop: '5px' }}>{userOrders.length}</p>
            </div>
            <div style={{ background: 'var(--bg-body)', padding: '20px', borderRadius: '15px', textAlign: 'center', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px' }}>ULUBIONE</span>
              <p style={{ fontSize: '1.8rem', fontWeight: '900', marginTop: '5px' }}>{favorites?.length || 0}</p>
            </div>
          </div>

          {/* HISTORIA ZAMÓWIEŃ */}
          <h3 style={{ marginBottom: '20px', fontWeight: '800' }}>Twoja historia zamówień</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {userOrders.length > 0 ? (
              userOrders.map(order => (
                <div 
                  key={order.id} 
                  onClick={() => setSelectedOrder(order)}
                  style={{ 
                    padding: '20px', background: 'var(--bg-card)', borderRadius: '15px', border: '1px solid var(--border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                    transition: '0.2s'
                  }}
                  className="order-item-hover"
                >
                  <div>
                    <div style={{ fontWeight: '700' }}>{order.date}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '4px' }}>Kliknij, aby zobaczyć szczegóły</div>
                  </div>
                  <strong style={{ fontSize: '1.1rem' }}>{order.total.toFixed(2)} PLN</strong>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>Nie dokonałeś jeszcze żadnych zakupów.</p>
            )}
          </div>

          <button 
            className="add-btn" 
            style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', marginTop: '40px', width: 'auto', padding: '10px 30px' }} 
            onClick={() => signOut(auth)}
          >
            Wyloguj się
          </button>
        </div>

        {/* --- MODAL ZE SZCZEGÓŁAMI ZAMÓWIENIA --- */}
        {selectedOrder && (
          <div 
            style={{
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
              background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center',
              zIndex: 1000, padding: '20px', backdropFilter: 'blur(4px)'
            }} 
            onClick={() => setSelectedOrder(null)}
          >
            <div 
              style={{
                background: 'var(--bg-card)', padding: '30px', borderRadius: '24px',
                maxWidth: '500px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                border: '1px solid var(--border)'
              }} 
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ fontWeight: '800' }}>Szczegóły zamówienia</h3>
                <button 
                  onClick={() => setSelectedOrder(null)} 
                  style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-main)' }}
                >
                  ✕
                </button>
              </div>
              
              <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Złożone: {selectedOrder.date}
              </div>

              {/* LISTA PRODUKTÓW W ZAMÓWIENIU */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', justifyContent: 'space-between', padding: '15px', 
                    background: 'var(--bg-body)', borderRadius: '12px', border: '1px solid var(--border)' 
                  }}>
                    <span style={{ fontWeight: '600' }}>{item.name}</span>
                    <span style={{ color: 'var(--accent)', fontWeight: '800' }}>x{item.qty}</span>
                  </div>
                ))}
              </div>

              <div style={{ 
                display: 'flex', justifyContent: 'space-between', 
                borderTop: '2px dashed var(--border)', paddingTop: '20px' 
              }}>
                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Suma całkowita:</span>
                <span style={{ fontWeight: '900', color: 'var(--accent)', fontSize: '1.4rem' }}>
                  {selectedOrder.total.toFixed(2)} PLN
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- WIDOK LOGOWANIA / REJESTRACJI ---
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
      <div className="login-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <h2 style={{ marginBottom: '30px', textAlign: 'center', fontWeight: '800' }}>
          {isRegistering ? 'Stwórz konto' : 'Witaj z powrotem'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" placeholder="Email" required 
            value={email} onChange={e => setEmail(e.target.value)} 
          />
          <input 
            type="password" placeholder="Hasło" required 
            value={password} onChange={e => setPassword(e.target.value)} 
          />
          <button type="submit" className="add-btn" disabled={loading} style={{ marginTop: '10px' }}>
            {loading ? 'Proszę czekać...' : (isRegistering ? 'Zarejestruj się' : 'Zaloguj się')}
          </button>
        </form>

        <div style={{ margin: '25px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>LUB</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          style={{ 
            width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', 
            background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', gap: '10px', fontWeight: '600' 
          }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.png" width="18" alt="G" />
          Kontynuuj z Google
        </button>

        <p style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.9rem' }}>
          {isRegistering ? 'Masz już konto?' : 'Nie masz konta?'} 
          <span 
            onClick={() => setIsRegistering(!isRegistering)} 
            style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: '700', marginLeft: '5px' }}
          >
            {isRegistering ? 'Zaloguj się' : 'Zarejestruj się'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
