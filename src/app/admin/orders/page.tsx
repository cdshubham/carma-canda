"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import OrderDetailsModal from "@/components/OrderDetailsModal";
import OrderModal from "@/components/OrderModal";
import { useForm } from "react-hook-form";
import { toast } from "@pheralb/toast";

const OrdersTable2 = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      customerName: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersResponse, customersResponse] = await Promise.all([
          fetch("/api/getorders"),
          fetch("/api/users/getusers"),
        ]);

        const ordersResult = await ordersResponse.json();
        const customersResult = await customersResponse.json();

        if (ordersResult.success) {
          setOrders(ordersResult.data);
        } else {
          setError(ordersResult.message || "Failed to fetch orders");
        }

        if (customersResult.success) {
          setCustomers(customersResult.data);
        } else {
          console.error("Failed to fetch customers:", customersResult.message);
        }
      } catch (error) {
        setError("Error connecting to the server");
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatProductInfo = (order) => {
    if (!order.products || order.products.length === 0) {
      return "No products";
    }

    const productTypes = order.products.map((p) => p.productType);
    const uniqueTypes = [...new Set(productTypes)];

    if (uniqueTypes.length === 1) {
      return `${order.totalItems} × ${uniqueTypes[0]}`;
    } else {
      return `${order.totalItems} items`;
    }
  };

  const handleViewOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedOrderId(null), 300);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    form.reset();
  };

  const handleAddOrder = async (data) => {
    setIsAddLoading(true);

    console.log("orderData", data);
    try {
      const requestBody = {
        userId: data.customerId,
        trackingId: data.trackingId,
        dnNumber: data.dnNumber || undefined,
        deliveryDate: data.deliveryDate,
        items: data.items,
      };

      console.log("Request body:", requestBody);

      const response = await fetch("/api/saveorders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (result.success) {
        toast.success({ text: "Order added successfully" });

        if (result.order) {
          setOrders((prev) => [...prev, result.order]);
        } else {
          // Refetch the orders to get the updated list
          const ordersRes = await fetch("/api/getorders");
          const ordersResult = await ordersRes.json();
          if (ordersResult.success) setOrders(ordersResult.data);
        }

        setIsAddModalOpen(false);
        form.reset();
      } else {
        throw new Error(result.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error adding order:", error);
      toast.error({ text: error.message || "Error adding order" });
    } finally {
      setIsAddLoading(false);
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>Error: {error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          disabled={isAddLoading}
          className="text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md"
        >
          Add New Order
        </Button>
      </div>

      <div className="w-full overflow-x-auto shadow-lg rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow
                  key={order.orderId || order._id || order.trackingId}
                  className="hover:bg-slate-50"
                >
                  <TableCell className="font-medium">
                    {order.orderId || order.trackingId || order._id}
                  </TableCell>
                  <TableCell>
                    {order.customerName || order.userId || order.customerId}
                  </TableCell>
                  <TableCell>{order.customerEmail}</TableCell>
                  <TableCell>
                    {order.items
                      ? order.items.map((item) => item.productType).join(", ")
                      : formatProductInfo(order)}
                  </TableCell>
                  <TableCell>
                    {order.deliveryDate
                      ? new Date(order.deliveryDate).toLocaleDateString()
                      : new Date(
                          order.date || order.createdAt || Date.now()
                        ).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 rounded-md"
                      onClick={() =>
                        handleViewOrder(
                          order.orderId || order._id || order.trackingId
                        )
                      }
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        orderId={selectedOrderId}
      />

      {/* Add Order Modal */}
      <OrderModal
        isAddModalOpen={isAddModalOpen}
        handleCloseModal={handleCloseAddModal}
        form={form}
        handleAddOrder={handleAddOrder}
        isLoading={isAddLoading}
        customers={customers}
      />
    </div>
  );
};

export default OrdersTable2;
