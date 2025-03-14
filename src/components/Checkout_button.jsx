import { useEffect, useState } from "react";
import { Button } from "./ui/button";
const Checkout = ({ mycart, setmycart, selectedItems, itemQuantities, location, phoneno }) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleUploadCheckout = async () => {
    if (!selectedItems || Object.keys(selectedItems).length === 0) {
      setError("No items selected!");
      return;
    }

    if (!location || !phoneno) {
      setError("Please fill location and phoneno");
      return;
    }

    const selectedData = mycart
      .filter((items) => selectedItems[items.service_id._id])
      .map((items) => ({
        cart_id: items._id,
        quantity: itemQuantities[items.service_id._id] || 1,
        totalPrice: selectedItems[items.service_id._id], 
      }));

    const payload = {
      selectedItems: selectedData,
      location,
      phoneno,
    };

    try {
      const response = await fetch("http://localhost:8001/uploadcheckout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(data.message || data || "Something went wrong.");
      }

      setSuccess("Successfully uploaded!");
      setError(null);

      // ✅ Update mycart state to remove deleted items
      const deletedCartIds = selectedData.map((item) => item.cart_id);
      setmycart((prevCart) => prevCart.filter((item) => !deletedCartIds.includes(item._id)));
      
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <Button onClick={handleUploadCheckout}>Checkout</Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default Checkout;
