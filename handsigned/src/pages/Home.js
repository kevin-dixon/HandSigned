import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main>
      <section className="relative isolate overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Human-made digital art, verified.</h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">HandSigned champions authentic creativity. Browse, support, and collect digital art accompanied by a transparent AI Authenticity Score.</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/marketplace" className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700">Explore Marketplace</Link>
              <Link to="/login" className="text-base font-semibold leading-6 text-gray-900">Login as Seller <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
