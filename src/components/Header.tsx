import { useEffect, useState } from 'react';
import { ShoppingBag, Menu, X, Phone } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onCartOpen: () => void;
}

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Shop', href: '#shop' },
  { label: 'Contact', href: '#contact' },
];

export default function Header({ cartCount, onCartOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-sand-50/90 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <div className="container-px mx-auto flex h-20 max-w-7xl items-center justify-between">
        <a href="#home" className="flex items-center gap-3 group">
          <span
            className={`grid h-10 w-10 place-items-center rounded-full border transition-colors duration-500 ${
              scrolled ? 'border-ink-900 text-ink-900' : 'border-sand-50 text-sand-50'
            }`}
          >
            <span className="font-serif text-lg font-semibold">D</span>
          </span>
          <span className="leading-tight">
            <span
              className={`block font-serif text-base font-semibold transition-colors duration-500 ${
                scrolled ? 'text-ink-950' : 'text-sand-50'
              }`}
            >
              Dynamic Ambience
            </span>
            <span
              className={`block text-[10px] uppercase tracking-[0.28em] transition-colors duration-500 ${
                scrolled ? 'text-clay-500' : 'text-sand-200'
              }`}
            >
              Interior Designs
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`group relative text-sm font-medium transition-colors duration-300 ${
                scrolled ? 'text-ink-700 hover:text-ink-950' : 'text-sand-100 hover:text-white'
              }`}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-clay-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:+254707083807"
            className={`hidden items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 md:inline-flex ${
              scrolled
                ? 'border-ink-300 text-ink-800 hover:border-ink-900 hover:bg-ink-900 hover:text-sand-50'
                : 'border-sand-50/40 text-sand-50 hover:bg-sand-50 hover:text-ink-950'
            }`}
          >
            <Phone className="h-4 w-4" />
            0707 083807
          </a>
          <button
            onClick={onCartOpen}
            aria-label="Open cart"
            className={`relative grid h-11 w-11 place-items-center rounded-full transition-all duration-300 ${
              scrolled
                ? 'bg-ink-900 text-sand-50 hover:bg-clay-600'
                : 'bg-sand-50/15 text-sand-50 backdrop-blur hover:bg-sand-50 hover:text-ink-950'
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-clay-500 px-1 text-[11px] font-bold text-white animate-scale-in">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className={`grid h-11 w-11 place-items-center rounded-full transition-colors lg:hidden ${
              scrolled ? 'text-ink-900' : 'text-sand-50'
            }`}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-500 lg:hidden ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="mx-4 mb-4 rounded-2xl bg-sand-50 p-4 shadow-xl ring-1 ring-ink-200">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-medium text-ink-800 transition-colors hover:bg-sand-100"
            >
              {link.label}
            </a>
          ))}
          <a
            href="tel:+254707083807"
            className="mt-2 flex items-center gap-2 rounded-xl bg-ink-900 px-4 py-3 text-sm font-medium text-sand-50"
          >
            <Phone className="h-4 w-4" /> 0707 083807
          </a>
        </nav>
      </div>
    </header>
  );
}
