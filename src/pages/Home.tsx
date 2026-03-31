import React from 'react';
import { motion } from 'motion/react';
import { siteConfig } from '../config/siteConfig';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function Home() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={siteConfig.hero.slides[0].image} 
            alt="Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-start text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-serif mb-6 leading-tight"
          >
            {siteConfig.hero.slides[0].title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl max-w-2xl mb-10 font-light opacity-90"
          >
            {siteConfig.hero.slides[0].subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link 
              to="/products" 
              className="bg-white text-marble-ink px-8 py-4 uppercase tracking-widest text-sm font-bold hover:bg-marble-accent hover:text-white transition-all inline-flex items-center group"
            >
              Explore Collection
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-marble-accent font-bold mb-4 block">Our Materials</span>
              <h2 className="text-4xl md:text-5xl font-serif">Curated Collections</h2>
            </div>
            <Link to="/products" className="text-sm uppercase tracking-widest font-bold border-b border-black pb-1 mt-6 md:mt-0 hover:text-marble-accent hover:border-marble-accent transition-all">
              View All Products
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {siteConfig.categories.map((cat, idx) => (
              <motion.div 
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative aspect-[3/4] overflow-hidden cursor-pointer"
              >
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg md:text-xl font-serif mb-1">{cat.name}</h3>
                  <span className="text-[8px] uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">Discover More</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 px-6 bg-marble-bg overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-square bg-marble-accent/10 absolute -top-8 -left-8 w-full h-full -z-10" />
            <img 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200" 
              alt="Showroom" 
              className="w-full aspect-square object-cover shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-marble-accent font-bold mb-4 block">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">Crafting Spaces with Natural Perfection</h2>
            <p className="text-lg text-marble-ink/70 mb-8 leading-relaxed">
              For over three decades, Luxe Marble has been the premier destination for the world's finest natural stones. We source directly from quarries in Italy, Greece, and Brazil to ensure unparalleled quality for your architectural masterpieces.
            </p>
            <Link to="/about" className="inline-flex items-center text-sm uppercase tracking-widest font-bold group">
              Learn Our History
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 text-center bg-marble-ink text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-serif mb-8">Ready to transform your space?</h2>
          <p className="text-white/60 mb-12 text-lg">Contact our design consultants for a personalized consultation and quote.</p>
          <Link 
            to="/contact" 
            className="border border-white/30 px-10 py-5 uppercase tracking-widest text-sm font-bold hover:bg-white hover:text-marble-ink transition-all"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
