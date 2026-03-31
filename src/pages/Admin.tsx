import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Upload, Trash2, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // New Product State
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'marble',
    price: '',
    articleModel: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const imageKitUrl = siteConfig.imageKit.urlEndpoint;

  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    if (token === 'admin-token-mock') {
      setIsLoggedIn(true);
      fetchProducts();
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('admin-token', data.token);
        setIsLoggedIn(true);
        fetchProducts();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    setIsLoggedIn(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let imageUrl = newProduct.image;

      // Upload image if file is selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadData.imageUrl) {
          imageUrl = uploadData.imageUrl;
        } else {
          throw new Error('Image upload failed');
        }
      }

      if (!imageUrl) {
        throw new Error('Please provide an image or upload one');
      }

      const productData = { ...newProduct, image: imageUrl };
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        setSuccess('Product added successfully!');
        setNewProduct({
          name: '',
          category: 'marble',
          price: '',
          articleModel: '',
          image: ''
        });
        setImageFile(null);
        setImagePreview(null);
        fetchProducts();
      } else {
        throw new Error('Failed to add product');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-marble-bg px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-black/5"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif mb-2">Admin Login</h1>
            <p className="text-marble-ink/60 text-sm">Enter password to access the panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold mb-2 text-marble-ink/40">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-marble-bg border border-black/10 rounded-lg px-4 py-3 outline-none focus:border-marble-accent transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-marble-ink text-white py-4 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-marble-accent transition-colors"
            >
              Sign In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-marble-bg pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-serif mb-2">Admin Panel</h1>
            <p className="text-marble-ink/60">Manage your product catalog</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-marble-ink/40 hover:text-red-500 transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Add Product Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-black/5 sticky top-32">
              <h2 className="text-xl font-serif mb-6 flex items-center space-x-2">
                <Plus size={20} />
                <span>Add New Product</span>
              </h2>

              <form onSubmit={handleAddProduct} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 text-marble-ink/40">Product Name</label>
                  <input 
                    type="text" 
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full bg-marble-bg border border-black/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-marble-accent transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 text-marble-ink/40">Category</label>
                    <select 
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full bg-marble-bg border border-black/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-marble-accent transition-colors"
                    >
                      {siteConfig.categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 text-marble-ink/40">Price (₹/sqft)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-marble-ink/40 text-xs">₹</span>
                      <input 
                        type="number" 
                        value={newProduct.price.replace(/[^0-9.]/g, '')}
                        onChange={(e) => setNewProduct({...newProduct, price: `₹${e.target.value}/sqft`})}
                        placeholder="0"
                        className="w-full bg-marble-bg border border-black/10 rounded-lg pl-7 pr-12 py-2 text-sm outline-none focus:border-marble-accent transition-colors"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-marble-ink/40 text-[10px] uppercase tracking-widest">/sqft</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 text-marble-ink/40">Article / Box Model</label>
                  <input 
                    type="text" 
                    value={newProduct.articleModel}
                    onChange={(e) => setNewProduct({...newProduct, articleModel: e.target.value})}
                    placeholder="e.g. ART-123 / BOX-A"
                    className="w-full bg-marble-bg border border-black/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-marble-accent transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 text-marble-ink/40">Product Image</label>
                  <div className="space-y-4">
                    <div 
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="border-2 border-dashed border-black/10 rounded-xl p-8 text-center cursor-pointer hover:border-marble-accent transition-colors overflow-hidden relative group"
                    >
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                      ) : null}
                      <div className="relative z-10">
                        <Upload className="mx-auto mb-2 text-marble-ink/40" />
                        <p className="text-[10px] uppercase tracking-widest font-bold text-marble-ink/40">Click to upload image</p>
                      </div>
                      <input 
                        id="image-upload"
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                    <div className="text-center text-[10px] text-marble-ink/40 uppercase tracking-widest">OR</div>
                    <input 
                      type="text" 
                      placeholder="Image URL"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                      className="w-full bg-marble-bg border border-black/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-marble-accent transition-colors"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-red-500 text-[10px] bg-red-50 p-2 rounded-lg uppercase tracking-widest">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-center space-x-2 text-green-600 text-[10px] bg-green-50 p-2 rounded-lg uppercase tracking-widest">
                    <CheckCircle2 size={14} />
                    <span>{success}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-marble-ink text-white py-3 rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-marble-accent transition-colors disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Product'}
                </button>
              </form>
            </div>
          </div>

          {/* Product List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-black/5 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-marble-bg border-b border-black/5">
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-marble-ink/40">Product</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-marble-ink/40">Article/Model</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-marble-ink/40">Category</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-marble-ink/40">Price</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-marble-ink/40">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-marble-bg/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                          <span className="text-sm font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-marble-ink/60">{product.articleModel}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs uppercase tracking-widest font-medium text-marble-ink/60">{product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-serif">{product.price}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-marble-ink/20 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
