import React, { useContext, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
import { Link } from 'react-router-dom';
import ScoreBadge from '../components/ScoreBadge';
import WatermarkedImage from '../components/WatermarkedImage';
import * as storage from '../services/storageService';

export default function MyListings() {
  const { currentUser } = useContext(AuthContext);
  const { listings, deleteListing } = useContext(DataContext);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const myListings = useMemo(
    () => listings.filter(l => l.sellerId === currentUser?.id),
    [listings, currentUser]
  );

  const sales = useMemo(
    () => storage.getSalesForSeller(currentUser?.id),
    [currentUser]
  );

  const revenue = useMemo(
    () => storage.getRevenueForSeller(currentUser?.id),
    [currentUser]
  );

  const handleEdit = listing => {
    setEditingId(listing.id);
    setEditForm({
      title: listing.title,
      price: listing.price,
      description: listing.description,
      category: listing.category
    });
  };

  const handleSaveEdit = () => {
    storage.updateListing(editingId, editForm);
    setEditingId(null);
    window.location.reload(); // simple refresh
  };

  const handleDelete = id => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      deleteListing(id);
    }
  };

  if (!currentUser || currentUser.accountType !== 'seller') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <p className="text-gray-700 text-lg">You must be signed in as a seller to view this page.</p>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
          <Link
            to="/create"
            className="rounded-lg bg-purple-600 px-5 py-2 text-white font-semibold shadow hover:bg-purple-700 transition"
          >
            Create New Listing
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 text-center shadow">
            <p className="text-sm text-purple-700 font-medium">Total Listings</p>
            <p className="text-3xl font-bold text-purple-900">{myListings.length}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center shadow">
            <p className="text-sm text-green-700 font-medium">Total Sales</p>
            <p className="text-3xl font-bold text-green-900">{sales.length}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 text-center shadow">
            <p className="text-sm text-purple-700 font-medium">Total Revenue</p>
            <p className="text-3xl font-bold text-purple-900">${revenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Listings */}
        <div className="space-y-6">
          {myListings.length === 0 && (
            <p className="text-gray-600 text-center">You haven't created any listings yet.</p>
          )}

          {myListings.map(listing => (
            <div
              key={listing.id}
              className="bg-white border border-gray-200 rounded-2xl shadow p-4 flex flex-col sm:flex-row gap-4 hover:shadow-lg transition"
            >
              <WatermarkedImage
                src={listing.thumbnailUrl}
                alt={listing.title}
                className="w-full sm:w-40 h-32 rounded-xl"
                watermarkSize="sm"
              />

              <div className="flex-1 flex flex-col justify-between">
                {editingId === listing.id ? (
                  <div className="space-y-2">
                    <input
                      value={editForm.title}
                      onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full border rounded-md px-3 py-2"
                    />
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                      className="w-full border rounded-md px-3 py-2"
                    />
                    <textarea
                      value={editForm.description}
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full border rounded-md px-3 py-2"
                      rows="2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 bg-gray-300 rounded-lg text-sm hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{listing.description}</p>
                      </div>
                      <ScoreBadge score={listing.aiAuthenticityScore} />
                    </div>
                    <p className="mt-2 text-xl font-semibold text-purple-700">${listing.price.toFixed(2)}</p>
                    <div className="mt-3 flex gap-3">
                      <Link
                        to={`/listing/${listing.id}`}
                        className="text-purple-600 font-medium hover:underline text-sm"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleEdit(listing)}
                        className="text-gray-600 font-medium hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="text-red-600 font-medium hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
