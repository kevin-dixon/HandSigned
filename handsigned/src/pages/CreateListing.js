import React, { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
import ScoreBadge from '../components/ScoreBadge';
import { getAuthenticityScore, isScoreApiConfigured, getScoreApiInfo } from '../services/scoreClient';

function deterministicScore(seedStr) {
  // Stable 50-100 score based on a simple hash of the image signature
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  const rng = (h >>> 0) / 0xffffffff;
  return Math.round(50 + rng * 50);
}

export default function CreateListing() {
  const { currentUser } = useContext(AuthContext);
  const { addListing } = useContext(DataContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', price: '', category: 'Abstract', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [score, setScore] = useState(null); // Start with no score until analysis
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiInfo, setApiInfo] = useState(null);
  const [analysisMeta, setAnalysisMeta] = useState(null);
  const [analyzedImageSig, setAnalyzedImageSig] = useState(null);

  React.useEffect(() => {
    (async () => {
      const info = await getScoreApiInfo();
      setApiInfo(info);
    })();
  }, []);

  const defaultImg = `${process.env.PUBLIC_URL}/assets/images/art_101.svg`;
  const defaultThumb = `${process.env.PUBLIC_URL}/assets/images/art_101_thumb.svg`;
  const currentImageSig = imageDataUrl || defaultImg;

  const preview = useMemo(() => ({
    id: 'preview',
    title: form.title || 'Untitled Artwork',
    description: form.description || 'Your description will appear here.',
    price: Number(form.price) || 0,
    sellerId: currentUser?.id,
    imageUrl: imageDataUrl || defaultImg,
    thumbnailUrl: imageDataUrl || defaultThumb,
    aiAuthenticityScore: score,
    category: form.category,
  }), [form, currentUser, score, imageDataUrl, defaultImg, defaultThumb]);

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(reader.result);
      // Reset analysis when a new image is uploaded
      setScore(null);
      setAnalysisMeta(null);
      setAnalyzedImageSig(null);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async () => {
    setError('');
    // Prefer real API if configured; otherwise simulate with a delay
    if (isScoreApiConfigured()) {
      try {
        setLoading(true);
        const result = await getAuthenticityScore({
          title: form.title,
          description: form.description,
          imageUrl: currentImageSig,
        });
        setScore(result.score);
        setAnalysisMeta({ provider: result.provider, model: result.model, usedImage: result.usedImage });
        setAnalyzedImageSig(currentImageSig);
      } catch (e) {
        setError('Could not fetch authenticity score. Using a local estimate.');
        // Simulate timing even on error to preserve UX
        const delay = 7000 + Math.floor(Math.random() * 3000);
        await new Promise(r => setTimeout(r, delay));
        const s = deterministicScore(currentImageSig);
        setScore(s);
        setAnalysisMeta(null);
        setAnalyzedImageSig(currentImageSig);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      const delay = 7000 + Math.floor(Math.random() * 3000);
      await new Promise(r => setTimeout(r, delay));
      const s = deterministicScore(currentImageSig);
      setScore(s);
      setAnalysisMeta(null);
      setAnalyzedImageSig(currentImageSig);
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      setError('Please enter a title.');
      return;
    }
    if (score === null) {
      setError('Please analyze the image before submitting.');
      return;
    }
    const newListing = {
      title: form.title,
      description: form.description,
      price: Number(form.price) || 0,
      sellerId: currentUser?.id,
      imageUrl: imageDataUrl || defaultImg,
      thumbnailUrl: imageDataUrl || defaultThumb,
      aiAuthenticityScore: score,
      category: form.category,
    };
    addListing(newListing);
    navigate('/marketplace');
  };

  const handleCancel = () => {
    navigate('/marketplace');
  };

  const analyzeDisabled = loading || (analyzedImageSig === currentImageSig && score !== null);
  const canSubmit = score !== null && !loading;

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
              disabled={analyzeDisabled}
              onClick={runAnalysis}
              className="rounded-lg bg-purple-600 px-5 py-2 text-white font-semibold hover:bg-purple-700 disabled:opacity-60 transition"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                  Analyzing…
                </span>
              ) : (
                'Run AI Authenticity Analysis'
              )}
            </button>
            {score !== null ? (
              <ScoreBadge score={score} />
            ) : (
              <span className="text-sm italic text-gray-500">Analyze image</span>
            )}
            {analysisMeta && (
              <span className="text-xs text-gray-600">via {analysisMeta.provider} ({analysisMeta.model}) {analysisMeta.usedImage ? '• image used' : '• text-only'}</span>
            )}
            {!analysisMeta && apiInfo?.available && (
              <span className="text-xs text-gray-500">API: {apiInfo.provider} ready</span>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Submit & Cancel */}
          <div className="pt-4 flex justify-between">
            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleSubmit}
              className={`rounded-lg px-6 py-3 font-semibold text-white transition ${canSubmit ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Submit Listing
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg bg-gray-200 px-6 py-3 text-gray-800 font-semibold hover:bg-gray-300 transition"
            >
              Cancel
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
                  {preview.aiAuthenticityScore !== null ? (
                    <ScoreBadge score={preview.aiAuthenticityScore} />
                  ) : (
                    <span className="text-xs italic text-gray-400">Analyze image</span>
                  )}
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
