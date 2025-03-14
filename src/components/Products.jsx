import postService from "@/services/postService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Products = () => {
    const [products, setproducts] = useState([]);
    const [userid, setUserid]=useState(null);
    const[productid, setProductid]=useState(null);
        const [error, setError] = useState(null); 
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

  return (
    <div>{products.map((items,id)=>{
        return (<div key={id}>
            <img src={`http://localhost:8001/items/${items.photo}`} alt="photo" className="h-24 w-24 object-cover"/>
            <button onClick={() => user ? handlemycart(items._id) : router.push("/user_login")}>
  Add to Cart
</button>

            {items.name}
            {items.subtitle}
            {items.amount}
            </div>)
    })}</div>
  )
}

export default Products