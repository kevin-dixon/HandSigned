import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import './Navigation.css';
import './Button.css'; // Imported here for use in the Home component

// --- About Component ---
const About = () => {
  return (
    <div className="Page-content">
      <h2>About This Site</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
        nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
        eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
        in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </div>
  );
};

// --- Cards Component ---
const Cards = () => {
  return (
    <div className="Page-content">
      <h2>Card Collection</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus at neque
        velit. Sed pretium enim in ante vulputate, sed scelerisque turpis feugiat.
        Cras ac diam non justo auctor posuere. Suspendisse potenti. Nam eu mi at
        justo venenatis fermentum a sit amet magna. Curabitur vel leo id urna
        condimentum luctus.
      </p>
    </div>
  );
};

// --- Home Component ---
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="Page-content">
      <h2>Welcome Home</h2>
      <p>
        This is the main page content. Click the button below to view the collection.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
        incididunt ut labore et dolore magna aliqua.
      </p>
      
      {/* Button going to the Cards page */}
      <button 
        onClick={() => navigate('/cards')}
        className="Primary-button"
      >
        Go to Cards
      </button>
    </div>
  );
};


// --- Title Bar Component ---
const TitleBar = () => {
  return (
    <header className="App-header">
      <div className="App-title-group">
        {/* Placeholder for Logo (using a simple emoji for visual effect) */}
        <div className="App-logo-spot">
          <span role="img" aria-label="card logo" style={{fontSize: '24px'}}>🃏</span>
        </div>
        <h1>Kevin's Cards Site</h1>
      </div>
      <nav>
        <Link to="/" className="Nav-link">Home</Link>
        <Link to="/cards" className="Nav-link">Cards</Link>
        <Link to="/about" className="Nav-link">About</Link>
      </nav>
    </header>
  );
};


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
        <button className="btn" onClick={() => onOpen(index)} aria-haspopup="dialog">Open</button>
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

  // IMPORTANT: basename is critical for GitHub Pages subdirectory hosting.
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <TitleBar />
      <main className="App-main"> 
        {/* Defines the routes for each path */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/about" element={<About />} />
        </Routes>

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
      </main>
    </Router>
  );
}

export default App;
