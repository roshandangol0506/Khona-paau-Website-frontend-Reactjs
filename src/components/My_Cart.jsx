"use client";
import postService from "@/services/postService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NumberInput from "./Numberinput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Checkout from "./Checkout_button";

const MyCart = () => {
  const [selectedItems, setSelectedItems] = useState({});
  const [itemQuantities, setItemQuantities] = useState({});
  const [location, setlocation] = useState("");
  const [phoneno, setphoneno] = useState("");
  const [mycart, setmycart] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMycart = async () => {
      try {
        const response = await postService.getMyCarts();
        setmycart(response.data.mycart);
        setError(null);
      } catch (error) {
        setError("No Cart items found.");
      }
    };
    fetchMycart();
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

  const handleCheckboxChange = (serviceId, baseAmount) => (event) => {
    setSelectedItems((prev) => {
      const newSelectedItems = { ...prev };
  
      if (event.target.checked) {
        const existingQuantity = itemQuantities[serviceId] || 1; 
        newSelectedItems[serviceId] = baseAmount * existingQuantity; 
        setItemQuantities((prevQuantities) => ({
          ...prevQuantities,
          [serviceId]: existingQuantity, 
        }));
      } else {
        delete newSelectedItems[serviceId];
      }
  
      return newSelectedItems;
    });
  };
  

  const updateTotalForItem = (serviceId, totalPrice, quantity) => {
    setItemQuantities((prev) => ({ ...prev, [serviceId]: quantity }));

    setSelectedItems((prev) => {
      if (prev[serviceId] !== undefined) {
        return { ...prev, [serviceId]: totalPrice };
      }
      return prev;
    });
  };

  const handleDeletefromCart = async (serviceId, userId) => {
    if (!serviceId || !userId) {
      setError("No items are selected");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8001/deletefromcart", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json", // ✅ Specify JSON content
        },
        body: JSON.stringify({ serviceId, userId }), // ✅ Send as JSON
      });
  
      const data = await response.json(); // ✅ Parse response
  
      if (response.ok) {
        setSuccess("Successfully deleted product");
      } else {
        setError(`Failed to delete product: ${data.message}`);
      }
    } catch (error) {
      setError(`Failed to delete product: ${error.message}`);
    }
  };
  

  const totalAmount = Object.values(selectedItems).reduce((acc, curr) => acc + curr, 0);

  return (
    <div>
      <p>{user?.username}</p>
      {user?.profile && (
        <img
          src={`http://localhost:8001/gmailprofile/${user?.profile}`}
          alt="User Logo"
          className="rounded-full w-10 h-10 cursor-pointer"
        />
      )}
      <Input
        type="location"
        className="w-50 text-center bg-gray-100 mt-4"
        value={location}
        onChange={(e) => setlocation(e.target.value)}
      />

      <Input
        type="phoneno"
        className="w-50 text-center bg-gray-100 mt-4"
        value={phoneno}
        onChange={(e) => setphoneno(e.target.value)}
      />

      <h1>My Cart</h1>
      {mycart?.map((items, id) => (
        <div key={id} className="flex items-center space-x-4">
          <img
            src={`http://localhost:8001/items/${items.service_id.photo}`}
            alt="photo"
            className="h-24 w-24 object-cover"
          />
          <div>
            <h2>{items.service_id.name}</h2>
            <p>Price: {items.service_id.amount}</p>

            <NumberInput
              baseAmount={items.service_id.amount}
              onTotalChange={(total, quantity) => updateTotalForItem(items.service_id._id, total, quantity)}
            />
            <Button onClick={()=>handleDeletefromCart(items.service_id._id, user.id)}>Delete</Button>
          </div>

          <input
            type="checkbox"
            name="selecttobuy"
            onChange={handleCheckboxChange(items.service_id._id, items.service_id.amount)}
          />
        </div>
      ))}

      <Input
        type="number"
        className="w-24 text-center bg-gray-100 mt-4"
        value={totalAmount}
        readOnly
      />

      <Checkout
      mycart={mycart}
      setmycart={setmycart}
      selectedItems={selectedItems}
      itemQuantities={itemQuantities}
      location={location}
      phoneno={phoneno}
    />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default MyCart;
