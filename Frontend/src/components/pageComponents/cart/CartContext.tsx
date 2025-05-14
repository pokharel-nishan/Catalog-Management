import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import type { Book } from "../../../types/book";
import apiClient from "../../../api/config";
import { useAuth } from "../../../context/AuthContext";

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
  clearCart: () => Promise<void>;
  fetchCartItems: (forceSync?: boolean) => Promise<void>; // Add forceSync parameter
  syncCart: () => Promise<void>; // New method for manual sync
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;

  const getAuthToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

  const fetchCartItems = async (forceSync: boolean = false) => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        setItems([]);
        return;
      }

      const response = await apiClient.get("/Cart/cart-items", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const cartItems: CartItem[] = response.data.items.map((item: any) => ({
          id: item.bookId,
          bookId: item.bookId,
          title: item.bookTitle,
          price: item.price || 0,
          imageURL: item.imageUrl || "/default-image.png",
          discount: item.discount || 0,
          quantity: item.quantity,
          inStock: true,
        }));
        // Only update items if forceSync is true or items are empty
        if (forceSync || items.length === 0) {
          setItems(cartItems);
        }
      } else {
        throw new Error("Failed to fetch cart items");
      }
    } catch (error: any) {
      console.error("Failed to fetch cart items:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
        setItems([]);
      } else {
        toast.error("Failed to load cart items!");
        setItems([]);
      }
    }
  };

  // New method to force a full sync with the backend
  const syncCart = async () => {
    await fetchCartItems(true);
  };

  useEffect(() => {
    fetchCartItems(); // Initial fetch on authentication change
  }, [isAuthenticated]);

  const addToCart = async (book: Book) => {
    if (!isAuthenticated) {
      toast.error("Please log in to add to cart!");
      return;
    }

    try {
      const token = getAuthToken();
      const bookId = book.bookId || book.id;
      const response = await apiClient.post(
        `/Cart/add-to-cart/${bookId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Added to cart");
        await fetchCartItems(true); // Force sync after adding
      } else {
        throw new Error(response.data.message || "Failed to add to cart");
      }
    } catch (error: any) {
      console.error("Failed to add to cart:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
      } else {
        toast.error("Failed to add to cart. Please try again!");
      }
    }
  };

  const removeFromCart = async (bookId: string) => {
    if (!isAuthenticated) {
      toast.error("Please log in to remove from cart!");
      return;
    }

    try {
      const token = getAuthToken();
      const response = await apiClient.delete(`/Cart/remove-item/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success("Removed from cart");
        await fetchCartItems(true); // Force sync after removing
      } else {
        throw new Error(response.data.message || "Failed to remove from cart");
      }
    } catch (error: any) {
      console.error("Failed to remove from cart:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
      } else {
        toast.error("Failed to remove from cart. Please try again!");
      }
    }
  };

  const updateQuantity = async (bookId: string, quantity: number) => {
    if (!isAuthenticated || quantity < 1) return;

    try {
      const token = getAuthToken();
      const response = await apiClient.put(
        `/Cart/update-quantity/${bookId}/${quantity}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        await fetchCartItems(true); // Force sync after updating
      } else {
        throw new Error(response.data.message || "Failed to update quantity");
      }
    } catch (error: any) {
      console.error("Failed to update quantity:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
      } else {
        toast.error("Failed to update quantity. Please try again!");
      }
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to clear the cart!");
      return;
    }

    if (items.length === 0) {
      console.log("Cart is already empty, no need to clear");
      setItems([]);
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Session expired. Please log in again.");
        logout();
        return;
      }

      console.log("Sending clear cart request with token:", token);

      const response = await apiClient.post(
        "/Cart/clear",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Clear cart response:", response.data);

      if (response.data.success) {
        setItems([]);
        await fetchCartItems(true); // Force sync after clearing
        console.log("Cart cleared successfully");
      } else {
        console.warn("Backend reported failure in clearing cart:", response.data.message);
        toast.error(response.data.message || "Failed to clear cart");
      }
    } catch (error: any) {
      console.error("Failed to clear cart (API error):", error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
      } else if (error.response?.status === 400 && error.response?.data?.message?.includes("empty")) {
        await fetchCartItems(true); // Force sync after empty cart
        console.log("Cart was already empty, clearing frontend state");
      } else {
        toast.error(error.response?.data?.message || "Failed to clear cart. Please try again!");
      }
    }
  };

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      const discountedPrice =
        item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
      return sum + discountedPrice * item.quantity;
    }, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        total,
        isCartOpen,
        setIsCartOpen,
        clearCart,
        fetchCartItems,
        syncCart, 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};