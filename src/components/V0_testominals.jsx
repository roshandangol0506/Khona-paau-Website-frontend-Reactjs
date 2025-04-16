"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import postService from "@/services/postService";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setreviews] = useState([]);
  const [error, setError] = useState(null);

  const fetchReview = async () => {
    try {
      const response = await postService.getReviews();
      setreviews(response.data.data);
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
    fetchReview();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  const current = reviews[currentIndex];

  return (
    <div>
      <div></div>
      <h2 className="text-4xl font-serif text-center mb-2">
        WE LOVE GOOD COMPLIMENT
      </h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
        What our customers say about us
      </p>

      <div className="max-w-3xl mx-auto">
        <div className="relative bg-muted/20 p-8 md:p-12 rounded-lg text-center">
          <div className="flex justify-center mb-6">
            <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-white">
              <Image
                src={`http://localhost:8001/reviews/${current?.profilepic}?height=100&width=100`}
                alt={"loadig"}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex justify-center mb-4">
            {renderStars(current?.rating || 5)}
          </div>

          <blockquote className="text-xl italic mb-6">
            "{current?.review}"
          </blockquote>

          <div>
            <p className="font-medium text-lg">{current?.name}</p>
            <p className="text-muted-foreground">customer</p>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={prevTestimonial}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous testimonial</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={nextTestimonial}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next testimonial</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
