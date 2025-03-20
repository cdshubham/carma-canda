"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useForm } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import { toast } from "@pheralb/toast";

import OrderModal from "@/components/OrderModal";

const Loader = () => (
  <div className="flex justify-center items-center h-64 w-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
  </div>
);

export default function OrdersPage() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { fetchData: fetchCustomers } = useFetch("/api/users/getusers", {
    method: "GET",
  });
  const { fetchData: fetchOrders } = useFetch("/api/getorders", {
    method: "GET",
  });
  const { fetchData: addOrder } = useFetch("/api/saveorders", {
    method: "POST",
  });

  const form = useForm({
    defaultValues: {
      customerName: "",
    },
  });

  useEffect(() => {
    const getData = async () => {
      setIsInitialLoading(true);
      try {
        console.log("Fetching initial data...");
        const [ordersRes, customersRes] = await Promise.all([
          fetchOrders(),
          fetchCustomers(),
        ]);
        console.log("Orders response:", ordersRes);
        console.log("Customers response:", customersRes);

        if (ordersRes?.success) setOrders(ordersRes.data);
        if (customersRes?.success) setCustomers(customersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error({ text: "Failed to load data" });
      } finally {
        setIsInitialLoading(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    console.log("Updated Orders state:", orders);
  }, [orders]);

  useEffect(() => {
    console.log("Updated Customers state:", customers);
  }, [customers]);

  const handleAddOrder = async (data) => {
    setIsLoading(true);
    console.log("Handle add order called with data:", data);

    try {
      // Map form field names to expected API field names
      const orderData = {
        userId: data.customerName, // Map customerName to userId as expected by API
        trackingId: data.trackingId,
        dnNumber: data.dnNumber || undefined,
        deliveryDate: data.deliveryDate,
        items: data.items, // This comes from the OrderModal component
      };

      console.log("Prepared order data for API:", orderData);
      const response = await addOrder(orderData);
      console.log("API response:", response);

      if (response?.success) {
        toast.success({ text: "Order added successfully" });

        // Update the orders list with the new order
        if (response.order) {
          setOrders((prev) => [...prev, response.order]);
        } else {
          // Refetch the orders to get the updated list
          console.log("Refetching orders...");
          const ordersRes = await fetchOrders();
          if (ordersRes?.success) setOrders(ordersRes.data);
        }

        setIsAddModalOpen(false);
        form.reset();
      } else {
        throw new Error(response?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error adding order:", error);
      toast.error({ text: error.message || "Error adding order" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    console.log("Closing modal and resetting form");
    setIsAddModalOpen(false);
    form.reset();
  };

  // Function to format product details for display
  const formatProductDetails = (order) => {
    if (!order.items || order.items.length === 0) {
      return "No products";
    }

    return order.items.map((item) => item.productType).join(", ");
  };

  // Function to get the first product's size for display (or multiple sizes)
  const getOrderSizes = (order) => {
    if (!order.items || order.items.length === 0) {
      return "-";
    }

    // if (order.items.length === 1) {
    //   const item = order.items[0];
    //   if (item.productType === "shirt" && item.measurements?.shirtMeasurements?.bust?.value) {
    //     return ${item.measurements.shirtMeasurements.bust.value} ${item.measurements.shirtMeasurements.bust.unit || 'in'};
    //   } else if (item.productType === "sharara" && item.measurements?.shararaMeasurements?.shararaWaist?.value) {
    //     return ${item.measurements.shararaMeasurements.shararaWaist.value} ${item.measurements.shararaMeasurements.shararaWaist.unit || 'in'};
    //   }
    //   return item.size || "-";
    // }

    // return ${order.items.length} items;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button
          onClick={() => {
            console.log("Opening add modal");
            setIsAddModalOpen(true);
          }}
          disabled={isLoading || isInitialLoading}
          className="text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md"
        >
          Add New Order
        </Button>
      </div>

      <div className="w-full overflow-x-auto shadow-lg rounded-lg sm:h-[calc(100vh-200px)] h-[calc(100vh-150px)]">
        {isInitialLoading ? (
          <Loader />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Sizes</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order._id || order.trackingId} className="m-4">
                    <TableCell className="py-4 whitespace-nowrap">
                      {order.trackingId || order._id}
                    </TableCell>
                    <TableCell className="py-4 whitespace-nowrap">
                      {order.userId || order.customerId}
                    </TableCell>
                    <TableCell className="py-4 whitespace-nowrap">
                      {formatProductDetails(order)}
                    </TableCell>
                    <TableCell className="py-4 whitespace-nowrap">
                      {getOrderSizes(order)}
                    </TableCell>
                    <TableCell className="py-4 whitespace-nowrap">
                      {order.deliveryDate
                        ? new Date(order.deliveryDate).toLocaleDateString()
                        : new Date(
                            order.createdAt || Date.now()
                          ).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Order Modal with multi-product support */}
      <OrderModal
        isAddModalOpen={isAddModalOpen}
        handleCloseModal={handleCloseModal}
        form={form}
        handleAddOrder={handleAddOrder}
        isLoading={isLoading}
        customers={customers}
      />
    </div>
  );
}
