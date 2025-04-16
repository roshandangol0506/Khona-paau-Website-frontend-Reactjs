"use client";

import postService from "@/services/postService";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [mycart, setmycart] = useState([]);
  const cartCount = mycart.length;
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchMycart = async () => {
    try {
      const response = await postService.getMyCarts();
      setmycart(response.data.mycart || []);
    } catch (error) {
      setError("No Cart items found.");
    } finally {
      setIsLoaded(true);
    }
  };
  useEffect(() => {
    fetchMycart();
  }, []);

  return (
    <CartContext.Provider
      value={{ mycart, cartCount, setmycart, fetchMycart, isLoaded, error }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
