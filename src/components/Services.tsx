import { Home, Building2, Coffee, Layers, Palette, Ruler } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';

const services = [
  {
    icon: Home,
    title: 'Residential Design',
    desc: 'Living rooms, bedrooms and full homes styled for comfort, warmth and everyday living.',
  },
  {
    icon: Building2,
    title: 'Commercial Offices',
    desc: 'Workspaces that boost productivity and reflect your brand — from layout to finishings.',
  },
  {
    icon: Coffee,
    title: 'Cafés & Hospitality',
    desc: 'Inviting, Instagram-worthy interiors that make guests linger and return.',
  },
  {
    icon: Layers,
    title: 'Carpet & Flooring',
    desc: 'Supply and installation of new carpet flooring, tiles and vinyl for any premises.',
  },
  {
    icon: Palette,
    title: 'Colour & Material',
    desc: 'Curated palettes, textures and lighting plans that tie a whole space together.',
  },
  {
    icon: Ruler,
    title: 'Project Management',
    desc: 'End-to-end coordination from concept and procurement to installation and handover.',
  },
];

export default function Services() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section id="services" className="relative bg-ink-950 py-24 text-sand-50 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(178,94,61,0.18),transparent_55%)]" />
      <div ref={ref} className="relative mx-auto max-w-7xl container-px">
        <div className={`max-w-2xl ${visible ? 'animate-fade-up' : 'reveal'}`}>
          <span className="eyebrow text-clay-400">What we do</span>
          <h2 className="heading mt-4 text-4xl text-sand-50 sm:text-5xl">
            Full-service interior design, start to finish
          </h2>
          <p className="mt-5 text-lg text-sand-200/80">
            Whether it is a single room or an entire office floor, we bring the same care for
            detail, budget and timeline.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <article
              key={s.title}
              className={`group relative overflow-hidden rounded-2xl border border-sand-50/10 bg-sand-50/[0.04] p-8 transition-all duration-500 hover:border-clay-400/40 hover:bg-sand-50/[0.07] ${
                visible ? 'animate-fade-up opacity-0' : 'reveal'
              }`}
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-clay-500/15 text-clay-300 transition-colors duration-500 group-hover:bg-clay-500 group-hover:text-sand-50">
                <s.icon className="h-7 w-7" />
              </span>
              <h3 className="mt-6 font-serif text-2xl font-medium text-sand-50">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-sand-200/70">{s.desc}</p>
              <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-clay-500/0 blur-2xl transition-all duration-500 group-hover:bg-clay-500/20" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
