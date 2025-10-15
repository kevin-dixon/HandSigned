import React, { useState, useEffect } from 'react';
import './App.css';
import { ReactComponent as DetailsIcon } from './images/details.svg';

// --- Card Component ---
function Card({ index, onOpen }) {
  return (
    <article className="card" role="listitem" aria-label={`Card ${index + 1}`}>
      <div className="card-top">
        <div className="badge" aria-hidden>{index + 1}</div>
        <div className="card-title">Card {index + 1}</div>
      </div>
      <p className="card-body">This is a simple, minimal card. Use it to display a short description or link.</p>
      <div className="card-footer">
        <button className="icon-btn" onClick={() => onOpen(index)} aria-haspopup="dialog" aria-label={`Open card ${index + 1}`}>
          <DetailsIcon />
        </button>
      </div>
    </article>
  );
}

// --- Modal Component ---
function Modal({ cardIndex, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    // lock scroll
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={`Card ${cardIndex + 1} details`} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className="modal-body">
          <div className="modal-header">
            <div className="modal-badge">{cardIndex + 1}</div>
            <h2 className="modal-title">Card {cardIndex + 1}</h2>
          </div>
          <p className="modal-text">This is an expanded view of the card. Put more details here — a description, links, or other content. The background is blurred and darkened while this dialog is open.</p>
          <div className="modal-actions">
            <button className="btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main App Component ---
function App() {
  const cards = Array.from({ length: 15 }); // 3 per row x 5 rows
  const [active, setActive] = useState(null);

  const openModal = (i) => setActive(i);
  const closeModal = () => setActive(null);

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <h1 className="title">Kevin React Cards</h1>
        </div>
      </header>

      <main className="container" aria-hidden={active !== null}>
        <section className="grid" role="list">
          {cards.map((_, i) => (
            <Card key={i} index={i} onOpen={openModal} />
          ))}
        </section>
      </main>

      <footer className="footer">
        <small>Minimal card grid • Blue theme</small>
      </footer>

      {active !== null && <Modal cardIndex={active} onClose={closeModal} />}
    </div>
  );
}

export default App;
