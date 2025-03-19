"use client"
import postService from "@/services/postService";
import Image from "next/image"
import { useEffect, useState } from "react";

const photos = [
  {
    id: 1,
    src: "/placeholder.svg?height=600&width=600",
    alt: "Fashion photo 1",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=600&width=600",
    alt: "Fashion photo 2",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=600&width=600",
    alt: "Fashion photo 3",
  },
  {
    id: 4,
    src: "/placeholder.svg?height=600&width=600",
    alt: "Fashion photo 4",
  },
  {
    id: 5,
    src: "/placeholder.svg?height=600&width=600",
    alt: "Fashion photo 5",
  },
  {
    id: 6,
    src: "/placeholder.svg?height=600&width=600",
    alt: "Fashion photo 6",
  },
]

export default function PhotosSection() {
  const [teams, setteams] = useState([]);
      const [error, setError] = useState(null); 
  
      const fetchteams = async () => {
      try {
          const response = await postService.getteams();
          setteams(response.data.data);
          setError(null); 
      } catch (error) {
          if (error.response) {
          setError(`Server Error: ${error.response.status} - ${error.response.data.message || "Something went wrong"}`);
          } else if (error.request) {
          setError("Network error: Unable to reach the server. Please try again.");
          } else {
          setError("An unexpected error occurred.");
          }
      }
      };
  
      useEffect(() => {
      fetchteams();
      }, []);
  return (
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-4xl font-serif text-center mb-6">Our Gallery</h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
        Explore our rich flavors of Titaura, crafted by our women's group and shared across cities and countries
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {teams.map((photo, id) => (
          <div key={id} className="relative group overflow-hidden rounded-lg">
            <div className="relative aspect-square w-full">
              <Image
                src={`http://localhost:8001/uploads/${photo.teamimage}?height=600&width=600`}
                alt={photo.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-medium">View</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

