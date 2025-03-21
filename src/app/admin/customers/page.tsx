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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useFetch from "@/hooks/useFetch";
import { toast } from "@pheralb/toast";
import CustomerModal from "@/components/CustomerAndOrderModal";

interface Customer {
  id: string;
  _id?: string;
  name?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
}

interface DetailedCustomer extends Customer {
  gender?: string;
  birthday?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
  };
  spouse?: {
    first_name?: string;
    last_name?: string;
    gender?: string;
    birthday?: string;
  };
  anniversary?: string;
  children?: Array<{
    first_name?: string;
    last_name?: string;
    gender?: string;
    birthday?: string;
  }>;
  social_media?: Array<{
    platform?: string;
    url?: string;
  }>;
  role?: string;
  createdAt?: string;
}

interface ValidationError {
  name: string;
  email: string;
  phone: string;
}

const Loader = () => (
  <div className="flex justify-center items-center h-64 w-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
  </div>
);

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<ValidationError>({
    name: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { fetchData: addCustomer } = useFetch("/api/users/useradd", {
    method: "POST",
  });

  const { fetchData: fetchCustomers } = useFetch("/api/users/getusers", {
    method: "GET",
  });

  useEffect(() => {
    const getCustomers = async () => {
      setIsInitialLoading(true);
      try {
        const response = await fetchCustomers();
        console.log(response);

        if (response && response.data) {
          setCustomers(response.data);
        } else {
          toast.error({ text: "Failed to fetch customers" });
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error({ text: "Failed to fetch customers" });
      } finally {
        setIsInitialLoading(false);
      }
    };

    getCustomers();
  }, []);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        return value.trim().length < 2
          ? "Name must be at least 2 characters"
          : "";
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value)
          ? "Please enter a valid email address"
          : "";
      case "phone":
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        return !phoneRegex.test(value)
          ? "Please enter a valid phone number"
          : "";
      default:
        return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));

    const errorMessage = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  const validateForm = (): boolean => {
    const nameError = validateField("name", newCustomer.name);
    const emailError = validateField("email", newCustomer.email);
    const phoneError = validateField("phone", newCustomer.phone);

    setErrors({
      name: nameError,
      email: emailError,
      phone: phoneError,
    });

    return !nameError && !emailError && !phoneError;
  };

  const handleAddCustomer = async () => {
    if (!validateForm()) {
      toast.error({ text: "Please correct the form errors" });
      return;
    }

    const randomPassword = Math.random().toString(36).slice(-8);
    const customerData = {
      username: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      password: randomPassword,
    };

    setIsLoading(true);

    try {
      const response = await addCustomer(customerData);
      if (response && response.savedUser) {
        const formattedCustomer: Customer = {
          id: response.savedUser._id,
          name: response.savedUser.username || newCustomer.name,
          email: response.savedUser.email || newCustomer.email,
          phone: response.savedUser.phone || newCustomer.phone,
        };

        setCustomers((prev) => [...prev, formattedCustomer]);
        setNewCustomer({ name: "", email: "", phone: "" });
        setErrors({ name: "", email: "", phone: "" });
        setIsModalOpen(false);
        toast.success({ text: "Customer added successfully" });
      } else {
        toast.error({ text: "Failed to add customer" });
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      toast.error({ text: "Failed to add customer. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
  };

  const handleCloseCustomerModal = () => {
    setSelectedCustomerId(null);
  };

  const getDisplayName = (customer: Customer): string => {
    if (customer.first_name && customer.last_name) {
      return `${customer.first_name} ${customer.last_name}`;
    } else if (customer.username) {
      return customer.username;
    } else if (customer.name) {
      return customer.name;
    }
    return "Unknown";
  };

  return (
    <div className="container mx-auto px-4 pb-32 sm:pb-24 md:pb-16">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 pt-4">
        <h2 className="text-2xl font-bold">Customers</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="text-white bg-black hover:bg-gray-600 w-full sm:w-auto"
          disabled={isInitialLoading}
        >
          Add New Customer
        </Button>
      </div>

      <div className="w-full overflow-x-auto shadow rounded-lg sm:h-[calc(100vh-200px)] h-[calc(100vh-250px)]">
        {isInitialLoading ? (
          <Loader />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-gray-50 px-6 py-3">
                  Customer ID
                </TableHead>
                <TableHead className="bg-gray-50 px-6 py-3">Name</TableHead>
                <TableHead className="bg-gray-50 px-6 py-3">Email</TableHead>
                <TableHead className="bg-gray-50 px-6 py-3">Phone</TableHead>
                <TableHead className="bg-gray-50 px-6 py-3">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <TableRow
                    key={customer._id || customer.id}
                    className="border-b"
                  >
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {customer._id || customer.id}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {getDisplayName(customer)}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {customer.email}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {customer.phoneNumber || customer.phone || "N/A"}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Button
                        onClick={() =>
                          handleViewCustomer(customer._id || customer.id)
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No customers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add Customer Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  name="name"
                  value={newCustomer.name}
                  onChange={handleInputChange}
                  className={`w-full ${errors.name ? "border-red-500" : ""}`}
                  onBlur={() => {
                    const nameError = validateField("name", newCustomer.name);
                    setErrors((prev) => ({ ...prev, name: nameError }));
                  }}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <div className="col-span-3">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={handleInputChange}
                  className={`w-full ${errors.email ? "border-red-500" : ""}`}
                  onBlur={() => {
                    const emailError = validateField(
                      "email",
                      newCustomer.email
                    );
                    setErrors((prev) => ({ ...prev, email: emailError }));
                  }}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <div className="col-span-3">
                <Input
                  id="phone"
                  name="phone"
                  value={newCustomer.phone}
                  onChange={handleInputChange}
                  className={`w-full ${errors.phone ? "border-red-500" : ""}`}
                  onBlur={() => {
                    const phoneError = validateField(
                      "phone",
                      newCustomer.phone
                    );
                    setErrors((prev) => ({ ...prev, phone: phoneError }));
                  }}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCustomer}
              disabled={
                isLoading || !!errors.name || !!errors.email || !!errors.phone
              }
              className="bg-black text-white hover:bg-gray-700 disabled:bg-gray-300"
            >
              {isLoading ? "Adding..." : "Add Customer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Replace the old view modal with CustomerModal */}
      {selectedCustomerId && (
        <CustomerModal
          isOpen={!!selectedCustomerId}
          onClose={handleCloseCustomerModal}
          userId={selectedCustomerId}
        />
      )}
    </div>
  );
}
