"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddReviewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form
      if (!formData.name) {
        throw new Error("Name is required");
      }

      // Create form data
      const CategoryData = new FormData();
      CategoryData.append("name", formData.name);

      // Send to API
      const response = await fetch("http://localhost:8001/uploadCategory", {
        method: "POST",
        credentials: "include",
        body: CategoryData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to add Category");
      }

      // Redirect to Category page on success
      router.push("/dashboard/Category");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/dashboard/Category" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Add Category</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter reviewer name"
              required
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
        )}

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/category")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Adding Category..." : "Add Category"}
          </Button>
        </div>
      </form>
    </div>
  );
}
