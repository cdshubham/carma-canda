import { Button } from "@/components/ui/button";
import Link from "next/link";


function FeaturedProductDisplay({ productType = "shirt" }) {
  const productInfo = {
    shirt: {
      name: "Ethereal Silk Shirt",
      price: "129.99",
      type: "Premium Collection",
    },
    sharara: {
      name: "Royal Embroidered Sharara",
      price: "189.99",
      type: "Signature Collection",
    },
  };

  const product = productInfo[productType];

  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full flex justify-center">
        <div className="relative w-full h-96 overflow-hidden rounded-cardradius">
          <img
            src="https://images.pexels.com/photos/1337477/pexels-photo-1337477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt={`${product.name} model`}
            fill
            style={{ objectFit: "cover" }}
            priority
            className="rounded-cardradius"
          />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="bg-white text-black min-h-screen overflow-auto">
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
                Experience Fashion in{" "}
                <span className="text-black">Stunning Detail</span>
              </h1>
              <p className="text-lg text-gray-700">
                Explore our premium shirts and shararas with high-quality
                imagery. Discover textures, colors and details like never
                before.
              </p>

              <div className="flex flex-row space-x-4 mt-8">
                <Link href="/api/auth/signup">
                  <Button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded text-base shadow-sm transition-all">
                    Sign Up
                  </Button>
                </Link>
                <Link href="/api/auth/login">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-black hover:bg-gray-100 px-6 py-2 rounded text-base transition-all"
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
            <div className="h-96">
              <FeaturedProductDisplay productType="shirt" />
            </div>
          </div>
        </div>

        <section id="collections" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 ">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Our Featured Collections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Premium Shirts",
                  description: "Handcrafted with the finest materials",
                  image:
                    "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600",
                },
                {
                  title: "Designer Shararas",
                  description: "The perfect blend of tradition and modernity",
                  image:
                    "https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&cs=tinysrgb&w=600",
                },
                {
                  title: "Complete Sets",
                  description: "Coordinated elegance for every occasion",
                  image:
                    "https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=600",
                },
              ].map((collection, index) => (
                <div
                  key={index}
                  className="bg-white rounded-cardradius overflow-hidden shadow-sm hover:shadow-md transition-shadow "
                >
                  <div className="h-64 overflow-hidden rounded-t-cardradius ">
                    <img
                      src={collection.image}
                      alt={collection.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {collection.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {collection.description}
                    </p>
                    <Button className="w-full bg-black hover:bg-gray-800 text-white !rounded-buttonradius">
                      Explore Collection
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
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
