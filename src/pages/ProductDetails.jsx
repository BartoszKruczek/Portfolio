import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PRODUCTS } from '../products';
import { toast } from 'react-hot-toast';

// FIREBASE
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";

function ProductDetails({ onAddToCart, favorites, onToggleFav }) {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === parseInt(id));
  
  const [mainImg, setMainImg] = useState('');
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ user: '', text: '', rating: 5 });
  const [hoverRating, setHoverRating] = useState(0);

  // 1. OBLICZANIE ŚREDNIEJ OCEN (Zaokrąglone w górę)
  const averageRating = reviews.length > 0 
    ? Math.ceil(reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length) 
    : 0;

  // 2. FUNKCJA ODMIANY SŁOWA "OPINIA"
  const getReviewsLabel = (count) => {
    if (count === 1) return 'opinia';
    if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'opinie';
    return 'opinii';
  };

  useEffect(() => {
    if (product) {
      setMainImg(product.image);
      const q = query(
        collection(db, "reviews"), 
        where("productId", "==", product.id), 
        orderBy("createdAt", "desc")
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
    window.scrollTo(0, 0);
  }, [product]);

  // OBSŁUGA LUPY
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  // DODAWANIE OPINII
  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "reviews"), {
        productId: product.id,
        user: newReview.user,
        text: newReview.text,
        rating: newReview.rating,
        createdAt: new Date()
      });
      setNewReview({ user: '', text: '', rating: 5 });
      toast.success("Dodano opinię!");
    } catch (error) {
      console.error(error);
      toast.error("Błąd zapisu.");
    }
  };

  const StarRatingInput = () => (
    <div style={{ display: 'flex', gap: '8px', fontSize: '2rem', cursor: 'pointer', margin: '15px 0' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ 
            color: (hoverRating || newReview.rating) >= star ? '#ffc107' : 'var(--border)',
            transition: 'color 0.2s'
          }}
          onClick={() => setNewReview({ ...newReview, rating: star })}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
        >
          ★
        </span>
      ))}
    </div>
  );

  if (!product) return <div style={{ padding: '100px', textAlign: 'center' }}>Produkt nie znaleziony</div>;

  return (
    <div style={{ padding: '40px 5%', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '50px', marginBottom: '80px' }}>
        
        {/* GALERIA Z LUPĄ */}
        <div>
          <div 
            style={{ 
              position: 'relative', 
              overflow: 'hidden', 
              borderRadius: '20px',
              cursor: 'zoom-in',
              aspectRatio: '1/1',
              backgroundColor: '#f9f9f9',
              border: '1px solid var(--border)'
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoomPos({ ...zoomPos, show: false })}
          >
            <img 
              src={mainImg} 
              alt={product.name} 
              style={{ 
                width: '100%', height: '100%', objectFit: 'cover',
                opacity: zoomPos.show ? 0 : 1,
                transition: 'opacity 0.2s'
              }} 
            />

            {zoomPos.show && (
              <div style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: `url(${mainImg})`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: '250%',
                pointerEvents: 'none'
              }} />
            )}

            <button onClick={() => onToggleFav(product.id)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--bg-card)', border: 'none', padding: '12px', borderRadius: '50%', cursor: 'pointer', zIndex: 10 }}>
              {favorites.includes(product.id) ? '❤️' : '🤍'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px', overflowX: 'auto' }}>
            {product.images?.map((img, i) => (
              <img 
                key={i} src={img} onClick={() => setMainImg(img)} 
                style={{ 
                  width: '70px', height: '70px', borderRadius: '10px', cursor: 'pointer', 
                  border: mainImg === img ? '2px solid var(--accent)' : '2px solid transparent',
                  objectFit: 'cover'
                }} 
              />
            ))}
          </div>
        </div>

        {/* INFO O PRODUKCIE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>{product.name}</h1>
          
          {/* ŚREDNIA OCEN I GWIAZDKI */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ color: '#ffc107', fontSize: '1.2rem' }}>
              {'★'.repeat(averageRating)}
              <span style={{ color: 'var(--border)' }}>{'★'.repeat(5 - averageRating)}</span>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              ({reviews.length} {getReviewsLabel(reviews.length)})
            </span>
          </div>

          <p style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--accent)' }}>{product.price.toFixed(2)} PLN</p>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1.1rem' }}>{product.description}</p>
          
          <button className="add-btn" onClick={() => onAddToCart(product)} style={{ padding: '18px', fontSize: '1.1rem', marginTop: '10px' }}>
            Dodaj do koszyka
          </button>
        </div>
      </div>

      {/* SEKCJA OPINII */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '60px' }}>
        <h2 style={{ marginBottom: '40px', fontSize: '2rem', fontWeight: '800' }}>Opinie klientów ({reviews.length})</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px', alignItems: 'start' }}>
          
          <form onSubmit={handleAddReview} className="login-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '30px' }}>
            <h3 style={{ fontWeight: '700' }}>Dodaj opinię</h3>
            <StarRatingInput />
            <input placeholder="Twoje imię" required value={newReview.user} onChange={e => setNewReview({...newReview, user: e.target.value})} style={{ width: '100%' }} />
            <textarea placeholder="Twoja recenzja..." required style={{ padding: '15px', borderRadius: '12px', minHeight: '120px', background: 'var(--bg-input)', color: 'var(--text-main)', border: '1px solid var(--border)', fontFamily: 'inherit', width: '100%', resize: 'vertical' }} value={newReview.text} onChange={e => setNewReview({...newReview, text: e.target.value})} />
            <button type="submit" className="add-btn" style={{ width: '100%' }}>Dodaj opinię</button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {reviews.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px', background: 'var(--bg-card)', borderRadius: '15px', border: '1px solid var(--border)' }}>Brak opinii. Bądź pierwszy!</p>
            ) : (
              reviews.map(r => (
                <div key={r.id} style={{ padding: '25px', background: 'var(--bg-card)', borderRadius: '15px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <strong style={{ fontSize: '1.1rem' }}>{r.user}</strong>
                    <span style={{ color: '#ffc107', letterSpacing: '2px' }}>
                      {'★'.repeat(r.rating)}
                      <span style={{ color: 'var(--border)' }}>{'★'.repeat(5 - r.rating)}</span>
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>{r.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
