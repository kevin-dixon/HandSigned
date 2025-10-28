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

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePic(file);
    const reader = new FileReader();
    reader.onload = () => setProfilePicUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const updates = { ...form };
    if (profilePicUrl) {
      updates.profilePicUrl = profilePicUrl;
    }
    updateCurrentUser(updates);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      // In a real app, you'd call a delete function
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
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-gray-700">Please sign in to view your profile.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
          <div className="flex items-center gap-4">
            <img 
              src={profilePicUrl || getAssetUrl(currentUser.profilePicUrl)} 
              alt={currentUser.username} 
              className="h-20 w-20 rounded-full ring-2 ring-blue-600 object-cover" 
            />
            <input type="file" accept="image/*" onChange={onImageChange} className="text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Username / Artist Name</label>
          <input 
            name="username" 
            value={form.username} 
            onChange={onChange} 
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            name="email" 
            type="email" 
            value={form.email} 
            onChange={onChange} 
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea 
            name="bio" 
            value={form.bio} 
            onChange={onChange} 
            rows="4" 
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <div>
          <p className="text-sm text-gray-600">Account Type: <span className="font-semibold capitalize">{currentUser.accountType}</span></p>
          {currentUser.accountType === 'buyer' && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Upgrade to Seller Account
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleSave} 
            className="rounded-md bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700"
          >
            Save Changes
          </button>
          {saved && <p className="text-green-600 font-medium self-center">Saved!</p>}
        </div>

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

      {/* Upgrade to Seller Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Upgrade to Seller Account</h2>
            
            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-lg font-semibold text-gray-900">Subscription Cost: $15/month</p>
                <p className="text-sm text-gray-600 mt-1">Billed monthly, cancel anytime</p>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">Seller Account Benefits:</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-4">
                <li>List unlimited digital artworks</li>
                <li>Set your own prices</li>
                <li>Track sales and revenue in real-time</li>
                <li>Build your artist profile</li>
                <li>Access to seller dashboard</li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Terms and Conditions</h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto text-xs text-gray-700 space-y-2">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p>
                  <strong>Payment Terms:</strong> By upgrading to a seller account, you agree to pay $15 USD per month. 
                  Your subscription will automatically renew each month unless cancelled. You may cancel at any time through your account settings.
                </p>
                <p>
                  <strong>Seller Responsibilities:</strong> Sellers agree to only list original, human-created digital artwork. 
                  All artwork must comply with our authenticity standards and community guidelines. HandSigned reserves the right to remove listings 
                  that violate our terms of service.
                </p>
                <p>
                  <strong>Commission Structure:</strong> HandSigned charges a 10% commission on all sales. This commission is automatically deducted 
                  from your earnings. Payments are processed monthly to your registered payment method.
                </p>
                <p>
                  <strong>Refund Policy:</strong> Subscription fees are non-refundable. If you cancel your subscription, you will retain seller 
                  access until the end of your current billing period.
                </p>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, 
                  eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
                <p>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui 
                  ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpgradeToSeller}
                className="flex-1 rounded-md bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700"
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
