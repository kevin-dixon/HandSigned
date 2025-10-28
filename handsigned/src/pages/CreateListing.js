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
    if (isScoreApiConfigured()) {
      try {
        setLoading(true);
        const newScore = await getAuthenticityScore({
          title: form.title,
          description: form.description,
          imageUrl: imageDataUrl || '/assets/images/art_101.svg',
        });
        setScore(newScore);
      } catch {
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
    addListing({
      title: form.title,
      description: form.description,
      price: Number(form.price) || 0,
      sellerId: currentUser?.id,
      imageUrl: imageDataUrl || `${process.env.PUBLIC_URL}/assets/images/art_101.svg`,
      thumbnailUrl: imageDataUrl || `${process.env.PUBLIC_URL}/assets/images/art_101_thumb.svg`,
      aiAuthenticityScore: score,
      category: form.category,
    });
    navigate('/marketplace');
  };

  return (
    <main className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">Create Listing</h1>

        <form className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-200 animate-fadeIn">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Artwork Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {imageFile && <p className="mt-1 text-sm text-gray-600">Selected: {imageFile.name}</p>}
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (USD)</label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={onChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={onChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option>Abstract</option>
                <option>Landscape</option>
                <option>Line Art</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={onChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* AI Authenticity Analysis */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              disabled={loading}
              onClick={runAnalysis}
              className="rounded-lg bg-purple-600 px-5 py-2 text-white font-semibold hover:bg-purple-700 disabled:opacity-60 transition"
            >
              {loading ? 'Analyzing…' : 'Run AI Authenticity Analysis'}
            </button>
            <ScoreBadge score={score} />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Submit */}
          <div className="pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full rounded-lg bg-gray-900 px-6 py-3 text-white font-semibold hover:bg-gray-800 transition"
            >
              Submit Listing
            </button>
          </div>
        </form>

        {/* Live Preview */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Live Preview</h2>
          <div className="max-w-lg mx-auto">
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white">
              <img src={preview.thumbnailUrl} alt={preview.title} className="w-full h-auto object-cover" />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{preview.title}</h3>
                  <ScoreBadge score={preview.aiAuthenticityScore} />
                </div>
                <p className="mt-2 text-purple-700 font-semibold text-lg">${preview.price.toFixed(2)}</p>
                <p className="mt-1 text-gray-600 text-sm">{preview.description}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
