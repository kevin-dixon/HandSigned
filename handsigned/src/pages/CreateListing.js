import React, { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
import ScoreBadge from '../components/ScoreBadge';
import { getAuthenticityScore, isScoreApiConfigured } from '../services/scoreClient';

function randomScore() {
  return Math.floor(Math.random() * 51) + 50; // 50-100
}

export default function CreateListing() {
  const { currentUser } = useContext(AuthContext);
  const { addListing } = useContext(DataContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', price: '', category: 'Abstract', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [score, setScore] = useState(randomScore());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const preview = useMemo(() => ({
    id: 'preview',
    title: form.title || 'Untitled Artwork',
    description: form.description || 'Your description will appear here.',
    price: Number(form.price) || 0,
    sellerId: currentUser?.id,
    imageUrl: imageDataUrl || `${process.env.PUBLIC_URL}/assets/images/art_101.svg`,
    thumbnailUrl: imageDataUrl || `${process.env.PUBLIC_URL}/assets/images/art_101_thumb.svg`,
    aiAuthenticityScore: score,
    category: form.category,
  }), [form, currentUser, score, imageDataUrl]);

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const runAnalysis = async () => {
    setError('');
    // Prefer real API if configured; otherwise use random fallback
    if (isScoreApiConfigured()) {
      try {
        setLoading(true);
        const newScore = await getAuthenticityScore({
          title: form.title,
          description: form.description,
          imageUrl: imageDataUrl || '/assets/images/art_101.svg',
        });
        setScore(newScore);
      } catch (e) {
        setError('Could not fetch authenticity score. Using a local estimate.');
        setScore(randomScore());
      } finally {
        setLoading(false);
      }
    } else {
      setScore(randomScore());
    }
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      setError('Please enter a title.');
      return;
    }
    const newListing = {
      title: form.title,
      description: form.description,
      price: Number(form.price) || 0,
      sellerId: currentUser?.id,
      imageUrl: imageDataUrl || `${process.env.PUBLIC_URL}/assets/images/art_101.svg`,
      thumbnailUrl: imageDataUrl || `${process.env.PUBLIC_URL}/assets/images/art_101_thumb.svg`,
      aiAuthenticityScore: score,
      category: form.category,
    };
    addListing(newListing);
    navigate('/marketplace');
  };

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Listing</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input name="title" value={form.title} onChange={onChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Artwork Image</label>
          <input type="file" accept="image/*" onChange={onImageChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {imageFile && <p className="mt-1 text-sm text-gray-600">Selected: {imageFile.name}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price (USD)</label>
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={onChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select name="category" value={form.category} onChange={onChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Abstract</option>
              <option>Landscape</option>
              <option>Line Art</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" rows="4" value={form.description} onChange={onChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex items-center gap-3">
          <button type="button" disabled={loading} onClick={runAnalysis} className="rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 disabled:opacity-60">
            {loading ? 'Analyzing…' : 'Run AI Authenticity Analysis'}
          </button>
          <ScoreBadge score={score} />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="pt-4">
          <button type="button" onClick={handleSubmit} className="rounded-md bg-gray-900 px-6 py-3 text-white font-semibold hover:bg-gray-800">Submit</button>
        </div>
      </form>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Live Preview</h2>
        <div className="max-w-lg">
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <img src={preview.thumbnailUrl} alt={preview.title} className="w-full h-auto" />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{preview.title}</h3>
                <ScoreBadge score={preview.aiAuthenticityScore} />
              </div>
              <p className="mt-2 text-gray-600">${preview.price.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
