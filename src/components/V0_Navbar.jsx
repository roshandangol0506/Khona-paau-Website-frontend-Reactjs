"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { User, ShoppingCart, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./V0_Theme_Toggle";
import postService from "@/services/postService";
import { useCart } from "@/context/Cart_context";
import { usePathname, useRouter } from "next/navigation";
import { useGeneralSetting } from "@/context/general_setting";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [cartitems, setcartitems] = useState(0);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { logoPreview } = useGeneralSetting();

  const { cartCount, isLoaded } = useCart();

  const pathname = usePathname();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavigation = async (sectionId) => {
    if (pathname === "/") {
      scrollToSection(sectionId);
    } else {
      router.push("/");
      scrollToSection(sectionId);
    }
  };

  useEffect(() => {
    fetch("http://localhost:8001/api/checkAuth", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isAuthenticated) {
          setUser({
            userId: data.userId,
            username: data.username,
            email: data.email,
            profile: data.profile ? data.profile : null,
          });
          setIsLoading(false);
        }
      });
  }, [router]);

  const fetchuserlogout = async () => {
    try {
      await postService.getuserlogout();
      window.location.reload();
    } catch (error) {
      if (error.response) {
        setError(
          `Server Error: ${error.response.status} - ${
            error.response.data.message || "Something went wrong"
          }`
        );
      } else if (error.request) {
        setError(
          "Network error: Unable to reach the server. Please try again."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <header className="sticky top-0 pb-3 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link
            href="/"
            className="font-serif text-2xl font-bold tracking-tight"
          >
            {logoPreview && (
              <img src={logoPreview} alt="Khokan Paau" className="h-10" />
            )}
          </Link>
          <nav className="hidden md:flex gap-6">
            <button
              onClick={() => handleNavigation("home")}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              HOME
            </button>
            <button
              onClick={() => handleNavigation("about")}
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
          <Link
            href="/wishlist"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            WISHLIST (0)
          </Link>
          <Link
            href="/v0_mycart"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            CART ({isLoaded ? cartCount : 0})
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-muted flex flex-col items-center">
                  {user.profile && (
                    <img
                      src={`http://localhost:8001/gmailprofile/${user.profile}`}
                      alt="User Logo"
                      className="rounded-full h-7 w-7"
                    />
                  )}
                  <p className="text-sm font-medium transition-colors hover:text-primary">
                    {user.username}
                  </p>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <Link href="/v0_mycart">My Cart</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <Link href="/checkout">Checkout</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span onClick={() => fetchuserlogout()}>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/user_login"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Login
            </Link>
          )}
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
          <ThemeToggle />
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden p-4 pt-0 pb-4 border-b">
          <nav className="flex flex-col space-y-3">
            <button
              onClick={() => {
                scrollToSection("home");
                setIsOpen(false);
              }}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              HOME
            </button>
            <button
              onClick={() => {
                scrollToSection("shop");
                setIsOpen(false);
              }}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              SHOP
            </button>
            <button
              onClick={() => {
                scrollToSection("blog");
                setIsOpen(false);
              }}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              BLOG
            </button>
            <button
              onClick={() => {
                scrollToSection("pages");
                setIsOpen(false);
              }}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              PAGES
            </button>
            <button
              onClick={() => {
                scrollToSection("blog");
                setIsOpen(false);
              }}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              BLOG
            </button>
            <button
              onClick={() => {
                scrollToSection("contact");
                setIsOpen(false);
              }}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              CONTACT
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
