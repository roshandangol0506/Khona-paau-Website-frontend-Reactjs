"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, Minus, Plus } from "lucide-react";
import Checkout from "@/components/Checkout_button";
import { useCart } from "@/context/Cart_context";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MyCart = () => {
  const { mycart, setmycart } = useCart();
  const [selectedItems, setSelectedItems] = useState({});
  const [itemQuantities, setItemQuantities] = useState({});
  const [user, setUser] = useState(null);
  const [location, setlocation] = useState("");
  const [phoneno, setphoneno] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();
  const shippingCost = 12.99;

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
            profile: data.profile || null,
          });
          setlocation(data.location || "");
          setphoneno(data.phoneno || "");
        }
      });
  }, [router]);

  // Initialize quantities from cart items
  useEffect(() => {
    if (mycart && mycart.length > 0) {
      const initialQuantities = {};
      mycart.forEach((item) => {
        initialQuantities[item.service_id._id] = 1; // Default to 1 or use item.quantity if available
      });
      setItemQuantities(initialQuantities);
    }
  }, [mycart]);

  const handleCheckboxChange = (serviceId, baseAmount) => {
    setSelectedItems((prev) => {
      const newSelectedItems = { ...prev };
      const existingQuantity = itemQuantities[serviceId] || 1;

      if (newSelectedItems[serviceId]) {
        // If already selected, unselect it
        delete newSelectedItems[serviceId];
      } else {
        // If not selected, select it
        newSelectedItems[serviceId] = baseAmount * existingQuantity;
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
    if (!serviceId || !user?.id) {
      setError("No items are selected");
      return;
    }

    try {
      const response = await fetch("http://localhost:8001/deletefromcart", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, userId: user.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Successfully deleted product");
        setmycart((prev) =>
          prev.filter((item) => item.service_id._id !== serviceId)
        );
        // Remove from selected items if it was selected
        setSelectedItems((prev) => {
          const newSelectedItems = { ...prev };
          delete newSelectedItems[serviceId];
          return newSelectedItems;
        });
      } else {
        setError(`Failed to delete product: ${data.message}`);
      }
    } catch (error) {
      setError(`Failed to delete product: ${error.message}`);
    }
  };

  const handleQuantityChange = (serviceId, currentQuantity, change) => {
    const newQuantity = Math.max(1, currentQuantity + change);
    const item = mycart.find((item) => item.service_id._id === serviceId);
    if (item) {
      const baseAmount = item.service_id.amount;
      const newTotal = baseAmount * newQuantity;

      setItemQuantities((prev) => ({
        ...prev,
        [serviceId]: newQuantity,
      }));

      if (selectedItems[serviceId] !== undefined) {
        setSelectedItems((prev) => ({
          ...prev,
          [serviceId]: newTotal,
        }));
      }
    }
  };

  const subtotal = Object.values(selectedItems).reduce(
    (acc, curr) => acc + curr,
    0
  );

  const total = subtotal + (subtotal > 0 ? shippingCost : 0);

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Cart Items */}
          <div className="hidden md:grid md:grid-cols-12 text-sm font-medium text-muted-foreground mb-4">
            <div className="md:col-span-5">Product</div>
            <div className="md:col-span-2 text-center">Price</div>
            <div className="md:col-span-3 text-center">Quantity</div>
            <div className="md:col-span-2 text-right">Total</div>
          </div>
          <Separator className="mb-6 hidden md:block" />

          {mycart && mycart.length > 0 ? (
            mycart.map((item, index) => (
              <div key={index} className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-5 flex items-center gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`select-${item.service_id._id}`}
                        checked={
                          selectedItems[item.service_id._id] !== undefined
                        }
                        onChange={() =>
                          handleCheckboxChange(
                            item.service_id._id,
                            item.service_id.amount
                          )
                        }
                        className="h-4 w-4 rounded border-gray-300 mr-3"
                      />
                      <div className="relative h-24 w-24 bg-gray-100 rounded">
                        <img
                          src={`http://localhost:8001/items/${item.service_id.photo}`}
                          alt={item.service_id.name}
                          className="h-full w-full object-cover rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">{item.service_id.name}</h3>
                      {item.service_id.color && (
                        <p className="text-sm text-muted-foreground">
                          Color: {item.service_id.color}
                        </p>
                      )}
                      {item.service_id.size && (
                        <p className="text-sm text-muted-foreground">
                          Size: {item.service_id.size}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2 text-center">
                    ${item.service_id.amount.toFixed(2)}
                  </div>
                  <div className="md:col-span-3 flex justify-center">
                    <div className="flex items-center border rounded">
                      <button
                        className="px-3 py-1 border-r"
                        onClick={() =>
                          handleQuantityChange(
                            item.service_id._id,
                            itemQuantities[item.service_id._id] || 1,
                            -1
                          )
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-1">
                        {itemQuantities[item.service_id._id] || 1}
                      </span>
                      <button
                        className="px-3 py-1 border-l"
                        onClick={() =>
                          handleQuantityChange(
                            item.service_id._id,
                            itemQuantities[item.service_id._id] || 1,
                            1
                          )
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="md:col-span-2 text-right">
                    $
                    {(
                      item.service_id.amount *
                      (itemQuantities[item.service_id._id] || 1)
                    ).toFixed(2)}
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    className="text-sm text-red-500 flex items-center gap-1"
                    onClick={() => handleDeletefromCart(item.service_id._id)}
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
                <Separator className="my-6" />
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link href="/">
                <Button className="bg-black hover:bg-gray-800 text-white">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}

          <div className="flex justify-between items-center mt-6">
            <Link href="/" className="text-sm font-medium underline">
              Continue Shopping
            </Link>
            <Button variant="outline">Update Cart</Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-medium mb-6">Order Summary</h2>

            <div className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Delivery Location
                </label>
                <Input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setlocation(e.target.value)}
                  placeholder="Enter your delivery address"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="phoneno" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  type="text"
                  id="phoneno"
                  value={phoneno}
                  onChange={(e) => setphoneno(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>${subtotal > 0 ? shippingCost.toFixed(2) : "0.00"}</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full mt-6 bg-black hover:bg-gray-800 text-white"
              onClick={() => {
                const checkoutButton =
                  document.getElementById("checkout-button");
                if (checkoutButton) {
                  checkoutButton.click();
                }
              }}
            >
              Proceed to Checkout
            </Button>

            <div className="hidden">
              <Checkout
                id="checkout-button"
                mycart={mycart}
                setmycart={setmycart}
                selectedItems={selectedItems}
                itemQuantities={itemQuantities}
                location={location}
                phoneno={phoneno}
              />
            </div>

            {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
            {success && (
              <p className="text-green-500 mt-4 text-sm">{success}</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyCart;
