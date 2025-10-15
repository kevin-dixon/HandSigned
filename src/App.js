import React from 'react';
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


// --- Main App Component ---
function App() {
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
      </main>
    </Router>
  );
}

export default App;
