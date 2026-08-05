import { Star, Quote } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';

const reviews = [
  {
    name: 'Wanjiru M.',
    text: 'They redesigned our living room and it feels like a completely new home. Warm, elegant and so well thought out.',
    rating: 5,
    role: 'Residential client',
  },
  {
    name: 'James K.',
    text: 'Dynamic Ambience fitted our entire office with new carpet flooring. Professional, on time and tidy.',
    rating: 5,
    role: 'Office manager',
  },
  {
    name: 'Aisha N.',
    text: 'My café now feels like the kind of place people want to stay in for hours. The lighting and colour choices are perfect.',
    rating: 4,
    role: 'Café owner',
  },
];

export default function Testimonials() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section className="py-24 lg:py-32">
      <div ref={ref} className="mx-auto max-w-7xl container-px">
        <div className={`flex flex-wrap items-end justify-between gap-6 ${visible ? 'animate-fade-up' : 'reveal'}`}>
          <div className="max-w-xl">
            <span className="eyebrow">Loved by clients</span>
            <h2 className="heading mt-4 text-4xl sm:text-5xl">Rated 4.4 by 4,423 Google reviews</h2>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-sand-100 px-6 py-4">
            <span className="font-serif text-4xl font-semibold text-ink-950">4.4</span>
            <div>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < 4 ? 'fill-clay-400 text-clay-400' : 'text-ink-300'}`}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-ink-500">4,423 reviews on Google</p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <figure
              key={r.name}
              className={`relative rounded-2xl bg-sand-100 p-8 ring-1 ring-ink-200/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${
                visible ? 'animate-fade-up opacity-0' : 'reveal'
              }`}
              style={{ animationDelay: `${i * 110}ms` }}
            >
              <Quote className="h-8 w-8 text-clay-300" />
              <blockquote className="mt-4 text-ink-800 leading-relaxed">"{r.text}"</blockquote>
              <figcaption className="mt-6 flex items-center justify-between">
                <div>
                  <p className="font-serif text-lg font-medium text-ink-950">{r.name}</p>
                  <p className="text-xs uppercase tracking-widest text-ink-500">{r.role}</p>
                </div>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`h-4 w-4 ${j < r.rating ? 'fill-clay-400 text-clay-400' : 'text-ink-300'}`}
                    />
                  ))}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
