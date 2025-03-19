"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import postService from "@/services/postService"
import { useRouter } from "next/navigation"

export default function ProductCarousel() {
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
      
          const fetchProduct = async () => {
          try {
              const response = await postService.getvisibleProducts();
              setproducts(response.data.data);
              setError(null); 
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
      
          useEffect(() => {
          fetchProduct();
          }, []);
  
  
          const handleUploadMyCart = async () => {
              if (!productid || !userid) {
                setError("All fields are required");
                return;
              }
            
              try {
                const response = await fetch("http://localhost:8001/uploadmycart", {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ service_id: productid, user_id: userid }),
                });
            
                if (!response.ok) throw new Error("Failed to upload My Cart");
            
                setSuccess("Successfully uploaded My Cart");
              } catch (error) {
                setError("Failed to upload My Cart: " + error.message);
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
                    setIsLoading(false);
                  }
                });
            }, [router]);
  
            const handlemycart=(items_id)=>{
              setProductid(items_id) 
              setUserid(user?.id)
            }
  
            useEffect(() => {
              if (productid && userid) {
                handleUploadMyCart();
              }
            }, [productid, userid]);

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
              <Button className="mt-4 bg-black hover:bg-gray-800 text-white" onClick={() => user ? handlemycart(product?._id) : router.push("/user_login")}>Add Cart</Button>
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

