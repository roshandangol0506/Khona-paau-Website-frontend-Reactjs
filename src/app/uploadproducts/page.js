"use client";
import postService from "@/services/postService";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const [name, setName] = useState("");
  const [user, setUser] = useState(null);
  const [subtitle, setSubtitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [products, setproducts] = useState([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8001/api/checkAuth", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.isAuthenticated) {
          router.push("/login");
        } else {
          setUser({
            userId: data.userId,
            username: data.username,
            email: data.email,
          });
          setIsLoading(false);
        }
      });
  }, [router]);

  const handleUploadProduct = async () => {
    if (!name || !subtitle || !amount || !description || !photo) {
      setError("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("subtitle", subtitle);
    formData.append("amount", amount);
    formData.append("description", description);
    formData.append("photo", photo);

    try {
      const response = await fetch("http://localhost:8001/uploaditemsimages", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      setSuccess("Successfully uploaded Products");
    } catch (error) {
      setError("Failed to upload product", error);
    }
  };

  const handleDisable = async (id) => {
    try {
      const response = await fetch("http://localhost:8001/disableitem", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to disable product");
      }

      // Instantly update the local state
      setproducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id ? { ...product, visible: "off" } : product
        )
      );

      setSuccess("Product Disabled");
    } catch (error) {
      setError("Failed to disable product");
    }
  };

  const handleEnable = async (id) => {
    try {
      const response = await fetch("http://localhost:8001/enableitem", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to enable product");
      }

      setproducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id ? { ...product, visible: "on" } : product
        )
      );

      setSuccess("Product Enabled");
    } catch (error) {
      setError("Failed to enable product");
    }
  };

  const handlebestSelling = async (id) => {
    try {
      const response = await fetch(`http://localhost:8001/bestselling/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to enable product");
      }

      setproducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id
            ? {
                ...product,
                best_selling:
                  product.best_selling === "true" ? "false" : "true",
              }
            : product
        )
      );

      setSuccess("Best Selling updated");
    } catch (error) {
      setError("Failed to update Best Selling");
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await postService.getallProducts();
      setproducts(response.data.data);
      setError(null);
    } catch (error) {
      if (error.response) {
        setError(
          `Server Error: ${error.response.status} - ${
            error.response.data.message || "Something went wrong"
          }`
        );
      } else if (error.request) {
        setError(
          "Network error: Unable to reach the server. Please try again."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Subtitle"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="Number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files[0])} // Fix here
      />
      <button onClick={handleUploadProduct}>Submit</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <div>
        {products.map((items, id) => {
          return (
            <div key={id} className="flex flex-col gap-4">
              <img
                src={`http://localhost:8001/items/${items.photo}`}
                alt="photo"
                className="h-24 w-24 object-cover"
              />
              {items.name}
              {items.subtitle}
              {items.amount}
              {items.visible}
              <div>
                {items.visible === "on" ? (
                  <button onClick={() => handleDisable(items._id)}>
                    Disable
                  </button>
                ) : (
                  <button onClick={() => handleEnable(items._id)}>
                    Enable
                  </button>
                )}
              </div>
              {items.best_selling}
              <div>
                <button onClick={() => handlebestSelling(items._id)}>
                  Best Selling
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default page;
