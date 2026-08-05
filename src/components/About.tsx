import { Check } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';

const aboutImage =
  'https://images.pexels.com/photos/7546323/pexels-photo-7546323.jpeg?auto=compress&cs=tinysrgb&w=1200';
const points = [
  'Residential, commercial & café specialists',
  'Bespoke colour, lighting & material palettes',
  'Carpet & flooring supply and installation',
  'Project management from concept to handover',
];

export default function About() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section id="about" className="relative py-24 lg:py-32">
      <div ref={ref} className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 container-px">
        <div className={`relative ${visible ? 'animate-fade-up' : 'reveal'}`}>
          <div className="relative overflow-hidden rounded-[2rem]">
            <img
              src={aboutImage}
              alt="Stylish modern living room designed by Dynamic Ambience"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-2 hidden rounded-2xl bg-ink-950 px-7 py-6 text-sand-50 shadow-2xl sm:block">
            <p className="font-serif text-4xl font-semibold">8+</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-sand-200">Years of craft</p>
          </div>
          <div className="absolute -left-4 -top-4 -z-10 h-40 w-40 rounded-full bg-clay-200/60 blur-2xl" />
        </div>

        <div className={visible ? 'animate-fade-up [animation-delay:160ms] opacity-0' : 'reveal'}>
          <span className="eyebrow">Who we are</span>
          <h2 className="heading mt-4 text-4xl sm:text-5xl">
            A Kenya-based studio for warm, considered interiors
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-700">
            Dynamic-Ke is a Kenya-based interior design firm specialising in transforming
            residential spaces, commercial offices and cafés into warm, stylish environments
            tailored to client satisfaction. From the first mood board to the final carpet tile, we
            handle every detail so your space tells your story.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sage-200 text-sage-700">
                  <Check className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-ink-800">{p}</span>
              </li>
            ))}
          </ul>
          <a href="#services" className="btn-outline mt-10">
            Explore our services
          </a>
        </div>
      </div>
    </section>
  );
}
