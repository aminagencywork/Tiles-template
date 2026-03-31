import React, { useState } from 'react';
import { motion } from 'motion/react';
import { siteConfig } from '../config/siteConfig';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { getSupabase } from '../lib/supabase';

export function Contact() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');

    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([formData]);
      
      if (error) {
        console.error('Supabase error:', error);
        setFormState('error');
      } else {
        setFormState('success');
      }
    } else {
      // Mock success if Supabase is not configured
      setTimeout(() => setFormState('success'), 1500);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-marble-accent font-bold mb-4 block">Get In Touch</span>
          <h1 className="text-5xl md:text-7xl font-serif mb-8">Let's Discuss Your Project</h1>
          <p className="text-xl text-marble-ink/60 leading-relaxed">
            Whether you're an architect planning a commercial space or a homeowner renovating your kitchen, our team is here to help.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-serif mb-8">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-marble-ink text-white flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-bold mb-2 text-marble-accent">Address</h4>
                    <p className="text-marble-ink/70">{siteConfig.contact.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-marble-ink text-white flex items-center justify-center shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-bold mb-2 text-marble-accent">Phone</h4>
                    <p className="text-marble-ink/70">{siteConfig.contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-marble-ink text-white flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-bold mb-2 text-marble-accent">Email</h4>
                    <p className="text-marble-ink/70">{siteConfig.contact.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white border border-black/5">
              <h3 className="text-xl font-serif mb-4">Showroom Hours</h3>
              <ul className="space-y-2 text-sm text-marble-ink/60">
                <li className="flex justify-between"><span>Monday - Friday</span> <span>9:00 AM - 6:00 PM</span></li>
                <li className="flex justify-between"><span>Saturday</span> <span>10:00 AM - 4:00 PM</span></li>
                <li className="flex justify-between"><span>Sunday</span> <span>Closed</span></li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 shadow-sm border border-black/5">
            {formState === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-12"
              >
                <CheckCircle2 size={64} className="text-green-500 mb-6" />
                <h3 className="text-3xl font-serif mb-4">Message Sent</h3>
                <p className="text-marble-ink/60 mb-8">Thank you for reaching out. Our team will contact you within 24 hours.</p>
                <button 
                  onClick={() => setFormState('idle')}
                  className="text-xs uppercase tracking-widest font-bold border-b border-black pb-1 hover:text-marble-accent hover:border-marble-accent transition-all"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-marble-ink/40">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full border-b border-black/10 py-2 focus:border-marble-accent outline-none transition-colors bg-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-marble-ink/40">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full border-b border-black/10 py-2 focus:border-marble-accent outline-none transition-colors bg-transparent"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-marble-ink/40">Subject</label>
                  <input 
                    required
                    type="text" 
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    className="w-full border-b border-black/10 py-2 focus:border-marble-accent outline-none transition-colors bg-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-marble-ink/40">Message</label>
                  <textarea 
                    required
                    rows={6}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full border border-black/10 p-4 focus:border-marble-accent outline-none transition-colors bg-transparent resize-none"
                  />
                </div>
                <button 
                  disabled={formState === 'submitting'}
                  type="submit"
                  className="w-full bg-marble-ink text-white py-5 uppercase tracking-widest text-sm font-bold hover:bg-marble-accent transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {formState === 'submitting' ? 'Sending...' : (
                    <>
                      Send Message
                      <Send size={16} className="ml-2" />
                    </>
                  )}
                </button>
                {formState === 'error' && (
                  <p className="text-red-500 text-xs text-center">Something went wrong. Please try again later.</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
