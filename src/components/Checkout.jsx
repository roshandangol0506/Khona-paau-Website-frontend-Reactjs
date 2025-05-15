"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, Truck, CheckCircle } from "lucide-react";
import Link from "next/link";
import postService from "@/services/postService";

const Checkout = () => {
  const [checkout, setCheckout] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        const response = await postService.getCheckout();
        const sortedCheckout = (response.data.checkout || []).sort(
          (a, b) =>
            new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
        );
        setCheckout(sortedCheckout);
      } catch (error) {
        console.error("Error fetching checkout:", error);
        setError("No Checkout items found.");
      } finally {
        setLoading(false);
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
          setLoading(false);
        }
      });
  }, [router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-500">{error}</p>
        <Button className="mt-4" onClick={() => router.push("/")}>
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Link
          href="/"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <div className="lg:col-span-2">
          <div className=" rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between text-sm font-medium">
                <h3 className="text-lg">Order Items</h3>
                <span>{checkout.length} items</span>
              </div>

              <Separator />

              {checkout.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4"
                >
                  <div className="md:col-span-1 text-center">
                    <p className="text-sm text-muted-foreground transition-colors">
                      Added At
                    </p>
                    <p className="">
                      {new Date(item.added_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="h-20 w-20 bg-gray-100 rounded">
                      <img
                        src={`http://localhost:8001/items/${item.service_id?.photo}`}
                        alt={item.service_id?.name}
                        className="h-full w-full object-cover rounded"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <h4 className="font-medium">
                      {item.service_id?.name || "Product Deleted"}
                    </h4>
                    {item.service_id?.subtitle && (
                      <p className="text-sm text-muted-foreground">
                        {item.service_id?.subtitle || "The product was deleted"}
                      </p>
                    )}
                    {(item.service_id?.color || item.service_id?.size) && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.service_id.color &&
                          `Color: ${item.service_id?.color}`}
                        {item.service_id?.color &&
                          item.service_id?.size &&
                          " | "}
                        {item.service_id?.size &&
                          `Size: ${item.service_id?.size}`}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2 text-center">
                    <p className="text-sm text-muted-foreground">Details</p>
                    <p>{item.location}</p>
                    <p>{item.phoneno}</p>
                  </div>
                  <div className="md:col-span-1 text-center">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <span
                      className={` ${
                        item.status === "processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : item.status === "shipped"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      } px-3 py-1 rounded-full text-sm`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="md:col-span-1 text-center">
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p>{item.quantity}</p>
                  </div>
                  <div className="md:col-span-2 text-right">
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium">
                      $
                      {(item.service_id?.amount * item.quantity + 150).toFixed(
                        2
                      )}
                    </p>
                    <p className="font-light text-[0.6rem]">
                      Including VAT + Delivery
                    </p>
                  </div>
                  <Separator className="md:col-span-12 mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
