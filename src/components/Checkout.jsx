"use client";
import postService from '@/services/postService';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Checkout = () => {
    const [checkout, setcheckout] = useState(null);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router= useRouter()

    useEffect(() => {
      const fetchCheckout = async () => {
          try {
              const response = await postService.getCheckout();
              console.log("Checkout API Response:", response.data); 
              setcheckout(response.data.checkout);
              setError(null);
          } catch (error) {
              console.error("Error fetching checkout:", error);
              setError("No Checkout items found.");
          }
      };
      fetchCheckout();
  }, []);  
    
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
                profile: data.profile ? data.profile : null,
              });
              setIsLoading(false);
            }
          });
      }, [router]);

  return (
    <div>{checkout?.map((item, index) => (
      <div key={index}>
        <h2>{item.service_id.name}</h2>  {/* ✅ Render a string */}
        <p>Price: {item.service_id.amount}</p>
      </div>
    ))}
    </div>
  )
}

export default Checkout
