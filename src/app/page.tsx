'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, FileText } from 'lucide-react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 text-white rounded p-1.5">
              <FileText size={24} />
            </div>
            <span className="text-2xl font-bold text-slate-900">INVOICE</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button className="text-slate-600 hover:text-slate-900 transition">
              Features
            </button>
            <button className="text-slate-600 hover:text-slate-900 transition">
              Pricing
            </button>
            <button className="text-slate-600 hover:text-slate-900 transition">
              About
            </button>
            <Link
              href="/auth/signin"
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
            >
              Sign in
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <button className="block text-slate-600 hover:text-slate-900 w-full text-left">
                Features
              </button>
              <button className="block text-slate-600 hover:text-slate-900 w-full text-left">
                Pricing
              </button>
              <button className="block text-slate-600 hover:text-slate-900 w-full text-left">
                About
              </button>
              <Link
                href="/auth/signin"
                className="block w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition text-center"
              >
                Sign in
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Quickly create quotes and invoices
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            A simple invoicing solution designed for freelancers. Create
            professional quotes and invoices in minutes.
          </p>
          <Link href="/auth/signup">
            <button className="px-8 py-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition shadow-lg hover:shadow-xl">
              Get started for free
            </button>
          </Link>
        </div>

        {/* Sign Up Preview */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Sign up</h2>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
            <Link href="/auth/signup">
              <button className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition">
                Sign up
              </button>
            </Link>
          </div>
          <p className="text-center text-slate-600 mt-4">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}