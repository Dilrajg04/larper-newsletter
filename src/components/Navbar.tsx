"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-zinc-200 bg-white/90 backdrop-blur-sm sticky top-0 z-50 transition-shadow duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-3xl font-black tracking-tighter text-zinc-900 transition-opacity duration-200 group-hover:opacity-60">
            LARPER
          </span>
          <span className="text-xs text-zinc-500 font-mono hidden sm:block">
            /AI & TECH FOR STUDENTS
          </span>
        </Link>
        <div className="hidden sm:flex items-center gap-8 text-sm">
          <Link href="/" className="nav-link text-zinc-600 hover:text-zinc-900 transition-colors duration-200">
            Issues
          </Link>
          <Link href="#subscribe" className="nav-link text-zinc-600 hover:text-zinc-900 transition-colors duration-200">
            Subscribe
          </Link>
          <Link
            href="#donate"
            className="bg-zinc-900 hover:bg-zinc-700 text-white font-semibold px-5 py-2 rounded-full transition-colors duration-200 text-sm"
          >
            Support Us
          </Link>
        </div>
        <button
          className="sm:hidden text-zinc-600 hover:text-zinc-900 transition-colors duration-200"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-out ${
          menuOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-5 flex flex-col gap-4 text-sm border-t border-zinc-100 pt-4">
          <Link href="/" className="text-zinc-600 hover:text-zinc-900 transition-colors" onClick={() => setMenuOpen(false)}>Issues</Link>
          <Link href="#subscribe" className="text-zinc-600 hover:text-zinc-900 transition-colors" onClick={() => setMenuOpen(false)}>Subscribe</Link>
          <Link href="#donate" className="text-zinc-900 font-semibold" onClick={() => setMenuOpen(false)}>Support Us</Link>
        </div>
      </div>
    </nav>
  );
}
