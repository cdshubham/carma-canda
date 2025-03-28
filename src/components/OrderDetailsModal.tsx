"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogClose,
} from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  // CardDescription,
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

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
}

interface Measurement {
  value: string | number;
  unit?: string;
}

interface OrderItem {
  productId: string;
  productType: string;
  colour: string;
  quantity: number;
  measurements?: {
    shirtMeasurements?: {
      shirtLength?: Measurement;
      dartPoint?: Measurement;
      upperBust?: Measurement;
      bust?: Measurement;
      waist?: Measurement;
      hips?: Measurement;
      frontNeck?: Measurement;
      backNeck?: Measurement;
      tira?: Measurement;
      sleevesLength?: Measurement;
      moriSleeveless?: Measurement;
      biceps?: Measurement;
      armhole?: Measurement;
    };
    shararaMeasurements?: {
      shararaLength?: Measurement;
      shararaWaist?: Measurement;
      hips?: Measurement;
      thigh?: Measurement;
    };
  };
}

interface OrderDetails {
  order: {
    orderId: string;
    trackingId?: string;
    dnNumber?: string;
    createdAt: string;
    deliveryDate: string;
    items: OrderItem[];
  };
  customer: {
    name: string;
    email: string;
    phone?: string;
    gender?: string;
    birthday?: string;
    anniversary?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zip_code?: string;
      country?: string;
    };
    spouse?: {
      first_name: string;
      last_name?: string;
      birthday?: string;
    };
    children?: Array<{
      first_name: string;
      last_name?: string;
      gender?: string;
      birthday?: string;
    }>;
  };
}

export default function OrderDetailsModal({
  isOpen,
  onClose,
  orderId,
}: OrderDetailsModalProps) {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
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
            setOrderDetails(response.data as OrderDetails);
          } else {
            throw new Error(
              response?.message || "Failed to fetch order details"
            );
          }
        } catch (error: any) {
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
  const formatDate = (dateString: string | undefined) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";
  };

  // Format measurement with unit
  const formatMeasurement = (measurement: Measurement | undefined) => {
    if (!measurement || !measurement.value) return "N/A";
    return `${measurement.value} ${measurement.unit || "in"}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[95vh] bg-white !rounded-cardradius">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-2xl font-semibold text-gray-900">
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
          <Tabs defaultValue="customer" className="h-[calc(95vh-12rem)]">
            <TabsList className="grid w-full grid-cols-3 mb-3 ">
              <TabsTrigger
                value="customer"
                className="data-[state=active]:bg-black data-[state=active]:text-white !rounded-buttonradius"
              >
                Customer Information
              </TabsTrigger>
              <TabsTrigger
                value="order"
                className="data-[state=active]:bg-black data-[state=active]:text-white !rounded-buttonradius"
              >
                Order Details
              </TabsTrigger>
              <TabsTrigger
                value="measurements"
                className="data-[state=active]:bg-black data-[state=active]:text-white !rounded-buttonradius"
              >
                Measurements
              </TabsTrigger>
            </TabsList>

            {/* Customer Information Tab */}
            <TabsContent
              value="customer"
              className="space-y-4 py-3 h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400"
            >
              <Card className="border border-gray-200 bg-white">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-900">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Name</p>
                      <p>{orderDetails.customer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p>{orderDetails.customer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <p>{orderDetails.customer.phone || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Gender
                      </p>
                      <p>{orderDetails.customer.gender || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Birthday
                      </p>
                      <p>{formatDate(orderDetails.customer.birthday)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Anniversary
                      </p>
                      <p>{formatDate(orderDetails.customer.anniversary)}</p>
                    </div>
                  </div>

                  {/* Address Information */}
                  {orderDetails.customer.address && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2 text-gray-900">
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
                        <p className="text-sm font-medium mb-2 text-gray-900">
                          Spouse
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Name
                            </p>
                            <p>
                              {`${orderDetails.customer.spouse.first_name} ${
                                orderDetails.customer.spouse.last_name || ""
                              }`.trim()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
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
                        <p className="text-sm font-medium mb-2 text-gray-900">
                          Children
                        </p>
                        {orderDetails.customer.children.map((child, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-3 gap-4 mb-2"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Name
                              </p>
                              <p>
                                {`${child.first_name} ${child.last_name || ""}`.trim()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Gender
                              </p>
                              <p>{child.gender || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
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
            <TabsContent
              value="order"
              className="space-y-4 py-3 h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400"
            >
              <Card className="border border-gray-200 bg-white">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">
                    Order Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-900">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Order ID
                      </p>
                      <p>{orderDetails.order.orderId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Tracking ID
                      </p>
                      <p>{orderDetails.order.trackingId || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        DN Number
                      </p>
                      <p>{orderDetails.order.dnNumber || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Created Date
                      </p>
                      <p>{formatDate(orderDetails.order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Delivery Date
                      </p>
                      <p>{formatDate(orderDetails.order.deliveryDate)}</p>
                    </div>
                  </div>

                  {/* Products Information */}
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2 text-gray-900">
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
                              <td className="px-4 py-2 whitespace-nowrap text-gray-900">
                                {item.productId}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap capitalize text-gray-900">
                                {item.productType}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-gray-900">
                                {item.colour}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-gray-900">
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
            <TabsContent
              value="measurements"
              className="space-y-4 py-3 h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400"
            >
              <Card className="border border-gray-200 bg-white">
                <CardHeader className="bg-white">
                  <CardTitle className="text-gray-900">
                    Product Measurements
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-900">
                  {orderDetails.order.items.map((item, index) => (
                    <div
                      key={index}
                      className="mb-6 pb-6 border-b border-gray-200 last:border-0"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold capitalize text-gray-900">
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
                              <p className="text-sm font-medium text-gray-900">
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
                              <p className="text-sm font-medium text-gray-900">
                                Dart Point
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shirtMeasurements.dartPoint
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Upper Bust
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shirtMeasurements.upperBust
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Bust
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shirtMeasurements.bust
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Waist
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shirtMeasurements.waist
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Hips
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shirtMeasurements.hips
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Front Neck
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shirtMeasurements.frontNeck
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Back Neck
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shirtMeasurements.backNeck
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Tira
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shirtMeasurements.tira
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
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
                              <p className="text-sm font-medium text-gray-900">
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
                              <p className="text-sm font-medium text-gray-900">
                                Biceps
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shirtMeasurements.biceps
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
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
                              <p className="text-sm font-medium text-gray-900">
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
                              <p className="text-sm font-medium text-gray-900">
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
                              <p className="text-sm font-medium text-gray-900">
                                Hips
                              </p>
                              <p>
                                {formatMeasurement(
                                  item.measurements.shararaMeasurements.hips
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
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
