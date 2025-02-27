import postService from "@/services/postService";
import { useEffect, useState } from "react";

const Products = () => {
    const [products, setproducts] = useState([]);
        const [error, setError] = useState(null); 
    
        const fetchProduct = async () => {
        try {
            const response = await postService.getProducts();
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

  return (
    <div>{products.map((items,id)=>{
        return (<div key={id}>
            {items.photo}
            <img src={`http://localhost:8001/items/${items.photo}`} alt="photo" className="h-24 w-24 object-cover"/>
            {items.name}
            {items.subtitle}
            {items.amount}
            </div>)
    })}</div>
  )
}

export default Products