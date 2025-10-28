import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAssetUrl } from '../utils/assets';

export default function Profile() {
  const { currentUser, updateCurrentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    bio: currentUser?.bio || '',
  });
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [saved, setSaved] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const onChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onImageChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePic(file);
    const reader = new FileReader();
    reader.onload = () => setProfilePicUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const updates = { ...form };
    if (profilePicUrl) updates.profilePicUrl = profilePicUrl;
    updateCurrentUser(updates);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      logout();
      navigate('/');
      alert('Account deleted.');
    }
  };

  const handleUpgradeToSeller = () => {
    updateCurrentUser({ accountType: 'seller' });
    setShowUpgradeModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!currentUser) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <p className="text-gray-700 text-lg">Please sign in to view your profile.</p>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-12">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center sm:text-left">Profile Settings</h1>

        <div className="bg-white border border-gray-200 rounded-2xl shadow p-6 space-y-6">
          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
            <div className="flex items-center gap-4">
              <img
                src={profilePicUrl || getAssetUrl(currentUser.profilePicUrl)}
                alt={currentUser.username}
                className="h-20 w-20 rounded-full ring-2 ring-purple-600 object-cover"
              />
              <input type="file" accept="image/*" onChange={onImageChange} className="text-sm" />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username / Artist Name</label>
            <input
              name="username"
              value={form.username}
              onChange={onChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={onChange}
              rows="4"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Account Type */}
          <div>
            <p className="text-sm text-gray-600">
              Account Type: <span className="font-semibold capitalize">{currentUser.accountType}</span>
            </p>
            {currentUser.accountType === 'buyer' && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium underline"
              >
                Upgrade to Seller Account
              </button>
            )}
          </div>

          {/* Save Button */}
          <div className="flex gap-3 items-center">
            <button
              onClick={handleSave}
              className="rounded-md bg-purple-600 px-6 py-3 text-white font-semibold hover:bg-purple-700"
            >
              Save Changes
            </button>
            {saved && <p className="text-green-600 font-medium">Saved!</p>}
          </div>

          {/* Danger Zone */}
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Danger Zone</h2>
            <button
              onClick={handleDeleteAccount}
              className="rounded-md bg-red-600 px-4 py-2 text-white font-semibold hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Upgrade to Seller Account</h2>

            <div className="mb-6 space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-lg font-semibold text-gray-900">Subscription Cost: $15/month</p>
                <p className="text-sm text-gray-600 mt-1">Billed monthly, cancel anytime</p>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">Seller Account Benefits:</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>List unlimited digital artworks</li>
                <li>Set your own prices</li>
                <li>Track sales and revenue in real-time</li>
                <li>Build your artist profile</li>
                <li>Access to seller dashboard</li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">Terms and Conditions</h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto text-xs text-gray-700 space-y-2">
                <p>Subscription fees are $15 USD/month. Cancel anytime.</p>
                <p>All artwork must be original and human-created.</p>
                <p>HandSigned charges a 10% commission on sales.</p>
                <p>Subscription fees are non-refundable.</p>
                <p>Full terms are available on our website.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpgradeToSeller}
                className="flex-1 rounded-md bg-purple-600 px-4 py-3 text-white font-semibold hover:bg-purple-700"
              >
                I Agree - Upgrade to Seller ($15/month)
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 rounded-md bg-gray-200 px-4 py-3 text-gray-700 font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
