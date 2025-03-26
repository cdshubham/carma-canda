"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

// Define TypeScript interfaces for our data
interface Measurement {
  value: number;
  unit: string;
}

interface ShirtMeasurements {
  shirtLength: Measurement;
  dartPoint: Measurement;
  upperBust: Measurement;
  bust: Measurement;
  waist: Measurement;
  hips: Measurement;
  frontNeck: Measurement;
  backNeck: Measurement;
  tira: Measurement;
  sleevesLength: Measurement;
  moriSleeveless: Measurement;
  biceps: Measurement;
  armhole: Measurement;
}

interface ShararaMeasurements {
  shararaLength: Measurement;
  shararaWaist: Measurement;
  hips: Measurement;
  thigh: Measurement;
}

interface OrderItem {
  productId: string;
  productType: "shirt" | "sharara";
  colour: string;
  quantity: number;
  measurements: {
    shirtMeasurements?: ShirtMeasurements;
    shararaMeasurements?: ShararaMeasurements;
  };
}

interface Order {
  _id: string;
  userId: string;
  trackingId: string;
  dnNumber: string;
  deliveryDate: string;
  items: OrderItem[];
  createdAt: string;
}

export default function OrdersPage() {
  const { data: session } = useSession();
  const id = session?.user?.id;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${id}/orders`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch orders");
        }

        setOrders(result.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrders();
    }
  }, [id]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">Your Orders</h1>
          <p className="text-gray-600 mt-2">
            View and track all your custom clothing orders
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-700">Loading...</div>
          </div>
        ) : error ? (
          <div className="bg-gray-100 border-l-4 border-black text-gray-900 p-4 rounded shadow-md">
            <p>{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">
              No Orders Found
            </h2>
            <p className="text-gray-500 mt-2">
              {/* You haven't placed any orders yet. */}
              <p>{`You haven't placed any orders yet.`}</p>
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="py-4 px-6 text-left">Order ID</th>
                    <th className="py-4 px-6 text-left">Date</th>
                    <th className="py-4 px-6 text-left">Items</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={order._id}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="py-4 px-6 border-b border-gray-100">
                        <span className="font-mono text-sm text-gray-600">
                          {order._id}
                        </span>
                      </td>
                      <td className="py-4 px-6 border-b border-gray-100">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-4 px-6 border-b border-gray-100">
                        <div>
                          <span className="bg-gray-200 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                            {order.items.length} item
                            {order.items.length !== 1 ? "s" : ""}
                          </span>
                          <span className="text-gray-600 text-sm">
                            {order.items
                              .map((item) => item.productType)
                              .join(", ")}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 border-b border-gray-100 text-center">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="bg-black text-white px-4 !rounded-cardradius btnhover"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4 bg-black">
                <h2 className="text-xl font-bold text-white">Order Details</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white hover:text-gray-300 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="overflow-y-auto p-6 max-h-[calc(90vh-4rem)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-gray-500 text-sm mb-1">Order ID</h3>
                    <p className="font-medium">{selectedOrder._id}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm mb-1">Order Date</h3>
                    <p className="font-medium">
                      {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm mb-1">
                      Tracking Number
                    </h3>
                    <p className="font-medium">
                      {selectedOrder.dnNumber || "Not assigned yet"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm mb-1">
                      Delivery Date
                    </h3>
                    <p className="font-medium">
                      {selectedOrder.deliveryDate
                        ? formatDate(selectedOrder.deliveryDate)
                        : "Not scheduled yet"}
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                  Order Items ({selectedOrder.items.length})
                </h3>

                <div className="space-y-6">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={item.productId || index}
                      className="bg-gray-50 rounded-cardradius p-4 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-medium capitalize text-gray-900">
                            {item.productType}
                          </h4>
                          <div className="flex items-center mt-1 space-x-3">
                            <span className="inline-flex items-center">
                              <span
                                className="w-3 h-3 rounded-full mr-2 border border-gray-300"
                                style={{ backgroundColor: item.colour }}
                              ></span>
                              <span className="text-gray-600 capitalize">
                                {item.colour}
                              </span>
                            </span>
                            <span className="text-gray-600">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="inline-block px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-medium">
                          ID: {item.productId}
                        </span>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <h5 className="font-medium text-gray-700 mb-3">
                          Measurements
                        </h5>

                        {item.productType === "shirt" &&
                          item.measurements.shirtMeasurements && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {Object.entries(
                                item.measurements.shirtMeasurements
                              ).map(
                                ([key, measurement]) =>
                                  measurement && (
                                    <div
                                      key={key}
                                      className="bg-white p-3 rounded border border-gray-200"
                                    >
                                      <span className="text-xs text-gray-500 block capitalize">
                                        {key.replace(/([A-Z])/g, " $1").trim()}
                                      </span>
                                      <span className="font-medium">
                                        {measurement.value} {measurement.unit}
                                      </span>
                                    </div>
                                  )
                              )}
                            </div>
                          )}

                        {item.productType === "sharara" &&
                          item.measurements.shararaMeasurements && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {Object.entries(
                                item.measurements.shararaMeasurements
                              ).map(
                                ([key, measurement]) =>
                                  measurement && (
                                    <div
                                      key={key}
                                      className="bg-white p-3 rounded border border-gray-200"
                                    >
                                      <span className="text-xs text-gray-500 block capitalize">
                                        {key.replace(/([A-Z])/g, " $1").trim()}
                                      </span>
                                      <span className="font-medium">
                                        {measurement.value} {measurement.unit}
                                      </span>
                                    </div>
                                  )
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-black hover:bg-gray-800 text-white font-medium !rounded-buttonradius"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
