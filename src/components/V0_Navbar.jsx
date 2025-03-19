"use client"

import Link from "next/link"
import { useState } from "react"
import { User, ShoppingCart, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "./V0_Theme_Toggle"
import postService from "@/services/postService"
import { useCart } from "@/context/Cart_context"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [cartitems, setcartitems]= useState(0);

  const { cartCount, isLoaded } = useCart()

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const fetchuserlogout = async () => {
    try {
      await postService.getuserlogout(); 
      window.location.reload();
      } catch (error) {
        if (error.response) {
        setError(`Server Error: ${error.response.status} - ${error.response.data.message || "Something went wrong"}`);
        } else if (error.request) {
          setError("Network error: Unable to reach the server. Please try again.");
        } else {
          setError("An unexpected error occurred.");
        }
      }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
            Khokan Paau
          </Link>
          <nav className="hidden md:flex gap-6">
            <button
              onClick={() => scrollToSection("home")}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              HOME
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              ABOUT US
            </button>
            <button
              onClick={() => scrollToSection("product")}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              PRODUCT
            </button>
            <button
              onClick={() => scrollToSection("review")}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              REVIEW
            </button>
            <button
              onClick={() => scrollToSection("photos")}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              PHOTOS
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              CONTACT
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/wishlist" className="text-sm font-medium transition-colors hover:text-primary">
            WISHLIST (0)
          </Link>
          <Link href="/mycart" className="text-sm font-medium transition-colors hover:text-primary">
          CART ({isLoaded ? cartCount : 0})
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full hover:bg-muted">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <ShoppingCart className="mr-2 h-4 w-4" />
                <Link href="/mycart">My Cart</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ShoppingCart className="mr-2 h-4 w-4" />
                <Link href="/checkout">Checkout</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span onClick={()=>fetchuserlogout()}>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
          <ThemeToggle/>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden p-4 pt-0 pb-4 border-b">
          <nav className="flex flex-col space-y-3">
            <button
              onClick={() => {
                scrollToSection("home")
                setIsOpen(false)
              }}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              HOME
            </button>
            <button
              onClick={() => {
                scrollToSection("shop")
                setIsOpen(false)
              }}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              SHOP
            </button>
            <button
              onClick={() => {
                scrollToSection("blog")
                setIsOpen(false)
              }}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              BLOG
            </button>
            <button
              onClick={() => {
                scrollToSection("pages")
                setIsOpen(false)
              }}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              PAGES
            </button>
            <button
              onClick={() => {
                scrollToSection("blog")
                setIsOpen(false)
              }}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              BLOG
            </button>
            <button
              onClick={() => {
                scrollToSection("contact")
                setIsOpen(false)
              }}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              CONTACT
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}

