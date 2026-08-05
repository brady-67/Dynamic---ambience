import { ArrowUpRight } from 'lucide-react';
import { useReveal } from '@/lib/useReveal';

interface Project {
  title: string;
  category: string;
  image: string;
  span: string;
}

const projects: Project[] = [
  {
    title: 'Serene Living Room',
    category: 'Residential',
    image:
      'https://images.pexels.com/photos/29012619/pexels-photo-29012619.jpeg?auto=compress&cs=tinysrgb&w=1200',
    span: 'lg:col-span-2 lg:row-span-2',
  },
  {
    title: 'Modern Office Floor',
    category: 'Commercial',
    image:
      'https://images.pexels.com/photos/6794970/pexels-photo-6794970.jpeg?auto=compress&cs=tinysrgb&w=900',
    span: '',
  },
  {
    title: 'Warm Café Nook',
    category: 'Hospitality',
    image:
      'https://images.pexels.com/photos/2079452/pexels-photo-2079452.jpeg?auto=compress&cs=tinysrgb&w=900',
    span: '',
  },
  {
    title: 'Luxe Bedroom Suite',
    category: 'Residential',
    image:
      'https://images.pexels.com/photos/8135118/pexels-photo-8135118.jpeg?auto=compress&cs=tinysrgb&w=900',
    span: '',
  },
  {
    title: 'Conference Room',
    category: 'Commercial',
    image:
      'https://images.pexels.com/photos/7511754/pexels-photo-7511754.jpeg?auto=compress&cs=tinysrgb&w=900',
    span: '',
  },
];

export default function Portfolio() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section id="portfolio" className="py-24 lg:py-32">
      <div ref={ref} className="mx-auto max-w-7xl container-px">
        <div className={`flex flex-wrap items-end justify-between gap-6 ${visible ? 'animate-fade-up' : 'reveal'}`}>
          <div className="max-w-xl">
            <span className="eyebrow">Selected work</span>
            <h2 className="heading mt-4 text-4xl sm:text-5xl">A portfolio of warm, lived-in spaces</h2>
          </div>
          <p className="max-w-sm text-ink-600">
            A glimpse of recent residential, office and café projects delivered across Nairobi and
            beyond.
          </p>
        </div>

        <div className="mt-12 grid auto-rows-[240px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <a
              key={p.title}
              href="#contact"
              className={`group relative overflow-hidden rounded-2xl ${p.span} ${
                visible ? 'animate-scale-in opacity-0' : 'reveal'
              }`}
              style={{ animationDelay: `${i * 110}ms` }}
            >
              <img
                src={p.image}
                alt={p.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-6">
                <div className="translate-y-1 transition-transform duration-500 group-hover:translate-y-0">
                  <span className="text-xs uppercase tracking-widest text-clay-300">{p.category}</span>
                  <h3 className="mt-1 font-serif text-2xl text-sand-50">{p.title}</h3>
                </div>
                <span className="grid h-10 w-10 shrink-0 translate-y-2 place-items-center rounded-full bg-sand-50/15 text-sand-50 opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:bg-clay-500 group-hover:opacity-100">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
