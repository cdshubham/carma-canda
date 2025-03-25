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
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
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

  const formatProductInfo = (order: any) => {
    if (!order.products || order.products.length === 0) {
      return "No products";
    }

    const productTypes = order.products.map((p: any) => p.productType);
    const uniqueTypes = [...new Set(productTypes)];

    if (uniqueTypes.length === 1) {
      return `${order.totalItems} × ${uniqueTypes[0]}`;
    } else {
      return `${order.totalItems} items`;
    }
  };

  const handleViewOrder = (orderId: string) => {
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

  const handleAddOrder = async (data: any) => {
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
    } catch (error: any) {
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
      <div className="p-4 text-center text-red-600 !rounded-cardradius">
        <p>Error: {error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white !rounded-buttonradius"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-32 sm:pb-24 md:pb-16">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 pt-4">
        <h2 className="text-2xl font-bold">Orders</h2>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          disabled={isAddLoading}
          className="text-white bg-black w-full sm:w-auto !rounded-buttonradius btnbg"
        >
          Add New Order
        </Button>
      </div>

      <div className="w-full overflow-x-auto bg-gray-50 shadow-lg !rounded-cardradius sm:h-[calc(100vh-200px)] h-[calc(100vh-250px)]">
        <Table className="!rounded-cardradius">
          <TableHeader className="bg-black text-white !rounded-cardradius h-14">
            <TableRow className="!rounded-cardradius">
              <TableHead className="px-6 py-3">Order ID</TableHead>
              <TableHead className="px-6 py-3">Customer</TableHead>
              <TableHead className="px-6 py-3">Email</TableHead>
              <TableHead className="px-6 py-3">Products</TableHead>
              <TableHead className="px-6 py-3">Date</TableHead>
              <TableHead className="px-6 py-3 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <TableRow
                  key={order.orderId || order._id || order.trackingId}
                  className={`border-b border-gray-100 duration-200 ${index % 2 === 0 ? "bg-gray-50 hover:bg-gray-50" : "bg-white hover:bg-white"}`}
                >
                  <TableCell className="px-6 py-4 whitespace-nowrap font-medium text-gray-600">
                    {order.orderId || order.trackingId || order._id}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {order.customerName || order.userId || order.customerId}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {order.customerEmail}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {order.items
                      ? order.items.map((item: any) => item.productType).join(", ")
                      : formatProductInfo(order)}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {order.deliveryDate
                      ? new Date(order.deliveryDate).toLocaleDateString()
                      : new Date(
                        order.date || order.createdAt || Date.now()
                      ).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-black text-white px-4 !rounded-buttonradius btnhover"
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
