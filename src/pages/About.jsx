import React from 'react';

function About() {
  return (
    <div className="about-page" style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <section style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '20px', fontWeight: '800' }}>
          Nasza Historia
        </h1>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
          TECH-SHOP powstał z pasji do nowoczesnych rozwiązań. W 2026 roku postawiliśmy sobie cel: 
          dostarczać najlepszą elektronikę w cenach, które nie zwalają z nóg.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '40px', color: 'var(--text-main)' }}>
          Często zadawane pytania (FAQ)
        </h2>
        
        <div className="faq-grid" style={{ display: 'grid', gap: '20px' }}>
          <div className="faq-card">
            <h3>📦 Ile trwa dostawa?</h3>
            <p>Wszystkie zamówienia wysyłamy w ciągu 24h. Standardowy czas doręczenia to 1-2 dni robocze.</p>
          </div>

          <div className="faq-card">
            <h3>💳 Jakie metody płatności akceptujecie?</h3>
            <p>BLIK, karta płatnicza, przelew natychmiastowy oraz płatność przy odbiorze.</p>
          </div>

          <div className="faq-card">
            <h3>🔄 Jak dokonać zwrotu?</h3>
            <p>Masz 30 dni na darmowy zwrot. Napisz do nas, a wyślemy Ci darmową etykietę do paczkomatu.</p>
          </div>

          <div className="faq-card">
            <h3>🛠️ Czy produkty mają gwarancję?</h3>
            <p>Tak, każdy produkt w naszym sklepie posiada 24-miesięczną gwarancję producenta.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
