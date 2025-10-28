import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 flex flex-col-reverse lg:flex-row items-center gap-12">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left animate-fadeIn">
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900">
              Human-made digital art, <span className="text-purple-600">verified.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              HandSigned champions authentic creativity. Browse, support, and collect 
              digital art accompanied by a transparent AI Authenticity Score — because 
              human artistry deserves to stand out.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
              <Link
                to="/marketplace"
                className="rounded-lg bg-purple-600 px-8 py-3 text-base font-semibold text-white shadow-md hover:bg-purple-700 hover:shadow-lg transition-all"
              >
                Explore Marketplace
              </Link>
              <Link
                to="/login"
                className="text-base font-semibold leading-6 text-gray-900 hover:text-purple-700 transition"
              >
                Login as Seller →
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <img
              src={process.env.PUBLIC_URL + '/logo.png'}
              alt="Digital art showcase"
              className="w-[28rem] max-w-full rounded-2xl shadow-xl ring-1 ring-gray-200 object-cover"
            />
          </div>
        </div>

        {/* Decorative gradient blob */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 blur-3xl opacity-40 -z-10">
          <div className="w-[40rem] h-[40rem] bg-gradient-to-tr from-purple-200 via-pink-200 to-indigo-200 rounded-full"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            Why choose HandSigned?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="rounded-xl bg-gray-50 p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-purple-700 mb-2">
                Verified Authenticity
              </h3>
              <p className="text-gray-600">
                Every artwork includes an AI-backed authenticity score that ensures transparency and trust.
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-purple-700 mb-2">
                Empower Human Artists
              </h3>
              <p className="text-gray-600">
                Support real creators who bring emotion, imperfection, and originality to digital spaces.
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-purple-700 mb-2">
                Transparent Marketplace
              </h3>
              <p className="text-gray-600">
                Discover, buy, and showcase human-made art with a seamless, fair-trade inspired marketplace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16 text-center text-white">
        <h2 className="text-3xl font-semibold mb-4">Ready to explore authentic creativity?</h2>
        <p className="text-lg opacity-90 mb-8">
          Join a growing community of artists and collectors who believe in real, human-made digital art.
        </p>
        <Link
          to="/marketplace"
          className="rounded-lg bg-white text-purple-700 font-semibold px-8 py-3 hover:bg-gray-100 transition"
        >
          Start Browsing
        </Link>
      </section>
    </main>
  );
}
