"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="bg-white text-black h-screen overflow-auto">
      <div className="relative bg-white">
        <header className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center">
            <svg
              className="h-8 w-8 text-black"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 6.734c0 4.164-3.75 6.98-7 10.075-3.25-3.094-7-5.91-7-10.075C5 3.187 7.684 1 12 1s7 2.187 7 5.734z"></path>
            </svg>
            <span className="ml-2 text-xl font-bold">Carma Canada</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#collections"
              className="text-sm hover:text-gray-600 transition duration-200"
            >
              Collections
            </a>
            <a
              href="#featured"
              className="text-sm hover:text-gray-600 transition duration-200"
            >
              Featured
            </a>
            <a
              href="#testimonials"
              className="text-sm hover:text-gray-600 transition duration-200"
            >
              Testimonials
            </a>
            <a
              href="#sustainability"
              className="text-sm hover:text-gray-600 transition duration-200"
            >
              Sustainability
            </a>
          </nav>
        </header>

        <div className="relative z-10 px-6 py-16 md:py-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                Effortless Style,{" "}
                <span className="text-black">Timeless Elegance</span>
              </h1>
              <p className="text-lg text-gray-700">
                Discover our curated collection of sustainable fashion that
                brings together modern trends and timeless designs.
              </p>
              <div className="flex flex-row space-x-4 space-y-4items-center">
                <Link href="/api/auth/signup">
                  <Button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded text-base shadow-sm transition-all self-center">
                    Sign Up
                  </Button>
                </Link>
                <Link href="/api/auth/login">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-black hover:bg-gray-100 px-6 py-2 rounded text-base transition-all self-center "
                  >
                    Login
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <svg
                  className="h-5 w-5 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Free shipping on orders over $75</span>
              </div>
            </div>

            {isClient && (
              <div className="relative md:block">
                <div className="w-full h-[300px] md:h-[500px] relative border border-gray-200 rounded overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/1884579/pexels-photo-1884579.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Fashion model wearing Elegance clothing"
                    className="rounded w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-gray-100 text-black py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Shop</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-black transition">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    Bestsellers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    Collections
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    Sale
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Help</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-black transition">
                    Shipping & Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    Size Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-black transition">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    Sustainability
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-black transition">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    Pinterest
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <svg
                className="h-8 w-8 text-black"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 6.734c0 4.164-3.75 6.98-7 10.075-3.25-3.094-7-5.91-7-10.075C5 3.187 7.684 1 12 1s7 2.187 7 5.734z"></path>
              </svg>
              <span className="ml-2 text-xl font-bold">Carma Canada</span>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-gray-600">
              &copy; 2025 Carma Canada. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
