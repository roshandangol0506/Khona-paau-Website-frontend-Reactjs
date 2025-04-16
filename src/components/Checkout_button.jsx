import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useCart } from "@/context/Cart_context";

const Checkout = ({
  id,
  mycart,
  setmycart,
  selectedItems,
  itemQuantities,
  location,
  phoneno,
}) => {
  const { fetchMycart } = useCart();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleUploadCheckout = async () => {
    if (!selectedItems || Object.keys(selectedItems).length === 0) {
      setError("No items selected!");
      return;
    }

    if (!location || !phoneno) {
      setError("Please fill location and phone number");
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

      // Update mycart state to remove deleted items
      fetchMycart();
    } catch (error) {
      setError("Error from catch: " + error.message);
    }
  };

  return (
    <div>
      <Button id={id} onClick={handleUploadCheckout} className="hidden">
        Checkout
      </Button>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      {success && <p className="text-green-500 mt-2 text-sm">{success}</p>}
    </div>
  );
};

export default Checkout;
