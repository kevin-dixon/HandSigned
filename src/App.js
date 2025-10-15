import React, { useState, useMemo } from 'react';
import './App.css';
import { ReactComponent as DetailsIcon } from './images/details.svg';
import { ReactComponent as SpeechIcon } from './images/speech-bubble.svg';
import rawData from './data/cards.json';

// Normalize imported data into the shape we use: { title, preview, content, author, date, quote }
function normalizeData(arr) {
  const items = arr.map((it, i) => {
    const quote = it.quote || it.content || '';
    const author = it.author || it.title || 'Unknown';
    const date = it.date || null;
    const title = `${author}`; // use author as the title in the grid
    const preview = quote.length > 80 ? quote.slice(0, 77) + '...' : quote;
    const content = quote;
    return { id: i, title, preview, content, author, date, quote };
  });
  // ensure at least 15 items
  while (items.length < 15) items.push({ ...items[items.length - 1], id: items.length });
  return items.slice(0, 15);
}

// --- Card Component ---
function Card({ item, index, onOpen }) {
  return (
    <article className="card" role="listitem" aria-label={item.title}>
      <div className="card-top">
        <div className="badge" aria-hidden>
          <SpeechIcon />
        </div>
        <div className="card-title">{item.title}</div>
      </div>
      <p className="card-body">{item.preview}</p>
      <div className="card-footer">
        <button className="icon-btn" onClick={() => onOpen(index)} aria-haspopup="dialog" aria-label={`Open ${item.title}`}>
          <DetailsIcon />
        </button>
      </div>
    </article>
  );
}

// --- Modal Component ---
function Modal({ item, onClose }) {
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={`${item.title} details`} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className="modal-body">
          <div className="modal-header">
            <div className="modal-badge"><SpeechIcon /></div>
            <h2 className="modal-title">{item.author}</h2>
            <div className="modal-date">{item.date}</div>
          </div>
          <p className="modal-text">{item.content}</p>
          <div className="modal-actions">
            <button className="btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main App Component ---
export default function App() {
  const [active, setActive] = useState(null);
  const [tab, setTab] = useState('Author'); // Author, Date, Quote

  const baseData = useMemo(() => normalizeData(rawData || []), []);

  // sorting
  const sorted = useMemo(() => {
    const copy = [...baseData];
    if (tab === 'Author') {
      copy.sort((a, b) => (a.author || '').localeCompare(b.author || ''));
    } else if (tab === 'Date') {
      // recent to oldest; if no date, push to end
      copy.sort((a, b) => {
        const da = a.date ? new Date(a.date).getTime() : -8640000000000000; // far past
        const db = b.date ? new Date(b.date).getTime() : -8640000000000000;
        return db - da;
      });
    } else if (tab === 'Quote') {
      copy.sort((a, b) => {
        const wa = (a.quote || '').split(/\s+/)[0] || '';
        const wb = (b.quote || '').split(/\s+/)[0] || '';
        return wa.localeCompare(wb);
      });
    }
    return copy;
  }, [baseData, tab]);

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
        <div className="tabs">
          {['Author', 'Date', 'Quote'].map((t) => (
            <button key={t} className={`tab ${t === tab ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        <section className="grid" role="list">
          {sorted.map((item, i) => (
            <Card key={item.id} item={item} index={i} onOpen={() => openModal(i)} />
          ))}
        </section>
      </main>

      <footer className="footer">
        <small>Minimal card grid • Blue theme</small>
      </footer>

      {active !== null && <Modal item={sorted[active]} onClose={closeModal} />}
    </div>
  );
}
