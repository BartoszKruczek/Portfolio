import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

// FIREBASE
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, onSnapshot, query, where } from "firebase/firestore";

// KOMPONENTY I STRONY
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Login from './pages/Login';
import Checkout from './pages/Checkout';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('myCart')) || []);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('userFavs')) || []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "orders"), where("userEmail", "==", user.email));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const ordersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersList);
      });
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    localStorage.setItem('myCart', JSON.stringify(cart));
    localStorage.setItem('userFavs', JSON.stringify(favorites));
  }, [theme, cart, favorites]);

  const handleLogout = () => signOut(auth);
  const addOrder = async (order) => await addDoc(collection(db, "orders"), order);

  return (
    <Router>
      <div className="App">
        <Toaster position="bottom-right" />
        <Navbar 
          cartCount={cart.reduce((t, i) => t + i.quantity, 0)} 
          user={user} 
          onLogout={handleLogout} 
          toggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
          currentTheme={theme}
        />
        <main>
          <Routes>
            <Route path="/" element={<Home onAddToCart={(p) => setCart([...cart, {...p, quantity: 1}])} favorites={favorites} onToggleFav={(id) => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id])} />} />
            <Route path="/cart" element={<Cart cartItems={cart} onUpdateQuantity={(id, a) => setCart(cart.map(i => i.id === id ? {...i, quantity: a === 'increment' ? i.quantity+1 : i.quantity-1} : i))} onRemove={(id) => setCart(cart.filter(i => i.id !== id))} />} />
            <Route path="/checkout" element={<Checkout cartItems={cart} totalPrice={cart.reduce((t, i) => t + i.price * i.quantity, 0)} clearCart={() => setCart([])} user={user} addOrder={addOrder} />} />
            <Route path="/product/:id" element={<ProductDetails onAddToCart={(p) => setCart([...cart, {...p, quantity: 1}])} favorites={favorites} onToggleFav={(id) => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id])} />} />
            <Route path="/login" element={<Login user={user} orders={orders} favorites={favorites} />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
