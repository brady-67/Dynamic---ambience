import { useCallback, useMemo, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import Shop from '@/components/Shop';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import type { CartItem, Product } from '@/lib/types';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart]);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const incItem = useCallback((id: string) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)));
  }, []);

  const decItem = useCallback((id: string) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-sand-50">
      <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Shop onAdd={addToCart} />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onInc={incItem}
        onDec={decItem}
        onRemove={removeItem}
      />
    </div>
  );
}
