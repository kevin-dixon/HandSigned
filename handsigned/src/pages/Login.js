import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/storageService';

export default function Login() {
  const { login } = useContext(AuthContext);
  const { users, refreshData } = useContext(DataContext);
  const navigate = useNavigate();
  
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [form, setForm] = useState({ username: '', email: '', password: '', accountType: 'buyer' });
  const [error, setError] = useState('');

  const onChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Find user by username and password (mock validation)
    const user = users.find(u => 
      u.username.toLowerCase() === form.username.toLowerCase() && 
      u.password === form.password
    );
    
    if (user) {
      login(user.id);
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Validate fields
    if (!form.username || !form.email || !form.password) {
      setError('All fields are required');
      return;
    }
    
    // Check if username already exists
    if (users.some(u => u.username.toLowerCase() === form.username.toLowerCase())) {
      setError('Username already taken');
      return;
    }
    
    // Create new user
    const newUser = createUser({
      username: form.username,
      email: form.email,
      password: form.password,
      accountType: form.accountType,
      bio: '',
      profilePicUrl: '/assets/images/profile_default.svg'
    });
    
    refreshData();
    login(newUser.id);
    navigate('/');
  };

  return (
    <main className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {mode === 'login' ? 'Sign in to HandSigned' : 'Create your account'}
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          {mode === 'login' ? 'Enter your credentials to continue' : 'Join the HandSigned marketplace'}
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={onChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              required
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <select
                name="accountType"
                value={form.accountType}
                onChange={onChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
              setForm({ username: '', email: '', password: '', accountType: 'buyer' });
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

        {mode === 'login' && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Demo accounts (username / password):</p>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• <span className="font-medium">PixelCraft</span> / demo123 (Seller)</div>
              <div>• <span className="font-medium">ArtfulAlice</span> / demo123 (Seller)</div>
              <div>• <span className="font-medium">CollectorBob</span> / demo123 (Buyer)</div>
              <div>• <span className="font-medium">ArtLover99</span> / demo123 (Buyer)</div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
