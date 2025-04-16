"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import postService from "@/services/postService"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useCart } from "@/context/Cart_context"

export default function ProductCarousel() {
  const {mycart, setmycart}= useCart()
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef(null)
  const [products, setproducts] = useState([]);
  const maxIndex = Math.max(0, products.length - 3)
  const [userid, setUserid]=useState(null);
  const[productid, setProductid]=useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); 
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
      
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await postService.getvisibleProducts();
      setproducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
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
            id: data.userId,
            username: data.username,
            email: data.email,
          });
        }
      });
  }, [router]);

  const handleAddToCart = async (productId) => {
    if (!user) {
      router.push("/user_login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8001/uploadmycart", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service_id: productId, user_id: user.id }),
      });

      if (!response.ok) throw new Error("Failed to upload My Cart");

      // ✅ Update Cart State Immediately
      setmycart((prevCart) => [...prevCart, { service_id: productId, user_id: user.id }]);

      toast("Product added to cart", {
        description: new Date().toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        action: {
          label: "Undo",
          onClick: () => handleDeleteFromCart(productId, user.id),
        },
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleDeleteFromCart = async (serviceId, userId) => {
    try {
      const response = await fetch("http://localhost:8001/deletefromcart", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, userId }),
      });

      if (!response.ok) throw new Error("Failed to delete product");

      // ✅ Remove item from Cart State
      setmycart((prevCart) => prevCart.filter((item) => item.service_id !== serviceId));
    } catch (error) {
      console.error("Error deleting from cart:", error);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0))
  }

  useEffect(() => {
    if (containerRef.current) {
      const scrollAmount = currentIndex * (containerRef.current.scrollWidth / products.length)
      containerRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }, [currentIndex])

  return (
    <div className="relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm"
          onClick={prevSlide}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Previous slide</span>
        </Button>
      </div>
      <div ref={containerRef} className="flex overflow-x-hidden gap-6 px-10">
        {products.map((product, id) => (
          <div key={id} className="min-w-[300px] flex-1">
            <div className="group relative overflow-hidden rounded-lg">
              <div className="relative h-[400px] w-full overflow-hidden">
                <Image
                  src={product.photo ? `http://localhost:8001/items/${product.photo}` : "/paaulogo.png"}
                  alt={"/paaulogo.png"}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-110"
                  style={{
                    transform: "scale(0.85)",
                    transition: "transform 0.5s ease-in-out",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(0.95)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(0.85)"
                  }}
                />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium">{product.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{product.subtitle}</p>
              <Button className="mt-4 bg-black hover:bg-gray-800 text-white" onClick={() => user ? handleAddToCart(product?._id) : router.push("/user_login")}>Add Cart</Button>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm"
          onClick={nextSlide}
          disabled={currentIndex === maxIndex}
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>
    </div>
  )
}

