"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProductPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState({
    name: "",
    subtitle: "",
    description: "",
    amount: "",
    visible: "on",
    best_selling: "false",
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8001/product/${id}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const product = data.data;

        setFormData({
          name: product.name || "",
          subtitle: product.subtitle || "",
          description: product.description || "",
          amount: product.amount || "",
          visible: product.visible !== undefined ? product.visible : "off",
          best_selling: product.best_selling || "false",
        });

        if (product.photo) {
          setPhotoPreview(`http://localhost:8001/items/${product.photo}`);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate form
      if (!formData.name || !formData.amount) {
        throw new Error("Name and price are required");
      }

      // Create form data for file upload
      const productData = new FormData();

      productData.append("name", formData.name);
      productData.append("subtitle", formData.subtitle);
      productData.append("description", formData.description);
      productData.append("amount", formData.amount);
      productData.append("visible", formData.visible);
      productData.append("best_selling", formData.best_selling);

      console.log("productData", productData);

      productData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      // Only append photo if a new one was selected
      if (photo) {
        productData.append("photo", photo);
      }

      // Send to API
      const response = await fetch(`http://localhost:8001/edititems/${id}`, {
        method: "PUT",
        credentials: "include",
        body: productData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update product");
      }

      // Redirect to products page on success
      router.push("/dashboard/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading product data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/dashboard/products" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Enter product subtitle"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">
                Price <span className="text-red-500">*</span>
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter product price"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={5}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview || "/placeholder.svg"}
                      alt="Product preview"
                      className="mx-auto max-h-[200px] object-contain"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => fileInputRef.current.click()}
                    >
                      {photo ? "Remove New Image" : "Change Image"}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drag and drop an image, or click to browse
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={() => document.getElementById("photo").click()}
                    >
                      Select Image
                    </Button>
                  </div>
                )}
                {/* Hidden input (always available) */}
                <Input
                  ref={fileInputRef}
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange} // 👈 your existing logic
                  className="hidden"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Product Status</h3>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="visible" className="text-base">
                    Enable Product
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Product will be visible to customers
                  </p>
                </div>
                <Switch
                  id="visible"
                  name="visible"
                  checked={formData.visible === "on"}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      visible: checked ? "on" : "off",
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="best_selling" className="text-base">
                    Best Selling
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Mark as a best selling product
                  </p>
                </div>
                <Switch
                  id="best_selling"
                  name="best_selling"
                  checked={formData.best_selling === "true"}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      best_selling: checked ? "true" : "false",
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
        )}

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/products")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Updating Product..." : "Update Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
