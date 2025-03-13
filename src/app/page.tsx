"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

function ShirtModel({ color, setIsHovered }) {
  const { scene } = useGLTF("/models/mens_long_sleeve_shirt.glb");
  console.log("color", color);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          const newMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            roughness: 0.4,
            metalness: 0.2,
          });

          if (child.material.map) newMaterial.map = child.material.map;
          if (child.material.normalMap)
            newMaterial.normalMap = child.material.normalMap;

          child.material = newMaterial;
        }
      }
    });
  }, [scene, color]);

  return (
    <primitive
      object={scene}
      scale={5.5}
      position={[0, -8.5, 0]} // Adjusted position to center vertically
      rotation={[0, Math.PI / 8, 0]} // Slight rotation for better viewing angle
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    />
  );
}

function FeaturedProductScene({ productType = "shirt" }) {
  const [hovered, setIsHovered] = useState(false);
  const [color, setColor] = useState("#3c4f7a");

  const availableColors = [
    "#3c4f7a", // Navy Blue
    "#835c3b", // Brown
    "#1d1d1d", // Black
    "#792626", // Maroon
    "#307428", // Green
  ];

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

  const currentProduct = productInfo[productType] || productInfo.shirt;

  return (
    <div className="relative w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 0, 8], fov: 40 }} // Adjusted camera settings
        dpr={[1, 2]}
      >
        <Suspense
          fallback={
            <Html center>
              <div className="flex items-center justify-center p-4 bg-white bg-opacity-75 rounded-lg shadow">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mr-2"></div>
                <div className="text-black font-medium">
                  Loading 3D Model...
                </div>
              </div>
            </Html>
          }
        >
          <ambientLight intensity={50} /> {/* Increased ambient light */}
          <spotLight
            position={[50, 50, 10]}
            angle={0.15}
            penumbra={1}
            intensity={10} // Increased intensity
            castShadow
          />
          <pointLight position={[-10, -10, -10]} intensity={0.8} />{" "}
          {/* Increased intensity */}
          <pointLight position={[5, 5, -5]} intensity={0.5} />{" "}
          {/* Additional light source */}
          <ShirtModel setIsHovered={setIsHovered} color={color} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            autoRotate={!hovered}
            autoRotateSpeed={2}
            target={[0, 0, 0]} // Explicitly set the target to the center
          />
        </Suspense>
      </Canvas>

      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        {availableColors.map((c) => (
          <ColorSwatch
            key={c}
            color={c}
            isSelected={color === c}
            onClick={setColor}
          />
        ))}
      </div>

      <ProductInfo
        type={currentProduct.type}
        price={currentProduct.price}
        name={currentProduct.name}
        visible={hovered}
      />

      <div className="absolute top-4 right-4 bg-white bg-opacity-70 px-3 py-1 rounded text-sm">
        Interact with model • Try different colors
      </div>
    </div>
  );
}
// Fabric Texture Swatches
function ColorSwatch({ color, isSelected, onClick }) {
  return (
    <div
      className={`w-8 h-8 rounded-full cursor-pointer transition-all transform hover:scale-110 ${isSelected ? "ring-2 ring-black ring-offset-2" : ""}`}
      style={{ backgroundColor: color }}
      onClick={() => onClick(color)}
    />
  );
}

// Info Card that appears when a product is hovered
function ProductInfo({ type, price, name, visible }) {
  if (!visible) return null;

  return (
    <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 p-4 rounded shadow-lg transform transition-all duration-300 ease-in-out">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">{type}</p>
      <p className="text-lg font-bold mt-1">${price}</p>
      <Button className="mt-2 w-full bg-black hover:bg-gray-800 text-white">
        View Details
      </Button>
    </div>
  );
}

useGLTF.preload("/models/mens_long_sleeve_shirt.glb");

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
                <span className="text-black">3D Realism</span>
              </h1>
              <p className="text-lg text-gray-700">
                Interact with our premium shirts and shararas in immersive 3D.
                Explore textures, colors and details like never before.
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
              <FeaturedProductScene productType="shirt" />
            </div>
          </div>
        </div>

        <section id="collections" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
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
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-64 overflow-hidden">
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
                    <Button className="w-full bg-black hover:bg-gray-800 text-white">
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
