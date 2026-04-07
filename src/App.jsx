import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

// Komponenty
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Strony
import Home from './pages/Home';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Login from './pages/Login';

function App() {
  // --- STAN: TRYB JASNY / CIEMNY ---
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // --- STAN: UŻYTKOWNIK ---
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('loggedUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('loggedUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('loggedUser');
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    toast("Wylogowano pomyślnie", { icon: '👋' });
  };

  // --- STAN: KOSZYK ---
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('myCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('myCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast.success(`Dodano ${product.name} do koszyka!`);
  };

  const updateQuantity = (id, action) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === id) {
          if (action === 'increment') return { ...item, quantity: item.quantity + 1 };
          if (action === 'decrement' && item.quantity > 1) return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
    });
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    toast.error("Usunięto z koszyka");
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // --- RENDEROWANIE ---
  return (
    <Router>
      <div className="App">
        {/* Powiadomienia TOAST */}
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              border: '1px solid var(--border)'
            }
          }} 
        />

        {/* Nawigacja górna */}
        <Navbar 
          cartCount={totalItems} 
          user={user} 
          onLogout={handleLogout} 
          toggleTheme={toggleTheme}
          currentTheme={theme}
        />

        {/* Treść strony */}
        <main style={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<Home onAddToCart={addToCart} />} />
            <Route 
              path="/cart" 
              element={
                <Cart 
                  cartItems={cart} 
                  onUpdateQuantity={updateQuantity} 
                  onRemove={removeItem} 
                />
              } 
            />
            <Route 
              path="/product/:id" 
              element={<ProductDetails onAddToCart={addToCart} />} 
            />
            <Route path="/about" element={<About />} />
            <Route 
              path="/login" 
              element={<Login setUser={setUser} user={user} />} 
            />
          </Routes>
        </main>

        {/* Stopka dolna */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;