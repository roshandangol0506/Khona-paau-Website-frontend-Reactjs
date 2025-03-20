"use client";// Import cart context
import postService from "@/services/postService";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NumberInput from "./Numberinput";
import Checkout from "./Checkout_button";
import { useCart } from "@/context/Cart_context";

const MyCart = () => {
  const { mycart, setmycart } = useCart(); 
  const [selectedItems, setSelectedItems] = useState({});
  const [itemQuantities, setItemQuantities] = useState({});
  const [location, setlocation] = useState("");
  const [phoneno, setphoneno] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

  const handleDeletefromCart = async (serviceId) => {
    if (!serviceId) {
      setError("No items are selected");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8001/deletefromcart", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serviceId }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSuccess("Successfully deleted product");
        setmycart((prev) => prev.filter((item) => item.service_id._id !== serviceId));
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
      <h1>My Cart</h1>
      {mycart?.length > 0 ? <p>cha</p>: <p>Khali cha</p>}
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
            <Button onClick={() => handleDeletefromCart(items.service_id._id)}>Delete</Button>
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

      <Checkout mycart={mycart} setmycart={setmycart} selectedItems={selectedItems} itemQuantities={itemQuantities} location={location} phoneno={phoneno} />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default MyCart;
