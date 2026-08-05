import { Phone, MapPin, Clock, Instagram, Facebook, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ink-950 text-sand-200/70">
      <div className="mx-auto max-w-7xl container-px py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-sand-50/30 text-sand-50">
                <span className="font-serif text-lg font-semibold">D</span>
              </span>
              <span className="leading-tight">
                <span className="block font-serif text-base font-semibold text-sand-50">
                  Dynamic Ambience
                </span>
                <span className="block text-[10px] uppercase tracking-[0.28em] text-sand-200/60">
                  Interior Designs
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              A Kenya-based interior design firm transforming residential, commercial and café
              spaces into warm, stylish environments tailored to client satisfaction.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="grid h-10 w-10 place-items-center rounded-full bg-sand-50/10 text-sand-100 transition-colors hover:bg-clay-500 hover:text-sand-50"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-sand-50">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {['About', 'Services', 'Portfolio', 'Shop', 'Contact'].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`} className="transition-colors hover:text-sand-50">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-sand-50">Visit us</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-clay-300" /> Mombasa Road, Nairobi
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-clay-300" /> 0707 083807
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-clay-300" /> Open · Closes 6 pm
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-sand-50/10 pt-6 text-xs text-sand-200/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Dynamic Ambience Interior Designs. All rights reserved.</p>
          <p>Interior Designer in Nairobi · Mombasa Road</p>
        </div>
      </div>
    </footer>
  );
}
