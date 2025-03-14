"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import postService from "@/services/postService";

const NavBar = ({ user }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userx, setUserx] = useState(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const fetchuserlogout = async () => {
          try {
            await postService.getuserlogout(); 
            window.location.reload();
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
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8001/api/checkAuth", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isAuthenticated) {
          setUserx({
            userId: data.userId,
            username: data.username,
            email: data.email,
            profile: data.profile ? data.profile : null,
          });
          setIsLoading(false);
        }
      });
  }, [router]);

  return (
    <header>
      <nav
        id="navbar"
        className={`fixed top-0 w-full transition-all duration-500 ${
          scrolled ? "bg-blue-500 shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img src="/paaulogo.png" alt="Logo" className="h-12 w-auto" />
          </Link>
          <button className="lg:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            ☰
          </button>
          <div className={`lg:flex ${isOpen ? "block" : "hidden"} w-full lg:w-auto`}>
            <ul className="flex flex-col lg:flex-row lg:space-x-6 text-white">
              <li><Link href="/" className="flex items-center p-2 hover:text-gray-300">Home</Link></li>
              <li><Link href="/#about" className="flex items-center p-2 hover:text-gray-300">About Us</Link></li>
              <li><Link href="/#team" className="flex items-center p-2 hover:text-gray-300">Team</Link></li>
              <li><Link href="/#products" className="flex items-center p-2 hover:text-gray-300">Products</Link></li>
              <li><Link href="#contact" className="flex items-center p-2 hover:text-gray-300">Contact Us</Link></li>
            </ul>
          </div>
          <div className="relative">
            {userx ? (
              <>
              <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)} >
                {userx.profile && (
                  <img src={`http://localhost:8001/gmailprofile/${userx.profile}`} alt="User Logo" className="rounded-full w-10 h-10 cursor-pointer"/>
                )}
                <p className="text-white">{userx.username}</p>
                </div>
                {isOpen && (
                  <ul className="absolute right-0 mt-2 w-40 bg-white text-black shadow-md rounded-md">
                    <li><Link href="/mycart" className="block px-4 py-2 hover:bg-gray-200">My Cart</Link></li>
                    <li><Link href="/checkout" className="block px-4 py-2 hover:bg-gray-200">Checkout</Link></li>
                    <li><hr /></li>
                    <li><p onClick={()=>fetchuserlogout()} className="block px-4 py-2 hover:bg-gray-200 cursor-pointer">Logout</p></li>
                  </ul>
                )}
              </>
            ) : (
              <Link href="/user_login" className="text-white hover:text-gray-300">Login</Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;