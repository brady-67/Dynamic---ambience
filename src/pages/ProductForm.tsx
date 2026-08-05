import { useState } from 'react';
import { Loader2, Save, Trash2, X } from 'lucide-react';
import type { Product } from '@/lib/types';

export type ProductDraft = Omit<Product, 'id'> & { id?: string };

const emptyDraft: ProductDraft = {
  name: '',
  brand: 'Ramtons',
  category: 'Kitchen',
  price: 0,
  old_price: null,
  image_url: '',
  rating: 4.5,
  reviews_count: 0,
  in_stock: true,
  featured: false,
  description: '',
};

const brandOptions = ['Ramtons', 'Von'];
const categoryOptions = ['Kitchen', 'Small Appliances', 'Laundry', 'Refrigeration', 'Cookware'];

interface ProductFormProps {
  initial?: Product | null;
  saving: boolean;
  deleting: boolean;
  onCancel: () => void;
  onSave: (draft: ProductDraft) => void;
  onDelete?: () => void;
}

function field(label: string, children: React.ReactNode) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  'w-full rounded-xl border border-ink-200 bg-sand-50 px-3.5 py-2.5 text-sm text-ink-900 outline-none transition-colors focus:border-clay-400 focus:ring-2 focus:ring-clay-100';

export default function ProductForm({
  initial,
  saving,
  deleting,
  onCancel,
  onSave,
  onDelete,
}: ProductFormProps) {
  const [draft, setDraft] = useState<ProductDraft>(
    initial ? { ...initial } : { ...emptyDraft },
  );
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const set = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const isValid = draft.name.trim() && draft.image_url.trim() && draft.price >= 0;

  return (
    <div className="rounded-2xl bg-sand-50 p-6 ring-1 ring-ink-200 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {field(
          'Name',
          <input
            className={inputClass}
            value={draft.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Ramtons 20L Digital Microwave"
          />,
        )}
        {field(
          'Image URL',
          <input
            className={inputClass}
            value={draft.image_url}
            onChange={(e) => set('image_url', e.target.value)}
            placeholder="https://images.pexels.com/..."
          />,
        )}
        {field(
          'Brand',
          <select
            className={inputClass}
            value={draft.brand}
            onChange={(e) => set('brand', e.target.value)}
          >
            {brandOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>,
        )}
        {field(
          'Category',
          <select
            className={inputClass}
            value={draft.category}
            onChange={(e) => set('category', e.target.value)}
          >
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>,
        )}
        {field(
          'Price (KES)',
          <input
            type="number"
            min={0}
            className={inputClass}
            value={draft.price}
            onChange={(e) => set('price', Number(e.target.value))}
          />,
        )}
        {field(
          'Old price (optional)',
          <input
            type="number"
            min={0}
            className={inputClass}
            value={draft.old_price ?? ''}
            onChange={(e) => set('old_price', e.target.value === '' ? null : Number(e.target.value))}
            placeholder="Leave blank if no discount"
          />,
        )}
        {field(
          'Rating (0–5)',
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            className={inputClass}
            value={draft.rating}
            onChange={(e) => set('rating', Number(e.target.value))}
          />,
        )}
        {field(
          'Reviews count',
          <input
            type="number"
            min={0}
            className={inputClass}
            value={draft.reviews_count}
            onChange={(e) => set('reviews_count', Number(e.target.value))}
          />,
        )}
      </div>

      <div className="mt-5">
        {field(
          'Description',
          <textarea
            className={`${inputClass} min-h-[84px] resize-y`}
            value={draft.description ?? ''}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Short product description shown on the storefront card."
          />,
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm font-medium text-ink-800">
          <input
            type="checkbox"
            checked={draft.in_stock}
            onChange={(e) => set('in_stock', e.target.checked)}
            className="h-4 w-4 rounded border-ink-300 text-clay-500 focus:ring-clay-400"
          />
          In stock
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-ink-800">
          <input
            type="checkbox"
            checked={draft.featured}
            onChange={(e) => set('featured', e.target.checked)}
            className="h-4 w-4 rounded border-ink-300 text-clay-500 focus:ring-clay-400"
          />
          Featured
        </label>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-ink-200 pt-5">
        <div>
          {initial && onDelete && (
            confirmingDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-clay-600">Delete this product?</span>
                <button
                  onClick={onDelete}
                  disabled={deleting}
                  className="inline-flex items-center gap-1.5 rounded-full bg-clay-600 px-3.5 py-1.5 text-sm font-medium text-sand-50 hover:bg-clay-700 disabled:opacity-60"
                >
                  {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmingDelete(false)}
                  className="text-sm text-ink-500 hover:text-ink-800"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmingDelete(true)}
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium text-clay-600 ring-1 ring-clay-200 hover:bg-clay-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            )
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-ink-600 hover:text-ink-900"
          >
            <X className="h-4 w-4" /> Cancel
          </button>
          <button
            onClick={() => isValid && onSave(draft)}
            disabled={!isValid || saving}
            className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-sand-50 transition-colors hover:bg-clay-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {initial ? 'Save changes' : 'Add product'}
          </button>
        </div>
      </div>
    </div>
  );
}
