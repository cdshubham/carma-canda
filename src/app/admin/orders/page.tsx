"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Order {
  orderId: string;
  customerId: string;
  productId: string;
  size: string;
  date: string;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
}

const ordersData: Order[] = [
  {
    orderId: "001",
    customerId: "C001",
    productId: "P001",
    size: "L",
    date: "2024-06-20",
  },
  {
    orderId: "002",
    customerId: "C002",
    productId: "P002",
    size: "M",
    date: "2024-06-22",
  },
];

const customersData: Record<string, Customer> = {
  C001: { name: "John Doe", email: "john@example.com", phone: "1234567890" },
  C002: { name: "Jane Smith", email: "jane@example.com", phone: "0987654321" },
};

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  return (
    <div className="overflow-x-auto">
      <h1 className="text-xl font-bold mb-4">Orders</h1>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer ID</TableHead>
            <TableHead>Product ID</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordersData.map((order) => (
            <TableRow key={order.orderId}>
              <TableCell>{order.orderId}</TableCell>
              <TableCell>
                <Button
                  variant="link"
                  onClick={() =>
                    setSelectedCustomer(customersData[order.customerId])
                  }
                >
                  {order.customerId}
                </Button>
              </TableCell>
              <TableCell>{order.productId}</TableCell>
              <TableCell>{order.size}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>
                <Button onClick={() => setSelectedOrder(order)}>View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedOrder && (
        <Dialog
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            <p>
              <strong>Order ID:</strong> {selectedOrder.orderId}
            </p>
            <p>
              <strong>Customer ID:</strong> {selectedOrder.customerId}
            </p>
            <p>
              <strong>Product ID:</strong> {selectedOrder.productId}
            </p>
            <p>
              <strong>Size:</strong> {selectedOrder.size}
            </p>
            <p>
              <strong>Date:</strong> {selectedOrder.date}
            </p>
          </DialogContent>
        </Dialog>
      )}

      {selectedCustomer && (
        <Dialog
          open={!!selectedCustomer}
          onOpenChange={() => setSelectedCustomer(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
            </DialogHeader>
            <p>
              <strong>Name:</strong> {selectedCustomer.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedCustomer.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedCustomer.phone}
            </p>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
