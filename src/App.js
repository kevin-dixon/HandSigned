import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import { ReactComponent as DetailsIcon } from './images/details.svg';
import { ReactComponent as SpeechIcon } from './images/speech-bubble.svg';
import rawData from './data/cards.json';

// Normalize imported data into the shape we use: { title, preview, content, author, date, quote }
function normalizeData(arr) {
  const items = (arr || []).map((it, i) => {
    const quote = it.quote || it.content || '';
    const author = it.author || it.title || 'Unknown';
    const date = it.date || null;
    const title = `${author}`; // use author as the title in the grid
    const preview = quote.length > 80 ? quote.slice(0, 77) + '...' : quote;
    const content = quote;
    return { id: i, title, preview, content, author, date, quote };
  });
  // allow up to 100 items; if fewer than requested, repeat last item until at least the same length as arr
  // but cap to 100
  while (items.length < Math.min(100, Math.max(15, items.length))) items.push({ ...items[items.length - 1], id: items.length });
  return items.slice(0, 100);
}

const PAGE_SIZE = 20;

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
  useEffect(() => {
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
  const [page, setPage] = useState(1);

  const baseData = useMemo(() => normalizeData(rawData || []), []); // up to 100 items

  useEffect(() => {
    setPage(1); // reset to first page when tab changes
  }, [tab]);

  // sorting
  const sorted = useMemo(() => {
    const copy = [...baseData];
    if (tab === 'Author') {
      copy.sort((a, b) => (a.author || '').localeCompare(b.author || ''));
    } else if (tab === 'Date') {
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

  const totalItems = sorted.length;
  const totalPages = Math.max(1, Math.ceil(Math.min(totalItems, 100) / PAGE_SIZE));

  const startIndex = (page - 1) * PAGE_SIZE;
  const pageItems = sorted.slice(startIndex, startIndex + PAGE_SIZE);

  const openModal = (localIndex) => setActive(localIndex);
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
          {pageItems.map((item, i) => (
            <Card key={item.id} item={item} index={i} onOpen={() => openModal(i)} />
          ))}
        </section>

        <div className="pagination">
          <button className="page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} aria-label="Previous page">←</button>
          <div className="page-indicator">Showing {startIndex + 1} - {Math.min(startIndex + PAGE_SIZE, totalItems)} of {Math.min(totalItems, 100)}</div>
          <button className="page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} aria-label="Next page">→</button>
        </div>
      </main>

      <footer className="footer">
        <small>Kevin Dixon - CS 356 - 2025</small>
      </footer>

      {active !== null && <Modal item={pageItems[active]} onClose={closeModal} />}
    </div>
  );
}
