"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@pheralb/toast";

const orderFormSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  size: z.string().min(1, "Size is required"),
  customerId: z.string().min(1, "Customer is required"),
});

const Loader = () => (
  <div className="flex justify-center items-center h-64 w-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
  </div>
);

export default function OrdersPage() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

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
    resolver: zodResolver(orderFormSchema),
    defaultValues: { productId: "", size: "", customerId: "" },
  });

  useEffect(() => {
    const getData = async () => {
      setIsInitialLoading(true);
      try {
        const [ordersRes, customersRes] = await Promise.all([
          fetchOrders(),
          fetchCustomers(),
        ]);
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

  const handleAddOrder = async (data) => {
    setIsLoading(true);
    try {
      const response = await addOrder(data);
      toast.success({ text: "Order added successfully" });
      const newOrder = {
        orderId: response.order.orderId,
        productId: data.productId,
        size: data.size,
        customerId: data.customerId,
        date: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
      };

      setOrders((prev) => [...prev, newOrder]);
    } catch (error) {
      console.error("Error adding order:", error);
      toast.error({ text: "Error adding order" });
    } finally {
      form.reset();
      setIsAddModalOpen(false);
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    form.reset();
    setIsAddModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          disabled={isLoading || isInitialLoading}
          className="text-white bg-black hover:bg-gray-800"
        >
          Add New Order
        </Button>
      </div>

      <div className="w-full overflow-x-auto shadow rounded-lg sm:h-[calc(100vh-200px)] h-[calc(100vh-150px)]">
        {isInitialLoading ? (
          <Loader />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order.orderId || order._id} className="m-4">
                    <TableCell className="py-4 whitespace-nowrap">
                      {order.orderId || order._id}
                    </TableCell>
                    <TableCell className="py-4 whitespace-nowrap">
                      {order.customerId}
                    </TableCell>
                    <TableCell className="py-4 whitespace-nowrap">
                      {order.productId}
                    </TableCell>
                    <TableCell className="py-4 whitespace-nowrap">
                      {order.size}
                    </TableCell>
                    <TableCell className="py-4 whitespace-nowrap">
                      {order.date ||
                        new Date(order.createdAt || Date.now())
                          .toISOString()
                          .split("T")[0]}
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

      <Dialog open={isAddModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add New Order</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(handleAddOrder)}
            className="space-y-4 "
          >
            <div>
              <label className="block font-medium">Product ID</label>
              <input
                type="text"
                {...form.register("productId")}
                className="w-full border p-2"
              />
              {form.formState.errors.productId && (
                <p className="text-red-500">
                  {form.formState.errors.productId.message}
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium">Size</label>
              <select {...form.register("size")} className="w-full border p-2">
                <option value="">Select size</option>
                {["XS", "S", "M", "L", "XL"].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              {form.formState.errors.size && (
                <p className="text-red-500">
                  {form.formState.errors.size.message}
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium">Customer</label>
              <select
                {...form.register("customerId")}
                className="w-full border p-2"
                disabled={isInitialLoading}
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.email}
                  </option>
                ))}
              </select>
              {form.formState.errors.customerId && (
                <p className="text-red-500">
                  {form.formState.errors.customerId.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Order"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
