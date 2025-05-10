import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import type { Book } from '../../../types/book';

interface CartItem extends Book {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (book: Book) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === book.id);
      
      if (existingItem) {
        toast.success('Quantity updated in cart');
        return currentItems.map(item =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      toast.success('Added to cart');
      return [...currentItems, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== bookId));
    toast.success('Removed from cart');
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const total = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      total,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};