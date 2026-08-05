import { useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import type { CartItem } from '@/lib/types';

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onRemove: (id: string) => void;
}

function formatKES(n: number) {
  return 'KSh ' + n.toLocaleString('en-KE');
}

export default function CartDrawer({ open, items, onClose, onInc, onDec, onRemove }: CartDrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-ink-950/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-sand-50 shadow-2xl transition-transform duration-400 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink-200 px-6 py-5">
          <h3 className="flex items-center gap-2 font-serif text-xl font-medium text-ink-950">
            <ShoppingBag className="h-5 w-5 text-clay-500" /> Your Cart
          </h3>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="grid h-10 w-10 place-items-center rounded-full text-ink-600 transition-colors hover:bg-sand-100 hover:text-ink-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-sand-100 text-ink-400">
              <ShoppingBag className="h-8 w-8" />
            </span>
            <p className="font-serif text-lg text-ink-800">Your cart is empty</p>
            <p className="text-sm text-ink-500">Browse the shop and add your favourite appliances.</p>
            <button onClick={onClose} className="btn-outline mt-4">
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-2xl bg-sand-100 p-3">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-clay-500">
                          {item.brand}
                        </span>
                        <h4 className="font-serif text-sm font-medium leading-snug text-ink-900">
                          {item.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => onRemove(item.id)}
                        aria-label="Remove item"
                        className="text-ink-400 transition-colors hover:text-clay-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 rounded-full bg-sand-50 p-1 ring-1 ring-ink-200">
                        <button
                          onClick={() => onDec(item.id)}
                          aria-label="Decrease quantity"
                          className="grid h-7 w-7 place-items-center rounded-full text-ink-700 transition-colors hover:bg-ink-100"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-ink-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onInc(item.id)}
                          aria-label="Increase quantity"
                          className="grid h-7 w-7 place-items-center rounded-full text-ink-700 transition-colors hover:bg-ink-100"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-serif text-sm font-semibold text-ink-950">
                        {formatKES(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-ink-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-600">Subtotal</span>
                <span className="font-serif text-2xl font-semibold text-ink-950">
                  {formatKES(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-500">
                Delivery calculated at checkout. Pay on delivery or M-Pesa.
              </p>
              <button className="btn-primary mt-4 w-full bg-clay-500 hover:bg-clay-400">
                Checkout
              </button>
              <button
                onClick={onClose}
                className="mt-2 w-full text-center text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
