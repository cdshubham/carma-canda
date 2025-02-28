"use client";
import { useEffect, useState, useCallback } from "react";
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

const orderFormSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  size: z.string().min(1, "Size is required"),
  customerId: z.string().min(1, "Customer is required"),
});

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const fetchOrdersCallback = useCallback(fetchOrders, []);
  const fetchCustomersCallback = useCallback(fetchCustomers, []);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const [ordersRes, customersRes] = await Promise.all([
        fetchOrdersCallback(),
        fetchCustomersCallback(),
      ]);
      if (ordersRes?.success) setOrders(ordersRes.data);
      if (customersRes?.success) setCustomers(customersRes.data);
      setIsLoading(false);
    };
    getData();
  }, [fetchOrdersCallback, fetchCustomersCallback]);

  const handleAddOrder = async (data) => {
    console.log("💥✔️🤔", data);

    setIsLoading(true);
    const response = await addOrder({
      body: JSON.stringify({ ...data, timestamp: new Date().toISOString() }),
    });
    if (response?.success) {
      setOrders([
        ...orders,
        {
          ...data,
          orderId: response.data.orderId,
          date: new Date().toISOString().split("T")[0],
        },
      ]);
      setIsAddModalOpen(false);
      form.reset();
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button onClick={() => setIsAddModalOpen(true)} disabled={isLoading}>
          Add New Order
        </Button>
      </div>

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
          {orders.map((order) => (
            <TableRow key={order.orderId}>
              <TableCell>{order.orderId}</TableCell>
              <TableCell>{order.customerId}</TableCell>
              <TableCell>{order.productId}</TableCell>
              <TableCell>{order.size}</TableCell>
              <TableCell>{order.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
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
                onClick={() => setIsAddModalOpen(false)}
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
