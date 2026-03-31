import React, { createContext, useContext, useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  articleModel: string;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  isProductInCart: (productId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('marble-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('marble-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const isProductInCart = (productId: number) => {
    return cart.some((p) => p.id === productId);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isProductInCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
