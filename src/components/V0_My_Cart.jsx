"use client"

import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/Cart_context"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, isLoaded } = useCart()

  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 12.99
  const total = subtotal + shipping

  if (!isLoaded) {
    return (
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">Loading cart...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-serif mb-8">Shopping Cart</h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="hidden md:grid md:grid-cols-6 text-sm font-medium text-muted-foreground mb-4">
                  <div className="md:col-span-3">Product</div>
                  <div className="text-center">Price</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-right">Total</div>
                </div>
                <Separator className="mb-6 hidden md:block" />

                {cartItems.map((item) => (
                  <div key={item.id} className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                      <div className="md:col-span-3 flex items-center gap-4">
                        <div className="relative h-24 w-20 rounded overflow-hidden bg-muted/20 flex-shrink-0">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">Color: {item.color}</p>
                          <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                          <button
                            className="text-sm text-red-500 flex items-center gap-1 mt-2 md:hidden"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" /> Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-center md:text-center">${item.price.toFixed(2)}</div>
                      <div className="flex items-center justify-center">
                        <div className="flex border rounded">
                          <button
                            className="px-3 py-1 border-r"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-1">{item.quantity}</span>
                          <button
                            className="px-3 py-1 border-l"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end">
                        <span className="md:hidden">Total:</span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex justify-end mt-2 hidden md:flex">
                      <button
                        className="text-sm text-red-500 flex items-center gap-1"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" /> Remove
                      </button>
                    </div>
                    <Separator className="my-6" />
                  </div>
                ))}

                <div className="flex justify-between items-center">
                  <Link href="/shop" className="text-sm font-medium underline">
                    Continue Shopping
                  </Link>
                  <Button variant="outline">Update Cart</Button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between font-medium text-base">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="coupon" className="text-sm font-medium mb-1 block">
                      Coupon Code
                    </label>
                    <div className="flex gap-2">
                      <Input id="coupon" placeholder="Enter coupon" />
                      <Button variant="outline">Apply</Button>
                    </div>
                  </div>
                  <Button className="w-full bg-black hover:bg-gray-800 text-white">Proceed to Checkout</Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/shop">
              <Button className="bg-black hover:bg-gray-800 text-white">Continue Shopping</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}

