import { ArrowRight, Star, MapPin } from 'lucide-react';

const heroImage =
  'https://images.pexels.com/photos/8135492/pexels-photo-8135492.jpeg?auto=compress&cs=tinysrgb&w=1600';
const stats = [
  { value: '4.4★', label: 'Google Rating' },
  { value: '120+', label: 'Projects Done' },
  { value: '8 yrs', label: 'In Nairobi' },
];

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Elegant living room interior by Dynamic Ambience"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/55 to-ink-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-ink-950/30" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center container-px pt-20">
        <div className="max-w-2xl">
          <div className="mb-6 flex items-center gap-3 animate-fade-in">
            <span className="h-px w-10 bg-clay-400" />
            <span className="eyebrow text-clay-300">Interior Designer in Nairobi</span>
          </div>
          <h1 className="heading text-balance text-5xl text-sand-50 sm:text-6xl lg:text-7xl animate-fade-up">
            Spaces that feel
            <span className="block italic text-clay-300">warmly, stylishly you</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-sand-100/90 animate-fade-up [animation-delay:120ms] opacity-0">
            Dynamic Ambience transforms residential homes, commercial offices and cafés across
            Kenya into warm, tailored environments — designed around your satisfaction, down to the
            last carpet tile.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4 animate-fade-up [animation-delay:240ms] opacity-0">
            <a href="#portfolio" className="btn-primary bg-clay-500 hover:bg-clay-400">
              View Our Work <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#shop"
              className="btn-outline border-sand-50/40 text-sand-50 hover:bg-sand-50 hover:text-ink-950"
            >
              Shop Appliances
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 animate-fade-up [animation-delay:360ms] opacity-0">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="font-serif text-3xl font-semibold text-sand-50">{s.value}</span>
                <span className="text-xs uppercase tracking-widest text-sand-200">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between container-px">
          <div className="flex items-center gap-2 text-sand-200/80">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Mombasa Road, Nairobi</span>
          </div>
          <div className="hidden items-center gap-1 text-sand-200/80 sm:flex">
            <Star className="h-4 w-4 fill-clay-400 text-clay-400" />
            <span className="text-sm">4.4 · 4,423 Google reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}
