import React from 'react';
import { motion } from 'motion/react';
import { siteConfig } from '../config/siteConfig';
import { Award, ShieldCheck, Globe, Truck } from 'lucide-react';

export function About() {
  const features = [
    { icon: <Award size={32} />, title: "Premium Quality", desc: "Hand-selected slabs from the world's most prestigious quarries." },
    { icon: <ShieldCheck size={32} />, title: "Expert Craftsmanship", desc: "Precision cutting and finishing by master stone artisans." },
    { icon: <Globe size={32} />, title: "Global Sourcing", desc: "Direct relationships with quarries in 12 different countries." },
    { icon: <Truck size={32} />, title: "Secure Logistics", desc: "Specialized handling and delivery for fragile stone materials." }
  ];

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-marble-accent font-bold mb-4 block">Our Heritage</span>
          <h1 className="text-5xl md:text-7xl font-serif mb-8">Legacy of Stone</h1>
          <p className="text-xl text-marble-ink/60 leading-relaxed">
            Founded in 1994, Luxe Marble began with a single mission: to bring the earth's most beautiful natural creations into the homes of those who appreciate timeless luxury.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <div className="space-y-8">
            <h2 className="text-4xl font-serif leading-tight">Uncompromising Standards in Every Detail</h2>
            <p className="text-marble-ink/70 leading-relaxed">
              Every block of marble we acquire is inspected by our experts at the source. We look for the perfect balance of color, veining, and structural integrity. Our process ensures that only the top 5% of extracted stone makes it into our gallery.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div>
                <span className="text-4xl font-serif block mb-2">30+</span>
                <span className="text-xs uppercase tracking-widest text-marble-accent font-bold">Years Experience</span>
              </div>
              <div>
                <span className="text-4xl font-serif block mb-2">500+</span>
                <span className="text-xs uppercase tracking-widest text-marble-accent font-bold">Projects Completed</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=1200" 
              alt="Stone Workshop" 
              className="w-full aspect-[4/5] object-cover shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-32">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-8 bg-white border border-black/5 hover:border-marble-accent transition-colors"
            >
              <div className="text-marble-accent mb-6 flex justify-center">{f.icon}</div>
              <h3 className="text-lg font-serif mb-4">{f.title}</h3>
              <p className="text-sm text-marble-ink/60 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-white p-12 md:p-24 text-center border border-black/5">
          <h2 className="text-3xl md:text-5xl font-serif mb-12">Visit Our Showroom</h2>
          <div className="aspect-video w-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
            <iframe 
              src={siteConfig.contact.mapUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
              title="Showroom Location"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
