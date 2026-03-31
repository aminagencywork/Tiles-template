import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { siteConfig } from '../config/siteConfig';
import { cn } from '../lib/utils';
import { useCart } from '../lib/CartContext';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';

export function Products() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, isProductInCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products', err);
        // Fallback to siteConfig if API fails
        setProducts(siteConfig.products);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  if (loading) {
    return (
      <div className="pt-32 pb-24 px-6 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xs uppercase tracking-widest font-bold text-marble-ink/40">Loading Collection...</div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-marble-accent font-bold mb-4 block">Our Collection</span>
          <h1 className="text-5xl md:text-6xl font-serif mb-6">Natural Stone Gallery</h1>
          <p className="text-marble-ink/60">Explore our hand-picked selection of premium marble, granite, and travertine tiles.</p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button 
            onClick={() => setActiveCategory('all')}
            className={cn(
              "px-6 py-2 text-xs uppercase tracking-widest font-bold border transition-all",
              activeCategory === 'all' ? "bg-marble-ink text-white border-marble-ink" : "bg-transparent text-marble-ink border-black/10 hover:border-black"
            )}
          >
            All Materials
          </button>
          {siteConfig.categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-6 py-2 text-xs uppercase tracking-widest font-bold border transition-all",
                activeCategory === cat.id ? "bg-marble-ink text-white border-marble-ink" : "bg-transparent text-marble-ink border-black/10 hover:border-black"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {filteredProducts.map((product, idx) => (
            <motion.div 
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="group"
            >
              <div className="aspect-[4/5] overflow-hidden bg-white mb-3 relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-1.5 py-0.5 text-[7px] uppercase tracking-widest font-bold">
                  {product.category}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-start gap-1">
                  <h3 className="text-xs md:text-sm font-serif truncate flex-1">{product.name}</h3>
                  <span className="text-[9px] md:text-[10px] font-bold text-marble-accent whitespace-nowrap">{product.price}</span>
                </div>
                <p className="text-[8px] md:text-[9px] text-marble-ink/50 uppercase tracking-widest font-medium">{product.articleModel}</p>
              </div>
              <button 
                onClick={() => addToCart(product)}
                disabled={isProductInCart(product.id)}
                className={cn(
                  "mt-3 w-full py-1.5 border text-[8px] md:text-[9px] uppercase tracking-widest font-bold transition-all flex items-center justify-center space-x-1.5",
                  isProductInCart(product.id) 
                    ? "bg-green-50 border-green-200 text-green-600" 
                    : "border-black/10 hover:bg-marble-ink hover:text-white"
                )}
              >
                {isProductInCart(product.id) ? (
                  <>
                    <CheckCircle2 size={12} />
                    <span>In Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={12} />
                    <span>Order</span>
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
