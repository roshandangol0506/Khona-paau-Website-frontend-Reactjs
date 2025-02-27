import React, { useState, useEffect } from "react";
import Link from "next/link";

const NavBar = ({ user }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            <img src="/views/siddhi_smile.jpg" alt="Logo" className="h-12 w-auto" />
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
            {user ? (
              <>
                {user.profile && (
                  <img src={`/gmailprofile/${user.profile}`} alt="User Logo" className="rounded-full w-10 h-10 cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
                )}
                {isOpen && (
                  <ul className="absolute right-0 mt-2 w-40 bg-white text-black shadow-md rounded-md">
                    <li><Link href="/mycart" className="block px-4 py-2 hover:bg-gray-200">My Cart</Link></li>
                    <li><Link href="/checkout" className="block px-4 py-2 hover:bg-gray-200">Checkout</Link></li>
                    <li><hr /></li>
                    <li><Link href="/user/logout" className="block px-4 py-2 hover:bg-gray-200">Logout</Link></li>
                  </ul>
                )}
                <p className="text-white">{user.name}</p>
              </>
            ) : (
              <Link href="/login" className="text-white hover:text-gray-300">Login</Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;