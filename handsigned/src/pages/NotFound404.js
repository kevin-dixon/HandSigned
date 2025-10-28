import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound404() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 text-center">
      <h1 className="text-5xl font-bold text-gray-900">404</h1>
      <p className="mt-4 text-gray-600">We couldn't find that page.</p>
      <Link to="/" className="mt-8 inline-flex items-center rounded-md bg-purple-600 px-6 py-3 text-white font-semibold hover:bg-purple-700">Go Home</Link>
    </main>
  );
}
