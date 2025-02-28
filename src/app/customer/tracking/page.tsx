"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface TrackingHistoryItem {
  date: string;
  event: string;
  isCompleted?: boolean;
}

interface TrackingInfo {
  status: string;
  estimatedDelivery: string;
  history: TrackingHistoryItem[];
}

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTrackingInfo = () => {
    if (!trackingNumber.trim()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setTrackingInfo({
        status: "In Transit",
        estimatedDelivery: "2025-03-05",
        history: [
          {
            date: "19 Nov 2023, 10:45",
            event: "Order placed - Receipt #647563",
            isCompleted: true,
          },
          {
            date: "19 Nov 2023, 10:47",
            event: "Payment accepted - VISA Credit Card",
            isCompleted: true,
          },
          {
            date: "22 Nov 2023, 12:27",
            event: "Products delivered to the courier - DHL Express",
            isCompleted: true,
          },
          {
            date: "23 Nov 2023, 15:15",
            event: "Products in the courier's warehouse",
            isCompleted: true,
          },
          {
            date: "Today",
            event: "Products being delivered",
            isCompleted: false,
          },
          {
            date: "Estimated Delivery",
            event: "Estimated delivery on 24 Nov 2023",
            isCompleted: false,
          },
        ],
      });
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className=" flex flex-col items-center justify-start p-6 bg-white text-black h-screen overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-2 text-black">
            Track Your Order
          </h2>
          <p className="text-gray-600">
            Enter your tracking number to see your order status and delivery
            updates
          </p>
        </div>

        <div className="relative mb-12 w-full max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <Input
            className="bg-white border border-gray-300 focus:border-black text-black pl-10 pr-20 py-4 rounded-lg w-full shadow-md focus:ring-2 focus:ring-black/20 transition-all duration-300"
            placeholder="Enter your tracking number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <Button
            className={`absolute right-0 top-0 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md shadow-md transition-all duration-300 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            onClick={fetchTrackingInfo}
            disabled={isLoading || !trackingNumber.trim()}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Tracking...
              </span>
            ) : (
              "Track"
            )}
          </Button>
        </div>

        {trackingInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 h-1 w-full bg-black"></div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h3 className="text-sm text-gray-600 mb-1">Order Number</h3>
                  <p className="text-xl font-bold font-mono">
                    {trackingNumber}
                  </p>
                </div>

                <div className="mt-4 md:mt-0">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      trackingInfo.status === "Delivered"
                        ? "bg-black text-white"
                        : trackingInfo.status === "In Transit"
                          ? "bg-black text-white"
                          : "bg-black text-white"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full mr-2 ${
                        trackingInfo.status === "Delivered"
                          ? "bg-white"
                          : trackingInfo.status === "In Transit"
                            ? "bg-white"
                            : "bg-white"
                      }`}
                    ></span>
                    {trackingInfo.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-sm text-gray-600 mb-1">Shipped Via</h3>
                  <p className="font-medium">DHL Express</p>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-sm text-gray-600 mb-1">
                    Estimated Delivery
                  </h3>
                  <p className="font-medium">March 5, 2025</p>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-sm text-gray-600 mb-1">Last Updated</h3>
                  <p className="font-medium">Today, 15:35</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Shipment History
              </h3>

              <ol className="relative border-l border-gray-300">
                {trackingInfo.history.map((item, index) => (
                  <li
                    key={index}
                    className={`mb-6 ml-6 ${
                      index === trackingInfo.history.length - 1 ? "" : ""
                    }`}
                  >
                    <span
                      className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ${
                        item.isCompleted === false
                          ? "bg-white border border-gray-300"
                          : "bg-black"
                      }`}
                    >
                      {item.isCompleted === false ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-3 w-3 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>

                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`p-4 rounded-lg ${
                        item.isCompleted === false
                          ? "bg-white border border-gray-200"
                          : item.date === "Today"
                            ? "bg-black text-white"
                            : "bg-gray-100"
                      }`}
                    >
                      <time
                        className={`mb-1 text-sm font-normal ${
                          item.date === "Today" && item.isCompleted === false
                            ? "text-gray-600 "
                            : item.date === "Estimated Delivery"
                              ? "text-gray-600"
                              : "text-gray-500"
                        }`}
                      >
                        {item.date}
                      </time>
                      <h4
                        className={`text-base font-semibold ${
                          item.isCompleted === false && item.date === "Today"
                            ? "text-black"
                            : item.isCompleted === false
                              ? "text-gray-800"
                              : "text-black"
                        }`}
                      >
                        {item.event}
                      </h4>
                    </motion.div>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
