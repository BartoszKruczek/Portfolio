import { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../products';
import { db } from '../firebase';
import { collection, onSnapshot } from "firebase/firestore";

function Home({ onAddToCart, favorites, onToggleFav }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Wszystkie');
  const [sortBy, setSortBy] = useState('default');
  const [reviewStats, setReviewStats] = useState({}); // Statystyki z Firebase

  // 1. POBIERANIE OPINII Z FIREBASE I OBLICZANIE ŚREDNIEJ
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reviews"), (snapshot) => {
      const stats = {};
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const pId = data.productId;
        
        if (!stats[pId]) {
          stats[pId] = { totalRating: 0, count: 0 };
        }
        stats[pId].totalRating += data.rating;
        stats[pId].count += 1;
      });

      const processedStats = {};
      for (const id in stats) {
        processedStats[id] = {
          average: stats[id].totalRating / stats[id].count,
          count: stats[id].count
        };
      }
      setReviewStats(processedStats);
    });

    return () => unsubscribe();
  }, []);

  // 2. DYNAMICZNE KATEGORIE
  const categories = useMemo(() => {
    const rawCategories = PRODUCTS.map(p => p.category);
    return ['Wszystkie', ...new Set(rawCategories)];
  }, []);

  // 3. LOGIKA CENY
  const maxProductPrice = PRODUCTS.length > 0 ? Math.max(...PRODUCTS.map(p => p.price)) : 2000;
  const [maxPrice, setMaxPrice] = useState(maxProductPrice);

  // 4. PRZETWARZANIE PRODUKTÓW (Filtrowanie + Sortowanie)
  const processedProducts = PRODUCTS
    .map(p => ({
      ...p,
      avgRating: reviewStats[p.id]?.average || 0,
      reviewCount: reviewStats[p.id]?.count || 0
    }))
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'Wszystkie' || p.category === activeCategory;
      const matchesPrice = p.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      // Sortowanie po ulubionych (Ulubione na górę)
      if (sortBy === 'favorites') {
        const aIsFav = favorites.includes(a.id);
        const bIsFav = favorites.includes(b.id);
        if (aIsFav && !bIsFav) return -1;
        if (!aIsFav && bIsFav) return 1;
        return 0;
      }

      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating-desc') return b.avgRating - a.avgRating;
      if (sortBy === 'reviews-desc') return b.reviewCount - a.reviewCount;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      
      return 0;
    });

  return (
    <div style={{ padding: '40px 5%' }}>
      
      {/* NARZĘDZIA FILTROWANIA */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '25px', 
        marginBottom: '30px',
        alignItems: 'end'
      }}>
        {/* Szukaj */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px' }}>SZUKAJ</label>
          <input 
            type="text" 
            placeholder="Szukaj produktu..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              padding: '12px 15px', borderRadius: '12px', border: '1px solid var(--border)',
              background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.9rem'
            }}
          />
        </div>

        {/* Max Cena */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px' }}>MAX CENA:</label>
            <span style={{ fontWeight: '800', color: 'var(--accent)', fontSize: '0.9rem' }}>{maxPrice} PLN</span>
          </div>
          <input 
            type="range" min="0" max={maxProductPrice} value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={{ cursor: 'pointer', accentColor: 'var(--accent)', height: '20px' }}
          />
        </div>

        {/* Sortowanie z opcją Ulubionych */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px' }}>SORTUJ WEDŁUG</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{ 
              padding: '12px 15px', borderRadius: '12px', border: '1px solid var(--border)',
              background: 'var(--bg-card)', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.9rem'
            }}
          >
            <option value="default">Domyślnie</option>
            <option value="favorites">❤️ Ulubione: od zaznaczonych</option>
            <option value="price-asc">Cena: od najniższej</option>
            <option value="price-desc">Cena: od najwyższej</option>
            <option value="rating-desc">Ocena: od najwyższej</option>
            <option value="reviews-desc">Ilość opinii: najwięcej</option>
            <option value="name-asc">Nazwa: A-Z</option>
          </select>
        </div>
      </div>

      {/* KATEGORIE */}
      <div style={{ 
        display: 'flex', gap: '10px', marginBottom: '40px', overflowX: 'auto', 
        paddingBottom: '10px', scrollbarWidth: 'none'
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 22px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: '700',
              fontSize: '0.85rem',
              background: activeCategory === cat ? 'var(--accent)' : 'var(--bg-card)',
              color: activeCategory === cat ? 'white' : 'var(--text-main)',
              transition: '0.2s', whiteSpace: 'nowrap',
              boxShadow: activeCategory === cat ? '0 4px 12px var(--accent-light)' : 'none'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LISTA KART PRODUKTÓW */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '30px' 
      }}>
        {processedProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onBtnClick={onAddToCart}
            isFavorite={favorites.includes(product.id)}
            onToggleFav={onToggleFav}
            avgRating={product.avgRating}
            reviewCount={product.reviewCount}
          />
        ))}
      </div>

      {/* KOMUNIKAT PUSTEJ LISTY */}
      {processedProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px', opacity: 0.5 }}>
          <span style={{ fontSize: '3rem' }}>🔍</span>
          <h3>Brak wyników</h3>
          <p>Spróbuj zresetować filtry lub wyszukać coś innego.</p>
        </div>
      )}
    </div>
  );
}

export default Home;
