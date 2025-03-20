"use client"

import postService from "@/services/postService";
import { createContext, useContext, useState, useEffect } from "react"


const CartContext = createContext(undefined)

export function CartProvider({ children }) {
    const [mycart, setmycart] = useState([]);
    const cartCount = mycart.length;
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false)
  
    useEffect(() => {
        const fetchMycart = async () => {
          try {
            const response = await postService.getMyCarts();
            setmycart(response.data.mycart);
            setIsLoaded(true)
            setError(null);
          } catch (error) {
            setError("No Cart items found.");
          }
        };
        fetchMycart();
      }, []);

  return (
    <CartContext.Provider
    value={{
        mycart, cartCount, setmycart, isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }

  return context
}

