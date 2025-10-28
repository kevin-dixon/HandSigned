import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
  const { currentUser, logout } = useContext(AuthContext);

  return (
<header className="sticky top-0 z-40 bg-purple-200 border-b border-purple-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={process.env.PUBLIC_URL + '/assets/images/logo-icon.svg'}
              alt="HandSigned Logo"
              className="h-12 w-auto max-w-full object-contain"
            />
            <span className="text-xl font-bold text-gray-900">HandSigned</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/marketplace" className="text-gray-700 hover:text-purple-700 hover:bg-white px-3 py-1.5 rounded-md transition">Marketplace</Link>
            {currentUser?.accountType === 'seller' && (
              <>
                <Link to="/create" className="text-gray-700 hover:text-purple-700 hover:bg-white px-3 py-1.5 rounded-md transition">Create Listing</Link>
                <Link to="/my-listings" className="text-gray-700 hover:text-purple-700 hover:bg-white px-3 py-1.5 rounded-md transition">My Listings</Link>
              </>
            )}
            {currentUser && (
              <>
                <Link to="/my-collection" className="text-gray-700 hover:text-purple-700 hover:bg-white px-3 py-1.5 rounded-md transition">My Collection</Link>
                <Link to="/profile" className="text-gray-700 hover:text-purple-700 hover:bg-white px-3 py-1.5 rounded-md transition">Profile</Link>
              </>
            )}
            {!currentUser && (
              <Link to="/login" className="text-gray-700 hover:text-purple-700 hover:bg-white px-3 py-1.5 rounded-md transition">Login</Link>
            )}
            {currentUser && (
              <button onClick={logout} className="ml-2 inline-flex items-center rounded-md bg-purple-600 px-3 py-1.5 text-white hover:bg-purple-700">Logout</button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
