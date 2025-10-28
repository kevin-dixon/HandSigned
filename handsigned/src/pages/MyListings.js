import React, { useContext, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
import { Link, useNavigate } from 'react-router-dom';
import ScoreBadge from '../components/ScoreBadge';
import { getAssetUrl } from '../utils/assets';
import * as storage from '../services/storageService';

export default function MyListings() {
  const { currentUser } = useContext(AuthContext);
  const { listings, deleteListing } = useContext(DataContext);
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const myListings = useMemo(() => 
    listings.filter(l => l.sellerId === currentUser?.id),
    [listings, currentUser]
  );

  const sales = useMemo(() => 
    storage.getSalesForSeller(currentUser?.id),
    [currentUser, listings] // eslint-disable-line
  );

  const revenue = useMemo(() => 
    storage.getRevenueForSeller(currentUser?.id),
    [currentUser, listings] // eslint-disable-line
  );

  const handleEdit = (listing) => {
    setEditingId(listing.id);
    setEditForm({ title: listing.title, price: listing.price, description: listing.description, category: listing.category });
  };

  const handleSaveEdit = () => {
    storage.updateListing(editingId, editForm);
    setEditingId(null);
    window.location.reload(); // Simple refresh to update UI
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      deleteListing(id);
    }
  };

  if (!currentUser || currentUser.accountType !== 'seller') {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-gray-700">You must be signed in as a seller to view this page.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
        <Link to="/create" className="rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700">Create New Listing</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700 font-medium">Total Listings</p>
          <p className="text-3xl font-bold text-blue-900">{myListings.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700 font-medium">Total Sales</p>
          <p className="text-3xl font-bold text-green-900">{sales.length}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-700 font-medium">Total Revenue</p>
          <p className="text-3xl font-bold text-purple-900">${revenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-4">
        {myListings.length === 0 && (
          <p className="text-gray-600">You haven't created any listings yet.</p>
        )}
        {myListings.map(listing => (
          <div key={listing.id} className="border border-gray-200 rounded-lg p-4 flex gap-4">
            <img src={getAssetUrl(listing.thumbnailUrl)} alt={listing.title} className="w-32 h-24 object-cover rounded" />
            <div className="flex-1">
              {editingId === listing.id ? (
                <div className="space-y-2">
                  <input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="w-full border rounded px-2 py-1" />
                  <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="w-full border rounded px-2 py-1" />
                  <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full border rounded px-2 py-1" rows="2" />
                  <div className="flex gap-2">
                    <button onClick={handleSaveEdit} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Save</button>
                    <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-300 rounded text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                      <p className="text-sm text-gray-600">{listing.description}</p>
                    </div>
                    <ScoreBadge score={listing.aiAuthenticityScore} />
                  </div>
                  <p className="mt-2 text-lg font-semibold text-blue-700">${listing.price.toFixed(2)}</p>
                  <div className="mt-3 flex gap-2">
                    <Link to={`/listing/${listing.id}`} className="text-sm text-blue-600 hover:underline">View</Link>
                    <button onClick={() => handleEdit(listing)} className="text-sm text-gray-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(listing.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
