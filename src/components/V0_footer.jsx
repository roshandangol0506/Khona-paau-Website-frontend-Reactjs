import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavigation = async (sectionId) => {
    if (pathname === "/") {
      scrollToSection(sectionId);
    } else {
      router.push("/");
      scrollToSection(sectionId);
    }
  };

  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-serif text-xl mb-4">Khokan Paau</h3>
            <p className="text-gray-400 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in
              odio vitae justo vestibulum bibendum at nec orci.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-white hover:text-gray-300">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-white hover:text-gray-300">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-white hover:text-gray-300">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <p
                  onClick={() => handleNavigation("home")}
                  className=" cursor-pointer hover:text-white"
                >
                  Home
                </p>
              </li>
              <li>
                <p
                  onClick={() => handleNavigation("about")}
                  className=" cursor-pointer hover:text-white"
                >
                  About Us
                </p>
              </li>
              <li>
                <p
                  onClick={() => handleNavigation("product")}
                  className=" cursor-pointer hover:text-white"
                >
                  Product
                </p>
              </li>
              <li>
                <p
                  onClick={() => handleNavigation("review")}
                  className=" cursor-pointer hover:text-white"
                >
                  Review
                </p>
              </li>
              <li>
                <p
                  onClick={() => handleNavigation("photos")}
                  className=" cursor-pointer hover:text-white"
                >
                  Photos
                </p>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Women
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Men
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Shoes
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter to get updates on our latest offers!
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 text-white px-4 py-2 rounded-l-md w-full focus:outline-none"
              />
              <button className="bg-white text-black px-4 py-2 rounded-r-md hover:bg-gray-200">
                Send
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© 2025 Khokan Paau. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
