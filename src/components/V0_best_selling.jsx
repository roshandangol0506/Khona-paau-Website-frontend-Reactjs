"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { useEffect, useState } from "react";
import postService from "@/services/postService";
import { useRouter } from "next/navigation";

const products = [
  {
    id: 1,
    name: "Wool Blend Coat",
    price: "$129.99",
    rating: 5,
    image: "/placeholder.svg?height=400&width=300",
    category: "Outerwear",
  },
  {
    id: 2,
    name: "Cashmere Sweater",
    price: "$89.99",
    rating: 4,
    image: "/placeholder.svg?height=400&width=300",
    category: "Knitwear",
  },
  {
    id: 3,
    name: "Leather Ankle Boots",
    price: "$149.99",
    rating: 5,
    image: "/placeholder.svg?height=400&width=300",
    category: "Footwear",
  },
  {
    id: 4,
    name: "Silk Scarf",
    price: "$59.99",
    rating: 4,
    image: "/placeholder.svg?height=400&width=300",
    category: "Accessories",
  },
]

export default function BestSelling() {
    const [bestselling, setbestselling] = useState([]);
    const [userid, setUserid]=useState(null);
    const[productid, setProductid]=useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null); 
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

  const fetchProduct = async () => {
            try {
                const response = await postService.getbestselling();
                setbestselling(response.data.data);
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
                  console.log("error ayo",error)
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
                  console.log("error during post", error)
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
  return (
    <div>
      <h2 className="text-4xl font-serif text-center mb-6">Best Selling Products</h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe voluptas ut dolorum consequuntur, adipisci
        repellat! Eveniet commodi voluptatem.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {bestselling.map((product,id) => (
          <div key={id} className="group">
            <div className="relative overflow-hidden rounded-lg mb-4">
              <div className="relative h-[350px] w-full overflow-hidden bg-muted/20">
                <Image
                  src={product.photo ? `http://localhost:8001/items/${product.photo}?height=400&width=300` : "/paaulogo.png"}
                  alt={product?.name}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button className="bg-white text-black hover:bg-gray-200">Quick View</Button>
              </div>
              <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs rounded">{product.subtitle}</div>
            </div>
            <div>
              <div className="flex mb-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={"h-4 w-4 fill-yellow-400 text-yellow-400" }
                    />
                  ))}
              </div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-muted-foreground">{product.price}</p>
              <Button className="mt-4 w-full bg-black hover:bg-gray-800 text-white" onClick={() => user ? handlemycart(product?._id) : router.push("/user_login")}>Add Cart</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

