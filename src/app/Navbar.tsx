'use client'

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '/', label: 'Início' },
  { href: '/elenco', label: 'Elenco' },
  { href: '/jogos', label: 'Amistosos' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-6 left-0 w-full flex justify-center z-50 px-4">
      <header className="glass-card flex items-center justify-between px-6 py-3 w-full max-w-4xl rounded-full border-white/10">
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <span className="font-heading font-black tracking-tighter text-2xl text-white">
            AC<span className="text-acvb-gold">VB</span>
          </span>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className="text-gray-400 hover:text-white transition-colors">
              {label}
            </Link>
          ))}
          <Link href="/camisetas" className="px-5 py-2 rounded-full bg-white/5 text-acvb-gold border border-acvb-gold/30 hover:bg-acvb-gold hover:text-acvb-navy font-bold transition-all shadow-[0_0_15px_-3px_rgba(185,141,59,0.3)]">
            Comprar Manto
          </Link>
        </nav>

        {/* Hamburger */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute top-full mt-3 left-4 right-4 glass-card rounded-3xl border-white/10 py-4 flex flex-col">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="px-6 py-3 text-gray-300 hover:text-white hover:bg-white/5 font-medium text-sm transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="px-4 pt-2 pb-1">
            <Link
              href="/camisetas"
              onClick={() => setOpen(false)}
              className="block text-center px-5 py-3 rounded-full bg-white/5 text-acvb-gold border border-acvb-gold/30 hover:bg-acvb-gold hover:text-acvb-navy font-bold text-sm transition-all"
            >
              Comprar Manto
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
