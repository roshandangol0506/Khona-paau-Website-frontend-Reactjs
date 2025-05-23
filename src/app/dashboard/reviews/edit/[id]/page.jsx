"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";

export default function EditReviewPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState({
    name: "",
    review: "",
    rating: 5,
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await fetch(`http://localhost:8001/review/${id}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const review = data.data;

        setFormData({
          name: review.name || "",
          review: review.review || "",
          rating: review.rating || 5,
        });

        if (review.profilepic) {
          setPhotoPreview(`http://localhost:8001/reviews/${review.profilepic}`);
        }
      } catch (error) {
        console.error("Error fetching review:", error);
        setError("Failed to load review data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating,
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
      if (!formData.name || !formData.review) {
        throw new Error("Name and review are required");
      }

      // Create form data for file upload
      const reviewData = new FormData();
      reviewData.append("name", formData.name);
      reviewData.append("review", formData.review);
      reviewData.append("rating", formData.rating);

      // Only append photo if a new one was selected
      if (photo) {
        reviewData.append("photo", photo);
      }

      // Send to API
      const response = await fetch(`http://localhost:8001/editreview/${id}`, {
        method: "PUT",
        credentials: "include",
        body: reviewData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update review");
      }

      // Redirect to reviews page on success
      router.push("/dashboard/reviews");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading review data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/dashboard/reviews" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Review</h1>
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

          <div className="space-y-2">
            <Label htmlFor="review">
              Review <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="review"
              name="review"
              value={formData.review}
              onChange={handleChange}
              placeholder="Enter review text"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= formData.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Photo (Optional)</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview || "/placeholder.svg"}
                    alt="Reviewer preview"
                    className="mx-auto max-h-[200px] object-contain"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setPhoto(null);
                      // Only clear preview if it's not from the server
                      if (!photoPreview.includes("http://localhost:8001")) {
                        setPhotoPreview(null);
                      }
                    }}
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
                  <Input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
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
            onClick={() => router.push("/dashboard/reviews")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Updating Review..." : "Update Review"}
          </Button>
        </div>
      </form>
    </div>
  );
}
