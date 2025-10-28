import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ListingDetail from './pages/ListingDetail';
import SellerProfile from './pages/SellerProfile';
import CreateListing from './pages/CreateListing';
import MyListings from './pages/MyListings';
import MyCollection from './pages/MyCollection';
import Profile from './pages/Profile';
import Login from './pages/Login';
import NotFound404 from './pages/NotFound404';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import './App.css';

function ProtectedRoute({ children }) {
  return (
    <AuthContext.Consumer>
      {({ currentUser }) => currentUser?.accountType === 'seller' ? children : <Navigate to="/login" replace />}
    </AuthContext.Consumer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-white">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/seller/:id" element={<SellerProfile />} />
            <Route path="/create" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
            <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
            <Route path="/my-collection" element={<MyCollection />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound404 />} />
          </Routes>
        </div>
      </DataProvider>
    </AuthProvider>
  );
}
