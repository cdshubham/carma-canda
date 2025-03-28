import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Eye, Trash } from "lucide-react";
import debounce from "lodash/debounce";
import { UseFormReturn } from "react-hook-form";
import { colorIndices } from "@/app/data/colourindex";

interface OrderFormData {
  customerId: string;
  customerName: string;
  trackingId: string;
  dnNumber?: string;
  deliveryDate: string;
  items: Array<{
    productType: string;
    // Add other item properties that your form includes
  }>;
}
interface Customer {
  id: string;
  name: string;
  email: string;
  // Add other customer properties as needed
}
interface OrderModalProps {
  isAddModalOpen: boolean;
  handleCloseModal: () => void;
  form: UseFormReturn<OrderFormData, undefined>; // Adjust this type based on your form implementation
  handleAddOrder: (data: OrderFormData) => Promise<void>;
  customers?: Customer[]; // Uncomment and define the `Customer` type if needed
}
const OrderModal: React.FC<OrderModalProps> = ({
  isAddModalOpen,
  handleCloseModal,
  form,
  handleAddOrder,
  // customers = [],
}) => {
  const [savedItems, setSavedItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentTab, setCurrentTab] = useState("order");
  const [errors, setErrors] = useState({
    order: false,
    product: false,
    measurements: false,
  });
  const [editMode, setEditMode] = useState(false);
  const [editItemIndex, setEditItemIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [colorSearchTerm, setColorSearchTerm] = useState("");
  const [colorOptions, setColorOptions] = useState(colorIndices);
  const [selectedColor, setSelectedColor] = useState(colorIndices[0]);
  const [showOptions, setShowOptions] = useState(false);

  // Function to reset all modal fields
  const resetModalFields = () => {
    setSavedItems([]);
    setCurrentItem(null);
    setCurrentTab("order");
    setErrors({
      order: false,
      product: false,
      measurements: false,
    });
    setEditMode(false);
    setEditItemIndex(null);
    setSearchTerm("");
    setOptions([]);
    form.reset();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        options.length > 0 &&
        !event.target.closest(".search-dropdown-container")
      ) {
        setOptions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [options.length]);

  useEffect(() => {
    if (!isAddModalOpen) {
      resetModalFields();
    }
  }, [isAddModalOpen]);

  const debouncedSearch = debounce(async (query) => {
    if (query.length < 3) {
      setOptions([]);
      return;
    }

    setIsLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(
        `/api/users/searchbyname?q=${encodeURIComponent(query)}`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed with status: ${response.status}`
        );
      }

      const data = await response.json();
      setOptions(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.name !== "AbortError") {
        setOptions([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(searchTerm);

    // Cleanup
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOptionSelect = (user) => {
    form.setValue("customerId", user._id);
    const displayValue = `${user.first_name} ${user.last_name} (${user.email})`;
    setSearchTerm(displayValue);
    form.setValue("customerName", displayValue);
    setOptions([]);
  };

  useEffect(() => {
    form.setValue("items", savedItems);
  }, [savedItems, form]);

  const measurementUnits = [
    { id: "cm", name: "cm" },
    { id: "in", name: "in" },
  ];

  const getEmptyMeasurements = () => ({
    shirtMeasurements: {
      shirtLength: { value: "", unit: "in" },
      dartPoint: { value: "", unit: "in" },
      upperBust: { value: "", unit: "in" },
      bust: { value: "", unit: "in" },
      waist: { value: "", unit: "in" },
      hips: { value: "", unit: "in" },
      frontNeck: { value: "", unit: "in" },
      backNeck: { value: "", unit: "in" },
      tira: { value: "", unit: "in" },
      sleevesLength: { value: "", unit: "in" },
      moriSleeveless: { value: "", unit: "in" },
      biceps: { value: "", unit: "in" },
      armhole: { value: "", unit: "in" },
    },
    shararaMeasurements: {
      shararaLength: { value: "", unit: "in" },
      shararaWaist: { value: "", unit: "in" },
      hips: { value: "", unit: "in" },
      thigh: { value: "", unit: "in" },
    },
  });

  const createNewItem = () => {
    const newItem = {
      productId: Math.random().toString(36).substring(2, 9),
      productType: "",
      colour: selectedColor,
      quantity: 1,
      measurements: getEmptyMeasurements(),
    };
    setCurrentItem(newItem);
    setColorSearchTerm(selectedColor);
    setCurrentTab("product");
    setEditMode(false);
    setEditItemIndex(null);
  };

  const handleItemChange = (field, value) => {
    if (!currentItem) return;

    const updatedItem = { ...currentItem };

    if (field.includes(".")) {
      // Handle nested fields like measurements.shirtMeasurements.bust.value
      const fieldParts = field.split(".");
      let currentObj = updatedItem;

      for (let i = 0; i < fieldParts.length - 1; i++) {
        if (!currentObj[fieldParts[i]]) {
          currentObj[fieldParts[i]] = {};
        }
        currentObj = currentObj[fieldParts[i]];
      }

      currentObj[fieldParts[fieldParts.length - 1]] = value;
    } else {
      // Handle top-level fields
      updatedItem[field] = value;
    }

    setCurrentItem(updatedItem);

    // Reset relevant validation error when a field is changed
    if (field.includes("measurements")) {
      setErrors((prev) => ({ ...prev, measurements: false }));
    } else if (
      field === "productType" ||
      field === "colour" ||
      field === "quantity"
    ) {
      setErrors((prev) => ({ ...prev, product: false }));
    }
  };

  const saveCurrentProduct = () => {
    if (!validateMeasurementsTab()) return;

    const updatedItems = [...savedItems];

    if (editMode && editItemIndex !== null) {
      // Update existing item
      updatedItems[editItemIndex] = { ...currentItem };
    } else {
      // Add new item
      updatedItems.push({ ...currentItem });
    }

    setSavedItems(updatedItems);
    // Clear form data only after successfully saving
    setCurrentItem(null);
    setColorSearchTerm("");
    setSelectedColor(colorIndices[0]);
    setCurrentTab("saved");
    setEditMode(false);
    setEditItemIndex(null);
  };

  const deleteProduct = (index) => {
    const updatedItems = [...savedItems];
    updatedItems.splice(index, 1);
    setSavedItems(updatedItems);
  };

  const editProduct = (index) => {
    setCurrentItem({ ...savedItems[index] });
    setEditMode(true);
    setEditItemIndex(index);
    setCurrentTab("product");
  };

  const viewProduct = (index) => {
    setCurrentItem({ ...savedItems[index] });
    setEditMode(false);
    setEditItemIndex(null);
    setCurrentTab("measurements");
  };

  const validateOrderTab = () => {
    const isCustomerSelected = !!form.getValues("customerName");

    if (!isCustomerSelected) {
      form.setError("customerName", {
        type: "required",
        message: "Customer is required",
      });
      setErrors((prev) => ({ ...prev, order: true }));
      return false;
    }

    setErrors((prev) => ({ ...prev, order: false }));
    return true;
  };

  const validateProductTab = () => {
    if (!currentItem) return false;

    const isValid =
      currentItem.productType && currentItem.colour && currentItem.quantity > 0;

    setErrors((prev) => ({ ...prev, product: !isValid }));
    return isValid;
  };

  const validateMeasurementsTab = () => {
    if (!currentItem) return false;

    const productType = currentItem.productType;

    if (productType === "shirt") {
      const shirtMeasurements = currentItem.measurements.shirtMeasurements;
      // Check if all required measurements have values
      const isValid = Object.values(shirtMeasurements).every(
        (measurement) => measurement.value !== ""
      );
      setErrors((prev) => ({ ...prev, measurements: !isValid }));
      return isValid;
    } else if (productType === "sharara") {
      const shararaMeasurements = currentItem.measurements.shararaMeasurements;
      const isValid = Object.values(shararaMeasurements).every(
        (measurement) => measurement.value !== ""
      );
      setErrors((prev) => ({ ...prev, measurements: !isValid }));
      return isValid;
    }

    setErrors((prev) => ({ ...prev, product: true }));
    return false;
  };

  const handleTabChange = (newTab) => {
    // Validate current tab before allowing switch
    if (currentTab === "order" && newTab !== "order") {
      if (!validateOrderTab()) return;
    }
    if (
      currentTab === "product" &&
      (newTab === "measurements" || newTab === "saved")
    ) {
      if (!validateProductTab()) return;
    }
    if (currentTab === "measurements" && newTab === "saved") {
      if (!validateMeasurementsTab()) return;
    }

    // Only create new item if coming from order tab and no current item exists
    if (newTab === "product" && currentTab === "order" && !currentItem) {
      createNewItem();
      return;
    }

    // Preserve the current item state when switching tabs
    setCurrentTab(newTab);

    // Reset scroll position of the tab content
    const tabContent = document.querySelector(".tab-content-scroll");
    if (tabContent) {
      tabContent.scrollTop = 0;
    }
  };

  const handleClose = () => {
    // Clear all form data when modal is closed
    resetModalFields();
    handleCloseModal();
  };

  const onSubmit = (data) => {
    console.log("onSubmit start", data);

    if (!validateOrderTab()) {
      console.log("Order tab validation failed");
      return;
    }

    if (savedItems.length === 0) {
      console.log("No items in order");
      form.setError("customerName", {
        type: "manual",
        message: "Please add at least one product to the order",
      });
      setErrors((prev) => ({ ...prev, order: true }));
      return;
    }

    const orderData = {
      ...data,
      items: savedItems.map((item) => {
        let measurements = {};

        if (item.productType === "shirt") {
          measurements = {
            shirtMeasurements: Object.fromEntries(
              Object.entries(item.measurements.shirtMeasurements).map(
                ([key, { value, unit }]) => [
                  key,
                  {
                    value:
                      value === ""
                        ? null
                        : isNaN(Number(value))
                          ? null
                          : Number(value),
                    unit: unit || "in",
                  },
                ]
              )
            ),
          };
        } else if (item.productType === "sharara") {
          measurements = {
            shararaMeasurements: Object.fromEntries(
              Object.entries(item.measurements.shararaMeasurements).map(
                ([key, { value, unit }]) => [
                  key,
                  {
                    value:
                      value === ""
                        ? null
                        : isNaN(Number(value))
                          ? null
                          : Number(value),
                    unit: unit || "in",
                  },
                ]
              )
            ),
          };
        }

        return {
          productId: item.productId,
          productType: item.productType,
          colour: item.colour,
          quantity: item.quantity,
          measurements: measurements,
        };
      }),
    };

    // Log the details
    console.log("Saving Order:", orderData);

    // Call the handler and reset the form
    handleAddOrder(orderData);

    // Reset fields after submission
    resetModalFields();
  };

  const renderMeasurementFields = () => {
    if (!currentItem) {
      return null;
    }

    const productType = currentItem.productType;

    if (productType === "shirt") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-cardradius">
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-gray-900">
              Upper Body Measurements
            </h3>
            {[
              { id: "shirtLength", label: "Shirt Length" },
              { id: "dartPoint", label: "Dart Point" },
              { id: "upperBust", label: "Upper Bust" },
              { id: "bust", label: "Bust" },
              { id: "waist", label: "Waist" },
              { id: "hips", label: "Hips" },
              { id: "frontNeck", label: "Front Neck" },
            ].map((field) => (
              <div key={field.id} className="flex items-center gap-4">
                <label className="w-1/3 text-sm text-gray-900">
                  {field.label}:
                </label>
                <div className="w-2/3 flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    value={
                      currentItem.measurements.shirtMeasurements[field.id]
                        ?.value || ""
                    }
                    onChange={(e) =>
                      handleItemChange(
                        `measurements.shirtMeasurements.${field.id}.value`,
                        e.target.value
                      )
                    }
                    className="flex-1 h-10 bg-gray-50 hover:bg-gray-100 focus:bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] focus:shadow-[0_4px_8px_rgba(0,0,0,0.1)] border-0 focus:border-0 transition-colors"
                    disabled={!editMode && editItemIndex !== null}
                  />
                  <select
                    value={
                      currentItem.measurements.shirtMeasurements[field.id]
                        ?.unit || "in"
                    }
                    onChange={(e) =>
                      handleItemChange(
                        `measurements.shirtMeasurements.${field.id}.unit`,
                        e.target.value
                      )
                    }
                    className="w-20 border-0 rounded-md h-10 bg-gray-50 hover:bg-gray-100 focus:bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] focus:shadow-[0_4px_8px_rgba(0,0,0,0.1)] transition-colors"
                    disabled={!editMode && editItemIndex !== null}
                  >
                    {measurementUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-gray-900">
              Sleeves & Other
            </h3>
            {[
              { id: "backNeck", label: "Back Neck" },
              { id: "tira", label: "Tira" },
              { id: "sleevesLength", label: "Sleeves Length" },
              { id: "moriSleeveless", label: "Mori Sleeveless" },
              { id: "biceps", label: "Biceps" },
              { id: "armhole", label: "Armhole" },
            ].map((field) => (
              <div key={field.id} className="flex items-center gap-4">
                <label className="w-1/3 text-sm text-gray-900">
                  {field.label}:
                </label>
                <div className="w-2/3 flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    value={
                      currentItem.measurements.shirtMeasurements[field.id]
                        ?.value || ""
                    }
                    onChange={(e) =>
                      handleItemChange(
                        `measurements.shirtMeasurements.${field.id}.value`,
                        e.target.value
                      )
                    }
                    className="flex-1 h-10 bg-gray-50 hover:bg-gray-100 focus:bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] focus:shadow-[0_4px_8px_rgba(0,0,0,0.1)] border-0 focus:border-0 transition-colors"
                    disabled={!editMode && editItemIndex !== null}
                  />
                  <select
                    value={
                      currentItem.measurements.shirtMeasurements[field.id]
                        ?.unit || "in"
                    }
                    onChange={(e) =>
                      handleItemChange(
                        `measurements.shirtMeasurements.${field.id}.unit`,
                        e.target.value
                      )
                    }
                    className="w-20 border-0 rounded-md h-10 bg-gray-50 hover:bg-gray-100 focus:bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] focus:shadow-[0_4px_8px_rgba(0,0,0,0.1)] transition-colors"
                    disabled={!editMode && editItemIndex !== null}
                  >
                    {measurementUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (productType === "sharara") {
      return (
        <div className="space-y-6">
          <h3 className="text-sm font-medium text-gray-900">
            Sharara Measurements
          </h3>
          {[
            { id: "shararaLength", label: "Sharara Length" },
            { id: "shararaWaist", label: "Sharara Waist" },
            { id: "hips", label: "Hips" },
            { id: "thigh", label: "Thigh" },
          ].map((field) => (
            <div key={field.id} className="flex items-center gap-4">
              <label className="w-1/3 text-sm text-gray-900">
                {field.label}:
              </label>
              <div className="w-2/3 flex gap-2">
                <Input
                  type="number"
                  step="0.01"
                  value={
                    currentItem.measurements.shararaMeasurements[field.id]
                      ?.value || ""
                  }
                  onChange={(e) =>
                    handleItemChange(
                      `measurements.shararaMeasurements.${field.id}.value`,
                      e.target.value
                    )
                  }
                  className="flex-1 h-10 bg-gray-50 hover:bg-gray-100 focus:bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] focus:shadow-[0_4px_8px_rgba(0,0,0,0.1)] border-0 focus:border-0 transition-colors"
                  disabled={!editMode && editItemIndex !== null}
                />
                <select
                  value={
                    currentItem.measurements.shararaMeasurements[field.id]
                      ?.unit || "in"
                  }
                  onChange={(e) =>
                    handleItemChange(
                      `measurements.shararaMeasurements.${field.id}.unit`,
                      e.target.value
                    )
                  }
                  className="w-20 border-0 rounded-md h-10 bg-gray-50 hover:bg-gray-100 focus:bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] focus:shadow-[0_4px_8px_rgba(0,0,0,0.1)] transition-colors"
                  disabled={!editMode && editItemIndex !== null}
                >
                  {measurementUnits.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <p className="text-center py-4">Please select a product type first</p>
    );
  };

  // Add new function to handle color search
  const handleColorSearch = (searchValue) => {
    setColorSearchTerm(searchValue);
    setShowOptions(true); // Show options when searching
    if (!searchValue) {
      setColorOptions(colorIndices); // Show all colors when input is empty
      return;
    }
    const filteredColors = colorIndices.filter((color) =>
      color.toLowerCase().includes(searchValue.toLowerCase())
    );
    setColorOptions(filteredColors); // Show all matching colors without limit
  };

  // Replace the color swatches section with this new JSX
  const renderColorSelection = () => (
    <div className="space-y-4">
      <label className="text-sm font-medium text-gray-900">Color Code *</label>
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              value={colorSearchTerm}
              onChange={(e) => handleColorSearch(e.target.value)}
              onFocus={() => setShowOptions(true)}
              placeholder="Search or click to view colors..."
              className="w-full h-10 !rounded-buttonradius pr-10 hover:cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.1)] focus:shadow-[0_4px_8px_rgba(0,0,0,0.1)] border-0 focus:border-0 bg-gray-50 hover:bg-gray-100 focus:bg-white transition-colors"
            />
            <Button
              type="button"
              variant="ghost"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent hover:cursor-pointer"
              onClick={() => {
                setShowOptions(!showOptions);
                if (!showOptions) {
                  setColorOptions(colorIndices);
                }
              }}
            >
              <svg
                className={`h-4 w-4 transition-transform ${showOptions ? "rotate-180" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>
          </div>
        </div>
        {showOptions && (
          <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-[300px] overflow-auto shadow-lg [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:cursor-pointer">
            {colorOptions.map((color) => (
              <li
                key={color}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors ${selectedColor === color ? "bg-gray-100" : ""}`}
                onClick={() => {
                  setSelectedColor(color);
                  handleItemChange("colour", color);
                  setColorSearchTerm(color);
                  setShowOptions(false);
                }}
              >
                {color}
              </li>
            ))}
          </ul>
        )}
      </div>
      {selectedColor && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Selected Color:</span>
          <span className="text-sm font-medium">{selectedColor}</span>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isAddModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[95vh] bg-white !rounded-cardradius">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Create New Order
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs
              value={currentTab}
              onValueChange={handleTabChange}
              className="h-[calc(95vh-12rem)]"
            >
              <TabsList className="grid w-full grid-cols-4 mb-3">
                <TabsTrigger
                  value="order"
                  className={`data-[state=active]:bg-black data-[state=active]:text-white !rounded-buttonradius ${errors.order ? "border-red-500 border" : ""}`}
                >
                  Order Details
                </TabsTrigger>
                <TabsTrigger
                  value="product"
                  className={`data-[state=active]:bg-black data-[state=active]:text-white !rounded-buttonradius ${errors.product ? "border-red-500 border" : ""}`}
                >
                  Product Details
                </TabsTrigger>
                <TabsTrigger
                  value="measurements"
                  disabled={!currentItem?.productType}
                  className={`data-[state=active]:bg-black data-[state=active]:text-white !rounded-buttonradius ${errors.measurements ? "border-red-500 border" : ""}`}
                >
                  Measurements
                </TabsTrigger>
                <TabsTrigger
                  value="saved"
                  className="data-[state=active]:bg-black data-[state=active]:text-white !rounded-buttonradius"
                >
                  Saved Products
                </TabsTrigger>
              </TabsList>

              <div className="h-[calc(100%-3rem)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 pr-4 tab-content-scroll">
                {/* Order Details Tab */}
                <TabsContent value="order" className="space-y-4 py-3 h-full">
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-900">
                            Customer *
                          </FormLabel>
                          <FormControl>
                            <div className="search-dropdown-container relative rounded-buttonradius">
                              <Input
                                placeholder="Enter at least 3 characters..."
                                value={searchTerm}
                                onChange={(e) => {
                                  handleInputChange(e);
                                  field.onChange(e.target.value);
                                }}
                                autoComplete="off"
                                className="w-full h-10 !rounded-buttonradius shadow-[0_2px_4px_rgba(0,0,0,0.1)] focus:shadow-[0_4px_8px_rgba(0,0,0,0.1)] border-0 focus:border-0 bg-gray-50 hover:bg-gray-100 focus:bg-white transition-colors"
                              />

                              {isLoading && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                                </div>
                              )}

                              {options.length > 0 && (
                                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-60 overflow-auto shadow-lg [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 pr-4">
                                  {options.map((user) => (
                                    <li
                                      key={user._id}
                                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                                      onClick={() => handleOptionSelect(user)}
                                    >
                                      {user.first_name} {user.last_name} (
                                      {user.email})
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Product Details Tab */}
                <TabsContent value="product" className="space-y-4 py-3 h-full">
                  {currentItem && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-900">
                          Product Type *
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <div
                            className={`p-4 cursor-pointer flex items-center justify-center transition-all h-10 rounded-buttonradius ${
                              currentItem.productType === "shirt"
                                ? "bg-gray-900 text-white shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                                : "bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                            }`}
                            onClick={() =>
                              handleItemChange("productType", "shirt")
                            }
                          >
                            <span
                              className={`text-sm font-medium ${currentItem.productType === "shirt" ? "text-white" : "text-gray-900"}`}
                            >
                              Shirt
                            </span>
                          </div>
                          <div
                            className={`p-4 cursor-pointer flex items-center justify-center transition-all h-10 rounded-buttonradius ${
                              currentItem.productType === "sharara"
                                ? "bg-gray-900 text-white shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                                : "bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                            }`}
                            onClick={() =>
                              handleItemChange("productType", "sharara")
                            }
                          >
                            <span
                              className={`text-sm font-medium ${currentItem.productType === "sharara" ? "text-white" : "text-gray-900"}`}
                            >
                              Sharara
                            </span>
                          </div>
                        </div>
                      </div>

                      {renderColorSelection()}

                      <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-900">
                          Quantity *
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={currentItem.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              "quantity",
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="max-w-[200px] h-10 !rounded-buttonradius hover:cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.1)] focus:shadow-[0_4px_8px_rgba(0,0,0,0.1)] border-0 focus:border-0 bg-gray-50 hover:bg-gray-100 focus:bg-white transition-colors"
                        />
                      </div>

                      {errors.product && (
                        <p className="text-sm text-red-500">
                          Please select a product type and color
                        </p>
                      )}
                    </div>
                  )}
                </TabsContent>

                {/* Measurements Tab */}
                <TabsContent
                  value="measurements"
                  className="space-y-4 py-3 h-full"
                >
                  {renderMeasurementFields()}

                  {errors.measurements && (
                    <p className="text-sm text-red-500">
                      Please fill out all measurement fields
                    </p>
                  )}
                </TabsContent>

                {/* Saved Products Tab */}
                <TabsContent value="saved" className="space-y-4 py-3 h-full">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        Saved Products
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={createNewItem}
                        className="border-gray-900 text-gray-900 hover:bg-gray-100 h-8 shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] border-0"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add New Product
                      </Button>
                    </div>

                    {savedItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-[calc(100%-4rem)] text-gray-500">
                        <PlusCircle className="h-12 w-12 mb-4" />
                        <p className="text-center">
                          No products saved yet. Click "Add New Product" to
                          start.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {savedItems.map((item, index) => (
                          <Card
                            key={item.productId}
                            className="overflow-hidden hover:shadow-md transition-shadow"
                          >
                            <CardHeader className="p-3 pb-1 bg-gray-50">
                              <CardTitle className="text-sm flex justify-between items-center">
                                <span className="font-medium text-gray-900">
                                  {item.productType === "shirt"
                                    ? "Shirt"
                                    : "Sharara"}
                                </span>
                                <div className="flex gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 hover:bg-gray-200"
                                    onClick={() => viewProduct(index)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 hover:bg-gray-200"
                                    onClick={() => editProduct(index)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 hover:bg-gray-200"
                                    onClick={() => deleteProduct(index)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-gray-900 rounded-buttonradius">
                                  Color Index: {item.colour}
                                </span>
                                <span className="text-xs font-medium text-gray-900 rounded-buttonradius">
                                  Quantity: {item.quantity}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.productType === "shirt"
                                  ? `Bust: ${item.measurements.shirtMeasurements.bust.value} ${item.measurements.shirtMeasurements.bust.unit}`
                                  : `Waist: ${item.measurements.shararaMeasurements.shararaWaist.value} ${item.measurements.shararaMeasurements.shararaWaist.unit}`}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <DialogFooter className="border-t pt-3">
              <div className="flex justify-end w-full gap-[30px]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={isLoading}
                  className="hover:bg-gray-100 !rounded-buttonradius shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] border-0"
                >
                  Cancel
                </Button>
                {currentTab === "product" && currentItem && (
                  <Button
                    type="button"
                    onClick={() => {
                      if (validateProductTab()) {
                        setCurrentTab("measurements");
                      }
                    }}
                    className="bg-gray-900 hover:bg-gray-800 text-white !rounded-buttonradius bt shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] border-0"
                  >
                    Continue to Measurements
                  </Button>
                )}
                {currentTab === "measurements" &&
                  currentItem &&
                  (editMode || editItemIndex === null) && (
                    <Button
                      type="button"
                      onClick={saveCurrentProduct}
                      className="bg-gray-900 hover:bg-gray-800 text-white !rounded-buttonradius shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] border-0"
                    >
                      Save This Product
                    </Button>
                  )}
                {currentTab === "saved" && (
                  <Button
                    type="submit"
                    disabled={isLoading || savedItems.length === 0}
                    className="bg-gray-900 hover:bg-gray-800 text-white !rounded-buttonradius "
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      "Save Order"
                    )}
                  </Button>
                )}
                {currentTab === "order" && (
                  <Button
                    type="button"
                    onClick={() => {
                      if (validateOrderTab()) {
                        createNewItem();
                      }
                    }}
                    className="bg-gray-900 hover:bg-gray-800 text-white !rounded-buttonradius shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] border-0"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
