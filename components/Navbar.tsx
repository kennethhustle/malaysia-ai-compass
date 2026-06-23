'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm border-b border-[#E8E5DF] shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <span className="text-[#1C1C1C] font-black text-xl tracking-tight">HUSTLE</span>
          <span className="text-[#FF5C00] font-black text-xl tracking-tight"> AI COMPASS</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="/#how-it-works" className="text-sm font-medium text-[#3D3D3D] hover:text-[#FF5C00] transition-colors">
            How It Works
          </a>
          <a href="/#what-youll-get" className="text-sm font-medium text-[#3D3D3D] hover:text-[#FF5C00] transition-colors">
            What You&apos;ll Get
          </a>
          <a href="/#for-teams" className="text-sm font-medium text-[#3D3D3D] hover:text-[#FF5C00] transition-colors">
            For Teams
          </a>
          <Link
            href="/survey"
            className="bg-[#FF5C00] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#E54E00] transition-all"
          >
            Start Diagnosis
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`block h-0.5 bg-[#1C1C1C] transition-transform ${menuOpen ? 'rotate-45 translate-y-[7.5px]' : ''}`} />
            <span className={`block h-0.5 bg-[#1C1C1C] transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-[#1C1C1C] transition-transform ${menuOpen ? '-rotate-45 -translate-y-[7.5px]' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#E8E5DF] px-6 py-4 flex flex-col gap-4">
          <a href="/#how-it-works" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-[#3D3D3D] py-2">How It Works</a>
          <a href="/#what-youll-get" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-[#3D3D3D] py-2">What You&apos;ll Get</a>
          <a href="/#for-teams" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-[#3D3D3D] py-2">For Teams</a>
          <Link href="/survey" onClick={() => setMenuOpen(false)} className="bg-[#FF5C00] text-white text-sm font-bold px-5 py-3 rounded-xl text-center">
            Start Diagnosis
          </Link>
        </div>
      )}
    </nav>
  );
}
