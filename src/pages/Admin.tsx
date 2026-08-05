import { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Lock,
  Loader2,
  Package,
  Plus,
  Search,
  Star,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import ProductForm, { type ProductDraft } from './ProductForm';

const SESSION_KEY = 'da_admin_authed';

function formatKES(n: number) {
  return 'KSh ' + n.toLocaleString('en-KE');
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const configured = (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) ?? '';

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configured) {
      setError(true);
      return;
    }
    if (value === configured) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-sand-100 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl bg-sand-50 p-8 text-center shadow-xl ring-1 ring-ink-200"
      >
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-ink-900 text-sand-50">
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="mt-4 font-serif text-2xl font-semibold text-ink-950">Admin access</h1>
        <p className="mt-1.5 text-sm text-ink-600">Enter the admin passcode to manage listings.</p>
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          placeholder="Passcode"
          className="mt-6 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-center text-sm outline-none focus:border-clay-400 focus:ring-2 focus:ring-clay-100"
        />
        {error && (
          <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-clay-600">
            <AlertCircle className="h-3.5 w-3.5" />
            {configured ? 'Incorrect passcode.' : 'No VITE_ADMIN_PASSWORD is configured.'}
          </p>
        )}
        <button
          type="submit"
          className="mt-5 w-full rounded-full bg-ink-900 px-5 py-3 text-sm font-medium text-sand-50 transition-colors hover:bg-clay-600"
        >
          Unlock
        </button>
        <a
          href="/"
          className="mt-5 inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to site
        </a>
      </form>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') setAuthed(true);
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) {
      setError(err.message);
    } else {
      setError(null);
      setProducts((data as Product[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authed) loadProducts();
  }, [authed]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(t);
  }, [toast]);

  if (!authed) return <PasswordGate onUnlock={() => setAuthed(true)} />;

  const filtered = products.filter((p) =>
    `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSave = async (draft: ProductDraft) => {
    setSaving(true);
    if (draft.id) {
      const { id, ...rest } = draft;
      const { error: err } = await supabase.from('products').update(rest).eq('id', id);
      if (err) {
        setToast(`Save failed: ${err.message}`);
      } else {
        setToast('Product updated');
        setEditing(null);
        await loadProducts();
      }
    } else {
      const rest: Omit<ProductDraft, 'id'> = { ...draft };
      delete (rest as ProductDraft).id;
      const { error: err } = await supabase.from('products').insert(rest);
      if (err) {
        setToast(`Save failed: ${err.message}`);
      } else {
        setToast('Product added');
        setCreating(false);
        await loadProducts();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    const { error: err } = await supabase.from('products').delete().eq('id', id);
    if (err) {
      setToast(`Delete failed: ${err.message}`);
    } else {
      setToast('Product deleted');
      setEditing(null);
      await loadProducts();
    }
    setDeleting(false);
  };

  return (
    <div className="min-h-screen bg-sand-100">
      <header className="border-b border-ink-200 bg-sand-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <div>
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to site
            </a>
            <h1 className="mt-1 font-serif text-3xl font-semibold text-ink-950">
              Manage listings
            </h1>
            <p className="mt-1 text-sm text-ink-600">
              {products.length} product{products.length === 1 ? '' : 's'} in the shop
            </p>
          </div>
          <button
            onClick={() => {
              setCreating(true);
              setEditing(null);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-sand-50 transition-colors hover:bg-clay-600"
          >
            <Plus className="h-4 w-4" /> Add product
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {toast && (
          <div className="mb-6 rounded-xl bg-ink-900 px-4 py-3 text-sm text-sand-50 shadow-lg">
            {toast}
          </div>
        )}

        {creating && (
          <div className="mb-8">
            <ProductForm
              saving={saving}
              deleting={false}
              onCancel={() => setCreating(false)}
              onSave={handleSave}
            />
          </div>
        )}

        {editing && (
          <div className="mb-8">
            <ProductForm
              initial={editing}
              saving={saving}
              deleting={deleting}
              onCancel={() => setEditing(null)}
              onSave={handleSave}
              onDelete={() => handleDelete(editing.id)}
            />
          </div>
        )}

        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border border-ink-200 bg-sand-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-clay-400 focus:ring-2 focus:ring-clay-100"
          />
        </div>

        {loading ? (
          <div className="mt-14 flex items-center justify-center py-24 text-ink-500">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
        ) : error ? (
          <div className="mt-8 flex items-start gap-3 rounded-2xl bg-clay-100 p-6 text-clay-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium">Could not load products.</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-sand-50 p-12 text-center text-ink-500">
            <Package className="mx-auto h-8 w-8 text-ink-300" />
            <p className="mt-3">No products match your search.</p>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl bg-sand-50 ring-1 ring-ink-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-sand-100 text-xs uppercase tracking-widest text-ink-500">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Brand</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Rating</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-sand-100/60">
                    <td className="flex items-center gap-3 px-5 py-3">
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-11 w-11 shrink-0 rounded-lg object-cover ring-1 ring-ink-200"
                      />
                      <div>
                        <p className="font-medium text-ink-900">{p.name}</p>
                        {p.featured && (
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-clay-500">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-700">{p.brand}</td>
                    <td className="px-5 py-3 text-ink-700">{p.category}</td>
                    <td className="px-5 py-3 text-ink-900">{formatKES(p.price)}</td>
                    <td className="px-5 py-3 text-ink-700">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-clay-400 text-clay-400" />
                        {p.rating}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          p.in_stock ? 'bg-sage-100 text-sage-700' : 'bg-clay-100 text-clay-700'
                        }`}
                      >
                        {p.in_stock ? 'In stock' : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => {
                          setEditing(p);
                          setCreating(false);
                        }}
                        className="rounded-full px-3.5 py-1.5 text-sm font-medium text-ink-700 ring-1 ring-ink-200 hover:bg-ink-900 hover:text-sand-50"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
