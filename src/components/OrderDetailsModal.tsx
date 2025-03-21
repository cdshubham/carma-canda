"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useFetch from "@/hooks/useFetch";
import { toast } from "@pheralb/toast";

const Loader = () => (
  <div className="flex justify-center items-center h-32 w-full">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
  </div>
);

export default function OrderDetailsModal({ isOpen, onClose, orderId }) {
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { fetchData: fetchOrderDetails } = useFetch(
    orderId ? `/api/getorders/${orderId}` : null,
    { method: "GET" }
  );

  useEffect(() => {
    if (isOpen && orderId) {
      const getOrderDetails = async () => {
        setIsLoading(true);
        try {
          const response = await fetchOrderDetails();
          if (response?.success) {
            setOrderDetails(response.data);
          } else {
            throw new Error(
              response?.message || "Failed to fetch order details"
            );
          }
        } catch (error) {
          console.error("Error fetching order details:", error);
          toast.error({
            text: error.message || "Error fetching order details",
          });
        } finally {
          setIsLoading(false);
        }
      };

      getOrderDetails();
    }
  }, [isOpen, orderId]);

  // Format date
  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";
  };

  // Format measurement with unit
  const formatMeasurement = (measurement) => {
    if (!measurement || !measurement.value) return "N/A";
    return `${measurement.value} ${measurement.unit || "in"}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white text-black border-gray-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black">
            Order Details
            {orderDetails?.order?.trackingId && (
              <span className="ml-2 text-gray-600 text-base">
                ({orderDetails.order.trackingId})
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <Loader />
        ) : orderDetails ? (
          <Tabs defaultValue="customer" className="w-full">
            <TabsList className="w-full mb-4 bg-gray-100">
              <TabsTrigger
                value="customer"
                className="flex-1 text-black data-[state=active]:bg-white"
              >
                Customer Information
              </TabsTrigger>
              <TabsTrigger
                value="order"
                className="flex-1 text-black data-[state=active]:bg-white"
              >
                Order Details
              </TabsTrigger>
              <TabsTrigger
                value="measurements"
                className="flex-1 text-black data-[state=active]:bg-white"
              >
                Measurements
              </TabsTrigger>
            </TabsList>

            {/* Customer Information Tab */}
            <TabsContent value="customer">
              <Card className="border border-gray-200 bg-white">
                <CardHeader className="bg-white">
                  <CardTitle className="text-black">
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-black">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-black">Name</p>
                      <p>{orderDetails.customer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">Email</p>
                      <p>{orderDetails.customer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">Phone</p>
                      <p>{orderDetails.customer.phone || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">Gender</p>
                      <p>{orderDetails.customer.gender || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">Birthday</p>
                      <p>{formatDate(orderDetails.customer.birthday)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">
                        Anniversary
                      </p>
                      <p>{formatDate(orderDetails.customer.anniversary)}</p>
                    </div>
                  </div>

                  {/* Address Information */}
                  {orderDetails.customer.address && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2 text-black">
                        Address
                      </p>
                      <p>
                        {[
                          orderDetails.customer.address.street,
                          orderDetails.customer.address.city,
                          orderDetails.customer.address.state,
                          orderDetails.customer.address.zip_code,
                          orderDetails.customer.address.country,
                        ]
                          .filter(Boolean)
                          .join(", ") || "N/A"}
                      </p>
                    </div>
                  )}

                  {/* Spouse Information */}
                  {orderDetails.customer.spouse &&
                    orderDetails.customer.spouse.first_name && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2 text-black">
                          Spouse
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-black">
                              Name
                            </p>
                            <p>
                              {`${orderDetails.customer.spouse.first_name} ${
                                orderDetails.customer.spouse.last_name || ""
                              }`.trim()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-black">
                              Birthday
                            </p>
                            <p>
                              {formatDate(
                                orderDetails.customer.spouse.birthday
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Children Information */}
                  {orderDetails.customer.children &&
                    orderDetails.customer.children.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2 text-black">
                          Children
                        </p>
                        {orderDetails.customer.children.map((child, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-3 gap-4 mb-2"
                          >
                            <div>
                              <p className="text-sm font-medium text-black">
                                Name
                              </p>
                              <p>
                                {`${child.first_name} ${child.last_name || ""}`.trim()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-black">
                                Gender
                              </p>
                              <p>{child.gender || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-black">
                                Birthday
                              </p>
                              <p>{formatDate(child.birthday)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Order Details Tab */}
            <TabsContent value="order">
              <Card className="border border-gray-200 bg-white">
                <CardHeader className="bg-white">
                  <CardTitle className="text-black">
                    Order Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-black">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-black">Order ID</p>
                      <p>{orderDetails.order.orderId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">
                        Tracking ID
                      </p>
                      <p>{orderDetails.order.trackingId || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">
                        DN Number
                      </p>
                      <p>{orderDetails.order.dnNumber || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">
                        Created Date
                      </p>
                      <p>{formatDate(orderDetails.order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">
                        Delivery Date
                      </p>
                      <p>{formatDate(orderDetails.order.deliveryDate)}</p>
                    </div>
                  </div>

                  {/* Products Information */}
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2 text-black">
                      Products
                    </p>
                    <div className="border border-gray-200 rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Product ID
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Colour
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Quantity
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {orderDetails.order.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 whitespace-nowrap text-black">
                                {item.productId}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap capitalize text-black">
                                {item.productType}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-black">
                                {item.colour}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-black">
                                {item.quantity}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Measurements Tab */}
            <TabsContent value="measurements">
              <Card className="border border-gray-200 bg-white">
                <CardHeader className="bg-white">
                  <CardTitle className="text-black">
                    Product Measurements
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-black">
                  {orderDetails.order.items.map((item, index) => (
                    <div
                      key={index}
                      className="mb-6 pb-6 border-b border-gray-200 last:border-0"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold capitalize text-black">
                          {item.productType} ({item.colour})
                        </h3>
                        <p className="text-sm text-gray-600">
                          Product ID: {item.productId}
                        </p>
                      </div>

                      {item.productType === "shirt" &&
                        item.measurements?.shirtMeasurements && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm font-medium text-black">
                                Shirt Length
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shirtMeasurements
                                    .shirtLength
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-black">
                                Dart Point
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shirtMeasurements.dartPoint
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-black">
                                Upper Bust
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shirtMeasurements.upperBust
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-black">
                                Bust
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shirtMeasurements.bust
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-black">
                                Waist
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shirtMeasurements.waist
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-black">
                                Hips
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shirtMeasurements.hips
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-black">
                                Front Neck
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shirtMeasurements.frontNeck
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-black">
                                Back Neck
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shirtMeasurements.backNeck
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-black">
                                Tira
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shirtMeasurements.tira
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-black">
                                Sleeves Length
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shirtMeasurements
                                    .sleevesLength
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-black">
                                Mori Sleeveless
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shirtMeasurements
                                    .moriSleeveless
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-black">
                                Biceps
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shirtMeasurements.biceps
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-black">
                                Armhole
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shirtMeasurements.armhole
                                )}
                              </p>
                            </div>
                          </div>
                        )}

                      {item.productType === "sharara" &&
                        item.measurements?.shararaMeasurements && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm font-medium text-black">
                                Sharara Length
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shararaMeasurements
                                    .shararaLength
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-black">
                                Sharara Waist
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shararaMeasurements
                                    .shararaWaist
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-black">
                                Hips
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shararaMeasurements.hips
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-black">
                                Thigh
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shararaMeasurements.thigh
                                )}
                              </p>
                            </div>
                          </div>
                        )}

                      {(!item.measurements ||
                        (item.productType === "shirt" &&
                          !item.measurements.shirtMeasurements) ||
                        (item.productType === "sharara" &&
                          !item.measurements.shararaMeasurements)) && (
                        <p className="text-sm text-gray-600">
                          No measurement data available
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="py-6 text-center text-gray-600">
            No order details found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
