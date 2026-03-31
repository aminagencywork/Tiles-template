import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Upload, Trash2, LogOut, CheckCircle2, AlertCircle, ArrowUpDown } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { cn } from '../lib/utils';

export function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');

  // New Product State
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'marble',
    brand: '', // New field
    price: '',
    articleModel: '',
    image: ''
  });
  const [customCategory, setCustomCategory] = useState(''); // For "Other" category
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

  const handleDeleteProduct = async (id: number | string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    console.log('Attempting to delete product with ID:', id);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Product deleted successfully');
        fetchProducts();
      } else {
        setError(data.error || 'Failed to delete product');
        console.error('Delete failed:', data);
      }
    } catch (err) {
      setError('An error occurred during deletion');
      console.error('Delete error:', err);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const displayProducts = products
    .filter(product => {
      const categoryMatch = filterCategory === 'all' || product.category === filterCategory;
      const brandMatch = filterBrand === 'all' || product.brand === filterBrand;
      return categoryMatch && brandMatch;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      
      const aValue = (a[key] || '').toString().toLowerCase();
      const bValue = (b[key] || '').toString().toLowerCase();

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

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

      const finalCategory = newProduct.category === 'other' ? customCategory : newProduct.category;
      if (!finalCategory) throw new Error('Please provide a category');

      const productData = { 
        ...newProduct, 
        category: finalCategory, 
        image: imageUrl 
      };
      
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
          brand: '',
          price: '',
          articleModel: '',
          image: ''
        });
        setCustomCategory('');
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif mb-2">Admin Panel</h1>
            <p className="text-marble-ink/60">Manage your product catalog</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="flex-1 md:flex-none relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-white text-marble-ink border border-black/10 rounded px-4 py-2 text-[10px] uppercase tracking-widest font-bold focus:border-marble-accent outline-none cursor-pointer"
              >
                <option value="all">All categories</option>
                {Array.from(new Set(products.map(p => p.category))).sort().map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 md:flex-none relative">
              <select
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="w-full appearance-none bg-white text-marble-ink border border-black/10 rounded px-4 py-2 text-[10px] uppercase tracking-widest font-bold focus:border-marble-accent outline-none cursor-pointer"
              >
                <option value="all">All Brands</option>
                {Array.from(new Set(products.map(p => p.brand).filter(Boolean))).sort().map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-marble-ink/40 hover:text-red-500 transition-colors ml-auto md:ml-4"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
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
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full bg-marble-bg border border-black/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-marble-accent transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 text-marble-ink/40">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full bg-marble-bg border border-black/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-marble-accent transition-colors"
                    >
                      {siteConfig.categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                      <option value="other">Other / Add New</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 text-marble-ink/40">Brand</label>
                    <input
                      type="text"
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                      placeholder="e.g. Somany, Kajaria"
                      className="w-full bg-marble-bg border border-black/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-marble-accent transition-colors"
                      required
                    />
                  </div>
                </div>

                {newProduct.category === 'other' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 text-marble-ink/40">Custom Category Name</label>
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Enter new category name"
                      className="w-full bg-marble-bg border border-black/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-marble-accent transition-colors"
                      required
                    />
                  </motion.div>
                )}

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 text-marble-ink/40">Price (₹/sqft)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-marble-ink/40 text-xs">₹</span>
                    <input
                      type="number"
                      value={newProduct.price.replace(/[^0-9.]/g, '')}
                      onChange={(e) => setNewProduct({ ...newProduct, price: `₹${e.target.value}/sqft` })}
                      placeholder="0"
                      className="w-full bg-marble-bg border border-black/10 rounded-lg pl-7 pr-12 py-2 text-sm outline-none focus:border-marble-accent transition-colors"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-marble-ink/40 text-[10px] uppercase tracking-widest">/sqft</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 text-marble-ink/40">Article / Box Model</label>
                  <input
                    type="text"
                    value={newProduct.articleModel}
                    onChange={(e) => setNewProduct({ ...newProduct, articleModel: e.target.value })}
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
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
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
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-marble-ink/40">
                      <button onClick={() => handleSort('name')} className="flex items-center space-x-1 hover:text-marble-ink transition-colors">
                        <span>Product</span>
                        <ArrowUpDown size={10} />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-marble-ink/40">Article/Model</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-marble-ink/40">
                      <button onClick={() => handleSort('category')} className="flex items-center space-x-1 hover:text-marble-ink transition-colors">
                        <span>Category</span>
                        <ArrowUpDown size={10} />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-marble-ink/40">
                       <button onClick={() => handleSort('brand')} className="flex items-center space-x-1 hover:text-marble-ink transition-colors">
                        <span>Brand</span>
                        <ArrowUpDown size={10} />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-marble-ink/40">Price</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-marble-ink/40">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {displayProducts.map((product) => (
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
                        <span className="text-xs uppercase tracking-widest font-medium text-marble-ink/60">{product.brand || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-serif">{product.price}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-marble-ink/20 hover:text-red-500 transition-colors"
                        >
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
