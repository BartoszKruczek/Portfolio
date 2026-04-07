import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../products';

function Home({ onAddToCart }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Wszystkie");
  const [selectedColor, setSelectedColor] = useState("Wszystkie");
  const [maxPrice, setMaxPrice] = useState(1000);

  // Pobieranie unikalnych kategorii i kolorów
  const categories = ["Wszystkie", ...new Set(PRODUCTS.map(p => p.category))];
  const colors = ["Wszystkie", ...new Set(PRODUCTS.map(p => p.color))];

  // Logika filtrowania
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Wszystkie" || product.category === selectedCategory;
    const matchesColor = selectedColor === "Wszystkie" || product.color === selectedColor;
    const matchesPrice = product.price <= maxPrice;
    
    return matchesSearch && matchesCategory && matchesColor && matchesPrice;
  });

  return (
    <div className="home-page">
      <header className="shop-header">
        <h1 style={{fontSize: '3rem', fontWeight: '800', marginBottom: '10px'}}>Nowoczesny Sklep</h1>
        <p style={{color: 'var(--text-muted)'}}>Ekskluzywne produkty w zasięgu ręki</p>
        
        <div className="search-container" style={{width: '100%', maxWidth: '500px', margin: '30px auto'}}>
          <input 
            type="text" 
            placeholder="Szukaj produktu..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{padding: '15px 25px', borderRadius: '50px', width: '100%'}}
          />
        </div>

        <div className="filters-panel">
          <div className="filter-group">
            <label>Kategoria</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Kolor</label>
            <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
              {colors.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="filter-group" style={{flexGrow: 1}}>
            <label>Cena do: <span style={{color: 'var(--accent)'}}>{maxPrice} PLN</span></label>
            <input 
              type="range" 
              min="0" 
              max="1000" 
              step="1" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))} 
            />
          </div>
        </div>
      </header>

      <main className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onBtnClick={onAddToCart} />
          ))
        ) : (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '100px' }}>
            <h2 style={{color: 'var(--text-muted)'}}>Nie znaleźliśmy niczego takiego... 🕵️‍♂️</h2>
            <button 
              onClick={() => {setSearchTerm(""); setSelectedCategory("Wszystkie"); setMaxPrice(1000);}}
              style={{marginTop: '20px', background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 'bold'}}
            >
              Wyczyść filtry
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;