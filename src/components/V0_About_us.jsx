import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function AboutSection() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-4xl font-serif mb-6">ABOUT US</h2>
          <p className="text-muted-foreground mb-6">
          Khona Paau is a community-driven initiative that celebrates the rich culinary heritage of Khokana. Our products are handcrafted by skilled women artisans using traditional methods passed down through generations.
          </p>
          <p className="text-muted-foreground mb-8">
          We take pride in preserving authentic flavors while supporting sustainable livelihoods for local women. Each purchase directly contributes to the economic empowerment of our community members.
          </p>
          <Button className="bg-black hover:bg-gray-800 text-white">DISCOVER MORE</Button>
        </div>
        <div className="order-1 md:order-2 relative">
          <div className="relative h-[500px] w-full overflow-hidden">
            <Image
              src="/About_photo.jpg?height=600&width=500"
              alt="Classic Winter Collection"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="absolute bottom-8 right-8 bg-white p-6 rounded-lg shadow-lg max-w-[200px]">
            <p className="font-serif text-lg font-medium">February 2024</p>
            <p className="text-muted-foreground text-sm">Best Product of Nepal</p>
          </div>
        </div>
      </div>
    </div>
  )
}

