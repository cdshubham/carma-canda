import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFetch } from "@/hooks/useFetch";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Package,
  Phone,
  Mail,
  MapPin,
  Globe,
  User,
  // Users,
  Heart,
  Ruler,
  // Clock,
  // CreditCard,
  // TrendingUp,
} from "lucide-react";

interface CustomerData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birthday: string;
  anniversary: string;
  gender: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  social_media: {
    platform: string;
    url: string;
  }[];
  spouse?: {
    first_name: string;
    last_name?: string;
    gender?: string;
    birthday?: string;
  };
  children?: {
    first_name: string;
    last_name?: string;
    gender?: string;
    birthday?: string;
  }[];
}
const CustomerModal = ({
  isOpen,
  onClose,
  userId,
}: {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [orderStatistics, setOrderStatistics] = useState({
    totalSpent: 0,
    averageOrder: 0,
    mostPurchased: "",
    lastPurchase: null,
  });
  console.log("orderStatistics", orderStatistics);

  const [expandedMeasurements, setExpandedMeasurements] = useState({});

  const toggleMeasurementsExpand = (
    orderId: string,
    itemIndex: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    const key = `${orderId}-${itemIndex}`;
    setExpandedMeasurements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const formatMeasurementName = (name: string) => {
    return name.replace(/([A-Z])/g, " $1").trim();
  };

  const { fetchData: fetchCustomerData } = useFetch(`/api/users/${userId}`, {
    method: "GET",
  });

  const { fetchData: fetchOrderData } = useFetch(
    ` /api/users/${userId}/orders`,
    {
      method: "GET",
    }
  );

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);

      fetchCustomerData()
        .then((data) => {
          setCustomerData(data as CustomerData);
        })
        .catch((error) => {
          console.error("Error fetching customer details:", error);
        });

      fetchOrderData()
        .then((response: any) => {
          if (response.success) {
            const orderData = response.data || [];
            setOrders(orderData);
            calculateOrderStatistics(orderData);
          }
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen]);

  const calculateOrderStatistics = (orderData: any) => {
    if (!orderData || orderData.length === 0) {
      return;
    }

    let totalSpent = 0;
    const itemCounts = {};
    let latestOrderDate = new Date(0);

    orderData.forEach((order: any) => {
      if (order.items && order.items.length > 0) {
        order.items.forEach((item: any) => {
          const itemPrice = item.price || 0;
          const quantity = item.quantity || 1;
          totalSpent += itemPrice * quantity;

          // Count items for most purchased
          const itemName = item.name || "Unnamed Product";
          itemCounts[itemName] = (itemCounts[itemName] || 0) + quantity;
        });
      }

      // Track latest order
      const orderDate = new Date(order.createdAt);
      if (orderDate > latestOrderDate) {
        latestOrderDate = orderDate;
      }
    });

    // Find most purchased item
    let mostPurchased = "";
    let maxCount = 0;
    for (const [item, count] of Object.entries(itemCounts)) {
      if (count > maxCount) {
        mostPurchased = item;
        maxCount = count;
      }
    }

    setOrderStatistics({
      totalSpent: totalSpent,
      averageOrder: orderData.length > 0 ? totalSpent / orderData.length : 0,
      mostPurchased: mostPurchased,
      lastPurchase: latestOrderDate.getTime() > 0 ? latestOrderDate : null,
    });
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders((prev: any) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getTimeSince = (dateString: string | undefined) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl bg-white text-black max-h-[90vh] overflow-hidden flex flex-col !rounded-[20px]">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="text-2xl font-bold">
            {customerData
              ? `${customerData.first_name} ${customerData.last_name}`
              : "Customer Details"}
          </DialogTitle>
          {customerData && (
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className="bg-black text-white rounded-full border-0"
              >
                Customer
              </Badge>
              {orders.length > 0 && (
                <Badge
                  variant="outline"
                  className="bg-gray-100 text-black rounded-full border-0"
                >
                  {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                </Badge>
              )}
            </div>
          )}
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full overflow-hidden flex flex-col flex-1"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 flex-shrink-0 gap-4">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-black data-[state=active]:text-white !rounded-buttonradius text-black bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Profile</span>
                <span className="sm:hidden">Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="data-[state=active]:bg-black data-[state=active]:text-white !rounded-buttonradius text-black bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <Package className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Orders</span>
                <span className="sm:hidden">Orders</span> ({orders.length})
              </TabsTrigger>
            </TabsList>

            <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-300 pr-4">
              <TabsContent value="details" className="space-y-6 mt-0">
                {customerData && (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-gray-50/50 p-6 rounded-[20px] shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h3 className="font-bold mb-4 flex items-center">
                          <User className="h-5 w-5 mr-2" />
                          Personal Information
                        </h3>
                        <div className="grid gap-4">
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <span className="break-all">
                              {customerData.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <span>{customerData.phone}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <span>
                              Birthday:{" "}
                              {customerData.birthday
                                ? formatDate(customerData.birthday)
                                : "Not provided"}
                            </span>
                          </div>
                          {customerData.anniversary && (
                            <div className="flex items-center gap-3">
                              <Heart className="h-4 w-4 text-gray-500 flex-shrink-0" />
                              <span>
                                Anniversary:{" "}
                                {formatDate(customerData.anniversary)}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-200">
                            <span>
                              Gender: {customerData.gender || "Not provided"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Spouse Information */}
                      {customerData.spouse &&
                        customerData.spouse.first_name && (
                          <div className="bg-gray-50/50 p-6 rounded-[20px] shadow-sm hover:shadow-md transition-shadow duration-200">
                            <h3 className="font-bold mb-4 flex items-center">
                              <Heart className="h-5 w-5 mr-2" />
                              Spouse Information
                            </h3>
                            <div className="grid gap-4">
                              <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                <span>
                                  {`${customerData.spouse.first_name} ${customerData.spouse.last_name || ""}`}
                                </span>
                              </div>
                              {customerData.spouse.gender && (
                                <div className="flex items-center gap-3">
                                  <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                  <span>
                                    Gender: {customerData.spouse.gender}
                                  </span>
                                </div>
                              )}
                              {customerData.spouse.birthday && (
                                <div className="flex items-center gap-3">
                                  <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                  <span>
                                    Birthday:{" "}
                                    {formatDate(customerData.spouse.birthday)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                      {/* Children Information */}
                      {customerData.children &&
                        customerData.children.length > 0 && (
                          <div className="bg-gray-50/50 p-6 rounded-[20px] shadow-sm hover:shadow-md transition-shadow duration-200">
                            <h3 className="font-bold mb-4 flex items-center">
                              <User className="h-5 w-5 mr-2" />
                              Children Information (
                              {customerData.children.length})
                            </h3>
                            <div className="grid gap-4">
                              {customerData.children.map((child, index) => (
                                <div
                                  key={index}
                                  className="bg-white p-4 rounded-[15px] shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                  <div className="grid gap-3">
                                    <div className="flex items-center gap-3">
                                      <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                      <span>
                                        {`${child.first_name} ${child.last_name || ""}`}
                                      </span>
                                    </div>
                                    {child.gender && (
                                      <div className="flex items-center gap-3">
                                        <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                        <span>Gender: {child.gender}</span>
                                      </div>
                                    )}
                                    {child.birthday && (
                                      <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                        <span>
                                          Birthday: {formatDate(child.birthday)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50/50 p-6 rounded-[20px] shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h3 className="font-bold mb-4 flex items-center">
                          <MapPin className="h-5 w-5 mr-2" />
                          Address
                        </h3>
                        <div className="grid gap-4">
                          <div className="flex items-start gap-3">
                            <div>
                              <p className="font-medium">
                                {customerData.street}
                              </p>
                              <p>
                                {customerData.city}, {customerData.state}{" "}
                                {customerData.zipcode}
                              </p>
                              <p>{customerData.country}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {customerData.social_media &&
                        customerData.social_media.length > 0 && (
                          <div className="bg-gray-50/50 p-6 rounded-[20px] shadow-sm hover:shadow-md transition-shadow duration-200">
                            <h3 className="font-bold mb-4 flex items-center">
                              <Globe className="h-5 w-5 mr-2" />
                              Social Media
                            </h3>
                            <div className="grid gap-4">
                              {customerData.social_media.map((account, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm overflow-auto"
                                >
                                  <span className="font-medium flex-shrink-0">
                                    {account.platform}:
                                  </span>
                                  <span className="truncate">
                                    {account.url}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent
                value="orders"
                className="space-y-6 !h-[600px] !max-h-[600px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-300 pr-4"
              >
                {orders.length === 0 ? (
                  <div className="text-center p-8 bg-gray-50/50 rounded-[20px] shadow-sm">
                    <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      No Orders Found
                    </h3>
                    <p className="text-gray-500">
                      {/* This customer hasn't placed any orders yet. */}
                      This customer hasn&#39;t placed any orders yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 flex flex-col overflow-hidden">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div
                          className="flex justify-between items-center p-4 bg-gray-50/50 cursor-pointer hover:bg-gray-100/80 transition-colors h-full"
                          onClick={() => toggleOrderExpand(order._id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-black text-white p-2.5 rounded-full flex-shrink-0">
                              <Package className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold truncate">
                                Order #{order._id.substring(0, 8)}
                              </p>
                              <p className="text-sm text-gray-600 truncate">
                                {formatDate(order.createdAt)}
                                {order.createdAt && (
                                  <span className="text-gray-400 ml-2 hidden sm:inline">
                                    ({getTimeSince(order.createdAt)})
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center flex-shrink-0 ml-2">
                            <Badge
                              variant="outline"
                              className="mr-3 hidden sm:inline-flex rounded-full border-0 bg-gray-100/80"
                            >
                              {order.items?.length || 0} items
                            </Badge>
                            {expandedOrders[order._id] ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </div>
                        </div>

                        {expandedOrders[order._id] && (
                          <div className="p-6 border-t border-gray-100">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
                              <div className="bg-gray-50/50 p-4 rounded-xl">
                                <p className="text-sm text-gray-600 mb-1">
                                  Order ID
                                </p>
                                <p className="font-medium break-all">
                                  {order._id}
                                </p>
                              </div>
                              <div className="bg-gray-50/50 p-4 rounded-xl">
                                <p className="text-sm text-gray-600 mb-1">
                                  Order Date
                                </p>
                                <p className="font-medium">
                                  {formatDate(order.createdAt)}
                                </p>
                              </div>
                              <div className="bg-gray-50/50 p-4 rounded-xl">
                                <p className="text-sm text-gray-600 mb-1">
                                  User ID
                                </p>
                                <p className="font-medium break-all">
                                  {order.userId}
                                </p>
                              </div>
                            </div>

                            <div className="mt-6">
                              <h4 className="font-bold mb-4 flex items-center">
                                <Package className="h-4 w-4 mr-2" />
                                Order Items
                              </h4>
                              {order.items && order.items.length > 0 ? (
                                <div className="space-y-4">
                                  {order.items.map((item, idx) => {
                                    const measurementKey = `${order._id}-${idx}`;
                                    const isMeasurementsExpanded =
                                      expandedMeasurements[measurementKey];
                                    const hasMeasurements =
                                      item.measurements &&
                                      (item.productType === "shirt"
                                        ? item.measurements.shirtMeasurements
                                        : item.productType === "sharara"
                                          ? item.measurements
                                              .shararaMeasurements
                                          : null);

                                    return (
                                      <div
                                        key={idx}
                                        className="rounded-[20px] overflow-hidden shadow-sm"
                                      >
                                        <div className="bg-gray-50/50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 rounded-xl">
                                          <div className="flex flex-col w-full sm:flex-row sm:items-center gap-2 sm:gap-6">
                                            <div>
                                              <span className="text-sm font-medium text-gray-500">
                                                Product:
                                              </span>{" "}
                                              <span className="font-medium break-all">
                                                {item.productId || "N/A"}
                                              </span>
                                            </div>
                                            <div>
                                              <span className="text-sm font-medium text-gray-500">
                                                Type:
                                              </span>{" "}
                                              <span>
                                                {item.productType || "N/A"}
                                              </span>
                                            </div>
                                            <div className="flex items-center">
                                              <span className="text-sm font-medium text-gray-500 mr-2">
                                                Color:
                                              </span>
                                              <div
                                                className="w-4 h-4 rounded-full mr-1"
                                                style={{
                                                  backgroundColor:
                                                    item.colour || "#ccc",
                                                }}
                                              ></div>
                                              <span>
                                                {item.colour || "N/A"}
                                              </span>
                                            </div>
                                            <div>
                                              <span className="text-sm font-medium text-gray-500">
                                                Qty:
                                              </span>{" "}
                                              <span>{item.quantity || 0}</span>
                                            </div>
                                          </div>

                                          {hasMeasurements && (
                                            <button
                                              className="text-blue-600 hover:text-blue-800 underline flex items-center mt-2 sm:mt-0 hover:bg-blue-50/50 px-3 py-1.5 rounded-full transition-colors"
                                              onClick={(e) =>
                                                toggleMeasurementsExpand(
                                                  order._id,
                                                  idx,
                                                  e
                                                )
                                              }
                                            >
                                              <Ruler className="h-4 w-4 mr-1" />
                                              {isMeasurementsExpanded
                                                ? "Hide Measurements"
                                                : "View Measurements"}
                                              {isMeasurementsExpanded ? (
                                                <ChevronUp className="h-4 w-4 ml-1" />
                                              ) : (
                                                <ChevronDown className="h-4 w-4 ml-1" />
                                              )}
                                            </button>
                                          )}
                                        </div>

                                        {isMeasurementsExpanded &&
                                          hasMeasurements && (
                                            <div className="p-4 border-t border-gray-100 bg-white rounded-xl">
                                              <h5 className="font-medium mb-3 text-gray-700 flex items-center">
                                                <Ruler className="h-4 w-4 mr-2" />
                                                {item.productType
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                  item.productType.slice(
                                                    1
                                                  )}{" "}
                                                Measurements
                                              </h5>

                                              <div className="overflow-x-auto custom-scrollbar">
                                                <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow-sm">
                                                  <thead className="bg-gray-50">
                                                    <tr>
                                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Measurement
                                                      </th>
                                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Value
                                                      </th>
                                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Unit
                                                      </th>
                                                    </tr>
                                                  </thead>
                                                  <tbody className="bg-white divide-y divide-gray-200">
                                                    {item.productType ===
                                                      "shirt" &&
                                                      item.measurements
                                                        .shirtMeasurements &&
                                                      Object.entries(
                                                        item.measurements
                                                          .shirtMeasurements
                                                      ).map(([key, data]) => (
                                                        <tr
                                                          key={key}
                                                          className="hover:bg-gray-50"
                                                        >
                                                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium capitalize">
                                                            {formatMeasurementName(
                                                              key
                                                            )}
                                                          </td>
                                                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                            {data.value}
                                                          </td>
                                                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                            {data.unit}
                                                          </td>
                                                        </tr>
                                                      ))}

                                                    {item.productType ===
                                                      "sharara" &&
                                                      item.measurements
                                                        .shararaMeasurements &&
                                                      Object.entries(
                                                        item.measurements
                                                          .shararaMeasurements
                                                      ).map(([key, data]) => (
                                                        <tr
                                                          key={key}
                                                          className="hover:bg-gray-50"
                                                        >
                                                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium capitalize">
                                                            {formatMeasurementName(
                                                              key
                                                            )}
                                                          </td>
                                                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                            {data.value}
                                                          </td>
                                                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                            {data.unit}
                                                          </td>
                                                        </tr>
                                                      ))}
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded">
                                  No items found for this order
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomerModal;
