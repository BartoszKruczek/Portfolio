import { useState } from 'react';
import { toast } from 'react-hot-toast';

function Login({ setUser, user }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const getUsers = () => JSON.parse(localStorage.getItem('registeredUsers')) || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const allUsers = getUsers();

    if (isRegistering) {
      if (allUsers.find(u => u.email === email)) {
        toast.error("Użytkownik już istnieje!");
      } else {
        localStorage.setItem('registeredUsers', JSON.stringify([...allUsers, { email, password }]));
        toast.success("Konto utworzone!");
        setIsRegistering(false);
        setEmail('');
        setPassword('');
      }
    } else {
      const foundUser = allUsers.find(u => u.email === email && u.password === password);
      if (foundUser) {
        setUser({ email: foundUser.email });
        toast.success("Zalogowano!");
      } else {
        toast.error("Błędne dane!");
      }
    }
  };

  if (user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 20px' }}>
        <div className="login-card" style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
          <h2 style={{ marginBottom: '20px' }}>Witaj, {user.email}!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Jesteś zalogowany w naszym systemie.</p>
          <button className="add-btn" onClick={() => toast("Historia zamówień wkrótce!")}>
            Moje zamówienia
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '20px' }}>
      <form onSubmit={handleSubmit} className="login-card" style={{ 
        width: '100%', 
        maxWidth: '450px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px' 
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>{isRegistering ? 'Rejestracja' : 'Logowanie'}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>E-mail</label>
          <input 
            type="email" 
            placeholder="twoj@email.com" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Hasło</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        <button className="add-btn" type="submit" style={{ marginTop: '10px', padding: '15px' }}>
          {isRegistering ? 'Zarejestruj się' : 'Zaloguj się'}
        </button>

        <p 
          onClick={() => { setIsRegistering(!isRegistering); setEmail(''); setPassword(''); }} 
          style={{ 
            textAlign: 'center', 
            marginTop: '10px', 
            cursor: 'pointer', 
            color: 'var(--accent)',
            fontWeight: '600',
            fontSize: '0.9rem'
          }}
        >
          {isRegistering ? 'Masz już konto? Zaloguj się' : 'Nie masz konta? Załóż je'}
        </p>
      </form>
    </div>
  );
}

export default Login;