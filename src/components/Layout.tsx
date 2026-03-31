import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, User, ShoppingBag, MessageCircle, Trash2 } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { cn } from '../lib/utils';
import { useCart } from '../lib/CartContext';
import { motion, AnimatePresence } from 'motion/react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { cart } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      scrolled ? "bg-white/80 backdrop-blur-md border-b border-black/5 py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-serif font-bold tracking-tighter">
          {siteConfig.name.toUpperCase()}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm uppercase tracking-widest font-medium transition-colors hover:text-marble-accent",
                location.pathname === link.path ? "text-marble-accent" : "text-marble-ink"
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center space-x-6 border-l border-black/10 pl-6">
            <Link 
              to="/admin" 
              className="text-marble-ink hover:text-marble-accent transition-colors"
              title="Admin Login"
            >
              <User size={20} />
            </Link>
            <div className="relative group">
              <ShoppingBag size={20} className="text-marble-ink" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-marble-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center space-x-4 md:hidden">
          <Link to="/admin" className="text-marble-ink">
            <User size={20} />
          </Link>
          <div className="relative">
            <ShoppingBag size={20} className="text-marble-ink" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-marble-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </div>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-black/5 p-6 space-y-4 animate-in fade-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block text-lg font-serif"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export function WhatsAppButton() {
  const { cart, removeFromCart } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;

    const message = `${siteConfig.whatsapp.message}\n\n` + 
      cart.map((p, i) => `${i + 1}. ${p.name} (${p.category}) - ${p.price}\nImage: ${window.location.origin}${p.image}`).join('\n\n');
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${siteConfig.whatsapp.number}?text=${encodedMessage}`, '_blank');
  };

  if (cart.length === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end space-y-4">
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl border border-black/5 w-80 overflow-hidden mb-2"
          >
            <div className="bg-marble-ink text-white p-4 flex justify-between items-center">
              <h3 className="text-xs uppercase tracking-widest font-bold">Your Selection ({cart.length})</h3>
              <button onClick={() => setIsExpanded(false)} className="hover:text-marble-accent transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto p-4 space-y-4">
              {cart.map((product) => (
                <div key={product.id} className="flex items-center space-x-4 group">
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-serif truncate">{product.name}</h4>
                    <p className="text-[10px] text-marble-ink/50 uppercase tracking-widest">{product.category}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(product.id)}
                    className="text-marble-ink/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-black/5">
              <button 
                onClick={handleWhatsAppOrder}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle size={16} />
                <span>Order via WhatsApp</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-colors relative group"
      >
        <MessageCircle size={28} />
        <span className="absolute -top-2 -right-2 bg-marble-accent text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
          {cart.length}
        </span>
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-marble-ink px-4 py-2 rounded-lg shadow-xl border border-black/5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <p className="text-[10px] uppercase tracking-widest font-bold">Complete Order on WhatsApp</p>
        </div>
      </motion.button>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-marble-ink text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-2xl font-serif mb-6">{siteConfig.name}</h3>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Providing premium natural stone solutions for architects, designers, and homeowners worldwide.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest font-bold mb-6 text-white/40">Contact</h4>
          <address className="not-italic text-sm space-y-2 text-white/80">
            <p>{siteConfig.contact.address}</p>
            <p>{siteConfig.contact.phone}</p>
            <p>{siteConfig.contact.email}</p>
          </address>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest font-bold mb-6 text-white/40">Newsletter</h4>
          <div className="flex border-b border-white/20 pb-2">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-transparent border-none outline-none flex-1 text-sm"
            />
            <button className="hover:text-marble-accent transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-white/40">
        <p>© 2026 {siteConfig.name}. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
