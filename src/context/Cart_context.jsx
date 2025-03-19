"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Sample cart data - in a real app, this would come from an API or localStorage
const initialCartItems = [
  {
    id: 1,
    name: "Wool Blend Coat",
    price: 129.99,
    quantity: 1,
    image: "/placeholder.svg?height=120&width=100",
    color: "Beige",
    size: "M",
  },
  {
    id: 2,
    name: "Cashmere Sweater",
    price: 89.99,
    quantity: 2,
    image: "/placeholder.svg?height=120&width=100",
    color: "Gray",
    size: "L",
  },
]

const CartContext = createContext(undefined)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize cart on client-side only
  useEffect(() => {
    // In a real app, you would fetch from localStorage or an API
    setCartItems(initialCartItems)
    setIsLoaded(true)
  }, [])

  // Get total number of items in cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        // Add new item
        return [...prevItems, { ...product, quantity }]
      }
    })
  }

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return

    setCartItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isLoaded,
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

