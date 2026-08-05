import { useState } from 'react';
import { Phone, MapPin, Clock, Mail, Send, Check } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';

export default function Contact() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    window.setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="bg-ink-950 py-24 text-sand-50 lg:py-32">
      <div
        ref={ref}
        className={`mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 container-px ${visible ? 'animate-fade-up' : 'reveal'}`}
      >
        <div>
          <span className="eyebrow text-clay-400">Get in touch</span>
          <h2 className="heading mt-4 text-4xl text-sand-50 sm:text-5xl">
            Let us design your next space
          </h2>
          <p className="mt-5 max-w-md text-lg text-sand-200/80">
            Tell us about your project — a room, an office or a café — and we will get back to you
            with a tailored proposal.
          </p>

          <div className="mt-10 space-y-5">
            <a href="tel:+254707083807" className="flex items-center gap-4 group">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-sand-50/10 text-clay-300 transition-colors group-hover:bg-clay-500 group-hover:text-sand-50">
                <Phone className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-widest text-sand-200/60">Phone</span>
                <span className="font-serif text-lg text-sand-50">0707 083807</span>
              </span>
            </a>
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-sand-50/10 text-clay-300">
                <MapPin className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-widest text-sand-200/60">Address</span>
                <span className="font-serif text-lg text-sand-50">Mombasa Road, Nairobi</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-sand-50/10 text-clay-300">
                <Clock className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-widest text-sand-200/60">Hours</span>
                <span className="font-serif text-lg text-sand-50">Open · Closes 6 pm</span>
              </span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-sand-50/[0.05] p-8 ring-1 ring-sand-50/10 backdrop-blur"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" id="name" placeholder="Jane Doe" />
            <Field label="Phone" id="phone" placeholder="07XX XXX XXX" />
          </div>
          <div className="mt-5">
            <Field label="Email" id="email" type="email" placeholder="you@email.com" />
          </div>
          <div className="mt-5">
            <label htmlFor="message" className="block text-xs uppercase tracking-widest text-sand-200/70">
              Project details
            </label>
            <textarea
              id="message"
              rows={4}
              placeholder="Tell us about your space, budget and timeline..."
              className="mt-2 w-full resize-none rounded-xl border border-sand-50/15 bg-ink-900/40 px-4 py-3 text-sand-50 placeholder:text-sand-200/40 focus:border-clay-400 focus:outline-none focus:ring-2 focus:ring-clay-400/40"
            />
          </div>
          <button
            type="submit"
            className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 ${
              sent ? 'bg-sage-500 text-sand-50' : 'bg-clay-500 text-sand-50 hover:bg-clay-400'
            }`}
          >
            {sent ? (
              <>
                <Check className="h-4 w-4" /> Message sent — we will be in touch
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Send enquiry
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  id,
  type = 'text',
  placeholder,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs uppercase tracking-widest text-sand-200/70">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-sand-50/15 bg-ink-900/40 px-4 py-3 text-sand-50 placeholder:text-sand-200/40 focus:border-clay-400 focus:outline-none focus:ring-2 focus:ring-clay-400/40"
      />
    </div>
  );
}
