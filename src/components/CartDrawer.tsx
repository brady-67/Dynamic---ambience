import { useEffect, useRef, useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Copy,
  Check,
  MessageCircle,
  Smartphone,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
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

const WHATSAPP_NUMBER = '254707083807';
const MPESA_PAYBILL = '400200';
const MPESA_ACCOUNT = '1167432';
const COOP_ACCOUNT = '01102088193001';
const ACCOUNT_NAME = 'DYNAMIC AMBIENCE INTERIOR DESIGN';

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API unavailable — user can still select and copy manually.
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-sand-100 px-4 py-3">
      <div>
        <p className="text-[11px] uppercase tracking-widest text-ink-500">{label}</p>
        <p className="font-serif text-base font-semibold text-ink-950">{value}</p>
      </div>
      <button
        onClick={copy}
        aria-label={`Copy ${label}`}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-600 transition-colors hover:bg-sand-50 hover:text-ink-900"
      >
        {copied ? <Check className="h-4 w-4 text-sage-600" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

type StkState = 'idle' | 'requesting' | 'awaiting' | 'success' | 'failed' | 'timeout';

function looksLikeKenyanPhone(input: string) {
  const digits = input.replace(/\D/g, '');
  return /^254(7|1)\d{8}$/.test(digits) || /^0(7|1)\d{8}$/.test(digits) || /^(7|1)\d{8}$/.test(digits);
}

export default function CartDrawer({ open, items, onClose, onInc, onDec, onRemove }: CartDrawerProps) {
  const [step, setStep] = useState<'cart' | 'payment'>('cart');
  const [showManual, setShowManual] = useState(false);
  const [phone, setPhone] = useState('');
  const [stkState, setStkState] = useState<StkState>('idle');
  const [stkError, setStkError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<string | null>(null);
  const pollRef = useRef<number | null>(null);

  const stopPolling = () => {
    if (pollRef.current) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setStep('cart');
      setShowManual(false);
      setStkState('idle');
      setStkError(null);
      setReceipt(null);
      stopPolling();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => stopPolling, []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const orderSummary = items.map((i) => `${i.name} x${i.quantity}`).join(', ');

  const startStkPush = async () => {
    if (!looksLikeKenyanPhone(phone)) {
      setStkError('Enter a valid Safaricom number, e.g. 07XXXXXXXX.');
      return;
    }
    setStkError(null);
    setStkState('requesting');

    try {
      const res = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount: subtotal, orderSummary }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStkState('failed');
        setStkError(data.error || 'Could not start the M-Pesa prompt. Please try again.');
        return;
      }

      setStkState('awaiting');
      const checkoutRequestId = data.checkoutRequestId as string;
      let attempts = 0;

      pollRef.current = window.setInterval(async () => {
        attempts += 1;
        try {
          const statusRes = await fetch(
            `/api/mpesa/status?checkoutRequestId=${encodeURIComponent(checkoutRequestId)}`,
          );
          const statusData = await statusRes.json();

          if (statusRes.ok && statusData.status === 'success') {
            stopPolling();
            setReceipt(statusData.mpesa_receipt ?? null);
            setStkState('success');
          } else if (statusRes.ok && statusData.status === 'failed') {
            stopPolling();
            setStkError(statusData.result_desc || 'Payment was not completed.');
            setStkState('failed');
          } else if (attempts >= 20) {
            stopPolling();
            setStkState('timeout');
          }
        } catch {
          if (attempts >= 20) {
            stopPolling();
            setStkState('timeout');
          }
        }
      }, 3000);
    } catch {
      setStkState('failed');
      setStkError('Could not reach the payment service. Check your connection and try again.');
    }
  };

  const whatsappHref = (() => {
    const lines = items.map(
      (i) => `• ${i.name} x${i.quantity} — ${formatKES(i.price * i.quantity)}`,
    );
    const paymentLine =
      stkState === 'success'
        ? `Paid via M-Pesa${receipt ? ` (Receipt: ${receipt})` : ''}.`
        : 'I have made payment via M-Pesa / bank transfer and will share the confirmation.';
    const message = [
      'Hi Dynamic Ambience, I would like to confirm my order:',
      '',
      ...lines,
      '',
      `Total: ${formatKES(subtotal)}`,
      '',
      paymentLine,
    ].join('\n');
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  })();

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
            <ShoppingBag className="h-5 w-5 text-clay-500" />
            {step === 'payment' ? 'Complete payment' : 'Your Cart'}
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
        ) : step === 'payment' ? (
          <>
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-600">Amount to pay</span>
                  <span className="font-serif text-2xl font-semibold text-ink-950">
                    {formatKES(subtotal)}
                  </span>
                </div>
              </div>

              {stkState === 'success' ? (
                <div className="rounded-2xl bg-sage-50 p-5 text-center">
                  <CheckCircle2 className="mx-auto h-9 w-9 text-sage-600" />
                  <p className="mt-3 font-serif text-lg font-semibold text-ink-950">
                    Payment received
                  </p>
                  {receipt && (
                    <p className="mt-1 text-sm text-sage-700">M-Pesa receipt: {receipt}</p>
                  )}
                  <p className="mt-2 text-xs text-ink-500">
                    Send us your order on WhatsApp so we can schedule delivery.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-clay-500">
                    <Smartphone className="h-3.5 w-3.5" /> Pay with M-Pesa
                  </p>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-ink-600">
                      M-Pesa phone number
                    </span>
                    <input
                      type="tel"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07XX XXX XXX"
                      disabled={stkState === 'requesting' || stkState === 'awaiting'}
                      className="w-full rounded-xl border border-ink-200 bg-sand-50 px-3.5 py-2.5 text-sm text-ink-900 outline-none transition-colors focus:border-clay-400 focus:ring-2 focus:ring-clay-100 disabled:opacity-60"
                    />
                  </label>

                  {stkError && (
                    <p className="mt-2 flex items-start gap-1.5 text-xs text-clay-600">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {stkError}
                    </p>
                  )}

                  {stkState === 'awaiting' && (
                    <p className="mt-3 flex items-center gap-2 rounded-xl bg-sand-100 px-3.5 py-2.5 text-xs text-ink-600">
                      <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
                      Check your phone and enter your M-Pesa PIN to complete the payment...
                    </p>
                  )}

                  {stkState === 'timeout' && (
                    <p className="mt-2 flex items-start gap-1.5 text-xs text-clay-600">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      Didn't get the prompt, or it timed out? You can try again below.
                    </p>
                  )}

                  <button
                    onClick={startStkPush}
                    disabled={stkState === 'requesting' || stkState === 'awaiting'}
                    className="btn-primary mt-3 flex w-full items-center justify-center gap-2 bg-sage-600 hover:bg-sage-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {stkState === 'requesting' || stkState === 'awaiting' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Smartphone className="h-4 w-4" />
                    )}
                    {stkState === 'requesting'
                      ? 'Sending prompt...'
                      : stkState === 'awaiting'
                        ? 'Waiting for payment...'
                        : 'Send M-Pesa prompt'}
                  </button>

                  <button
                    onClick={() => setShowManual((v) => !v)}
                    className="mt-3 w-full text-center text-xs font-medium text-ink-500 underline decoration-ink-300 underline-offset-2 hover:text-ink-800"
                  >
                    {showManual ? 'Hide paybill / bank details' : 'Prefer to pay manually instead?'}
                  </button>
                </div>
              )}

              {showManual && stkState !== 'success' && (
                <div className="space-y-6 border-t border-ink-200 pt-6">
                  <div>
                    <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-clay-500">
                      Lipa na M-Pesa
                    </p>
                    <div className="space-y-2">
                      <CopyRow label="Paybill Number" value={MPESA_PAYBILL} />
                      <CopyRow label="Account Number" value={MPESA_ACCOUNT} />
                    </div>
                  </div>

                  <div>
                    <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-clay-500">
                      Bank Transfer — Co-op Bank
                    </p>
                    <div className="space-y-2">
                      <CopyRow label="Account Number" value={COOP_ACCOUNT} />
                      <CopyRow label="Account Name" value={ACCOUNT_NAME} />
                    </div>
                  </div>

                  <p className="rounded-xl bg-sage-50 px-4 py-3 text-xs leading-relaxed text-sage-700">
                    After paying, tap the button below to send us your order details and payment
                    confirmation on WhatsApp — we'll verify and get your delivery scheduled.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-ink-200 px-6 py-5">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex w-full items-center justify-center gap-2 bg-ink-900 hover:bg-clay-600"
              >
                <MessageCircle className="h-4.5 w-4.5" /> Confirm order via WhatsApp
              </a>
              <button
                onClick={() => setStep('cart')}
                className="mt-2 w-full text-center text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
              >
                Back to cart
              </button>
            </div>
          </>
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
              <button
                onClick={() => setStep('payment')}
                className="btn-primary mt-4 w-full bg-clay-500 hover:bg-clay-400"
              >
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
