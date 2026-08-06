import { useEffect, useMemo, useState } from 'react';
import { Star, ShoppingBag, Loader2, SlidersHorizontal, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import { useReveal } from '@/lib/useReveal';

interface ShopProps {
  onAdd: (product: Product) => void;
}

const categories = ['All', 'Kitchen', 'Small Appliances', 'Laundry', 'Refrigeration', 'Cookware'];

function formatKES(n: number) {
  return 'KSh ' + n.toLocaleString('en-KE');
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < Math.round(rating) ? 'fill-clay-400 text-clay-400' : 'text-ink-300'}`}
        />
      ))}
    </div>
  );
}

export default function Shop({ onAdd }: ShopProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('All');
  const [added, setAdded] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('products')
        .select('*')
        .order('featured', { ascending: false })
        .order('rating', { ascending: false });
      if (!active) return;
      if (err) {
        setError('We could not load products right now. Please try again.');
      } else {
        setProducts((data as Product[]) ?? []);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(
    () => products.filter((p) => category === 'All' || p.category === category),
    [products, category],
  );

  const handleAdd = (p: Product) => {
    onAdd(p);
    setAdded(p.id);
    window.setTimeout(() => setAdded((cur) => (cur === p.id ? null : cur)), 1400);
  };

  return (
    <section id="shop" className="bg-sand-100 py-24 lg:py-32">
      <div ref={ref} className="mx-auto max-w-7xl container-px">
        <div className={`max-w-2xl ${visible ? 'animate-fade-up' : 'reveal'}`}>
          <span className="eyebrow">Appliance shop</span>
          <h2 className="heading mt-4 text-4xl sm:text-5xl">Quality appliances, delivered to your door</h2>
          <p className="mt-5 text-lg text-ink-700">
            Kitchen, laundry and refrigeration appliances from the brands Kenyan homes trust —
            hand-picked to complement your new interior.
          </p>
        </div>

        {/* Filters */}
        <div className={`mt-10 flex flex-wrap items-center gap-3 ${visible ? 'animate-fade-up [animation-delay:120ms] opacity-0' : 'reveal'}`}>
          <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-ink-500">
            <SlidersHorizontal className="h-4 w-4" /> Category
          </span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                category === c
                  ? 'bg-clay-500 text-sand-50'
                  : 'bg-sand-50 text-ink-700 ring-1 ring-ink-200 hover:ring-clay-400'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="mt-14 flex items-center justify-center py-24 text-ink-500">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
        ) : error ? (
          <div className="mt-14 rounded-2xl bg-clay-100 p-8 text-center text-clay-700">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="mt-14 rounded-2xl bg-sand-50 p-12 text-center text-ink-500">
            No products match those filters.
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, i) => (
              <article
                key={p.id}
                className={`group flex flex-col overflow-hidden rounded-2xl bg-sand-50 ring-1 ring-ink-200/70 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-900/10 ${
                  visible ? 'animate-fade-up opacity-0' : 'reveal'
                }`}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="relative aspect-square overflow-hidden bg-sand-100">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 flex gap-2">
                    <span className="rounded-full bg-ink-950/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sand-50 backdrop-blur">
                      {p.brand}
                    </span>
                    {p.featured && (
                      <span className="rounded-full bg-clay-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sand-50">
                        Featured
                      </span>
                    )}
                  </div>
                  {!p.in_stock && (
                    <div className="absolute inset-0 grid place-items-center bg-ink-950/40">
                      <span className="rounded-full bg-sand-50 px-4 py-1.5 text-xs font-semibold text-ink-800">
                        Out of stock
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[11px] uppercase tracking-widest text-clay-500">{p.category}</span>
                  <h3 className="mt-1 font-serif text-lg font-medium leading-snug text-ink-900">{p.name}</h3>
                  {p.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-600">
                      {p.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <Stars rating={p.rating} />
                    <span className="text-xs text-ink-500">({p.reviews_count})</span>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="font-serif text-xl font-semibold text-ink-950">{formatKES(p.price)}</p>
                      {p.old_price && (
                        <p className="text-sm text-ink-400 line-through">{formatKES(p.old_price)}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAdd(p)}
                    disabled={!p.in_stock}
                    className={`mt-4 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                      !p.in_stock
                        ? 'cursor-not-allowed bg-ink-100 text-ink-400'
                        : added === p.id
                          ? 'bg-sage-500 text-sand-50'
                          : 'bg-ink-900 text-sand-50 hover:bg-clay-600'
                    }`}
                  >
                    {added === p.id ? (
                      <>
                        <Check className="h-4 w-4" /> Added
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" /> Add to cart
                      </>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
