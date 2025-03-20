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
import { Badge } from "@/components/ui/badge";
import { PlusCircle, X, Pencil, Eye, Trash } from "lucide-react";

const OrderModal = ({
  isAddModalOpen,
  handleCloseModal,
  form,
  handleAddOrder,
  isLoading,
  customers = [],
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

  // Predefined colors for swatches
  const colorSwatches = [
    "#FF5733", // Red-Orange
    "#33FF57", // Green
    "#3357FF", // Blue
    "#F3FF33", // Yellow
    "#FF33F3", // Pink
  ];

  // Reset items when modal is opened/closed
  useEffect(() => {
    if (!isAddModalOpen) {
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
      form.reset();
    }
  }, [isAddModalOpen, form]);

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
      colour: colorSwatches[0],
      quantity: 1,
      measurements: getEmptyMeasurements(),
    };
    setCurrentItem(newItem);
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
    setCurrentItem(null);
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
      // Check if all required measurements have values
      const isValid = Object.values(shararaMeasurements).every(
        (measurement) => measurement.value !== ""
      );
      setErrors((prev) => ({ ...prev, measurements: !isValid }));
      return isValid;
    }

    // If product type is not selected or invalid
    setErrors((prev) => ({ ...prev, product: true }));
    return false;
  };

  const handleTabChange = (newTab) => {
    // Validate current tab before allowing navigation
    if (currentTab === "order" && newTab !== "order") {
      if (!validateOrderTab()) return;
    }

    if (currentTab === "product" && newTab === "measurements") {
      if (!validateProductTab()) return;
    }

    if (currentTab === "measurements" && newTab === "saved") {
      if (!validateMeasurementsTab()) return;
    }

    // Special cases for navigation
    if (newTab === "product" && currentTab !== "product" && !currentItem) {
      createNewItem();
      return;
    }

    setCurrentTab(newTab);
  };

  const onSubmit = (data) => {
    // Final validation before submission
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

    // Prepare the complete order data
    const orderData = {
      ...data,
      items: savedItems.map((item) => ({
        ...item,
        // Restructure measurements with units and ensure values are numbers
        measurements: {
          shirtMeasurements: Object.fromEntries(
            Object.entries(item.measurements.shirtMeasurements).map(
              ([key, { value, unit }]) => [
                key,
                {
                  value: value === "" ? null : Number(value),
                  unit: unit || "in", // Provide default unit if missing
                },
              ]
            )
          ),
          shararaMeasurements: Object.fromEntries(
            Object.entries(item.measurements.shararaMeasurements).map(
              ([key, { value, unit }]) => [
                key,
                {
                  value: value === "" ? null : Number(value),
                  unit: unit || "in", // Provide default unit if missing
                },
              ]
            )
          ),
        },
      })),
    };

    // Log the details
    console.log("Saving Order:", orderData);

    handleAddOrder(orderData);
  };

  const renderMeasurementFields = () => {
    if (!currentItem) {
      return null;
    }

    const productType = currentItem.productType;

    if (productType === "shirt") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="font-medium">Upper Body Measurements</h3>
            {[
              { id: "shirtLength", label: "Shirt Length" },
              { id: "dartPoint", label: "Dart Point" },
              { id: "upperBust", label: "Upper Bust" },
              { id: "bust", label: "Bust" },
              { id: "waist", label: "Waist" },
              { id: "hips", label: "Hips" },
              { id: "frontNeck", label: "Front Neck" },
            ].map((field) => (
              <div key={field.id} className="flex items-center gap-2">
                <label className="w-1/3 text-sm">{field.label}:</label>
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
                    className="flex-1"
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
                    className="w-20 border border-gray-300 rounded-md"
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
          <div className="space-y-3">
            <h3 className="font-medium">Sleeves & Other</h3>
            {[
              { id: "backNeck", label: "Back Neck" },
              { id: "tira", label: "Tira" },
              { id: "sleevesLength", label: "Sleeves Length" },
              { id: "moriSleeveless", label: "Mori Sleeveless" },
              { id: "biceps", label: "Biceps" },
              { id: "armhole", label: "Armhole" },
            ].map((field) => (
              <div key={field.id} className="flex items-center gap-2">
                <label className="w-1/3 text-sm">{field.label}:</label>
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
                    className="flex-1"
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
                    className="w-20 border border-gray-300 rounded-md"
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

          {(editMode || editItemIndex === null) && (
            <div className="col-span-1 md:col-span-2 mt-4 flex justify-center">
              <Button type="button" onClick={saveCurrentProduct}>
                Save This Product
              </Button>
            </div>
          )}
        </div>
      );
    } else if (productType === "sharara") {
      return (
        <div className="space-y-3">
          <h3 className="font-medium">Sharara Measurements</h3>
          {[
            { id: "shararaLength", label: "Sharara Length" },
            { id: "shararaWaist", label: "Sharara Waist" },
            { id: "hips", label: "Hips" },
            { id: "thigh", label: "Thigh" },
          ].map((field) => (
            <div key={field.id} className="flex items-center gap-2">
              <label className="w-1/3 text-sm">{field.label}:</label>
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
                  className="flex-1"
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
                  className="w-20 border border-gray-300 rounded-md"
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

          {(editMode || editItemIndex === null) && (
            <div className="mt-4 flex justify-center">
              <Button type="button" onClick={saveCurrentProduct}>
                Save This Product
              </Button>
            </div>
          )}
        </div>
      );
    }

    return (
      <p className="text-center py-4">Please select a product type first</p>
    );
  };
  return (
    <Dialog open={isAddModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh] bg-white">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={currentTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger
                  value="order"
                  className={errors.order ? "border-red-500 border" : ""}
                >
                  Order Details
                </TabsTrigger>
                <TabsTrigger
                  value="product"
                  className={errors.product ? "border-red-500 border" : ""}
                >
                  Product Details
                </TabsTrigger>
                <TabsTrigger
                  value="measurements"
                  disabled={!currentItem?.productType}
                  className={errors.measurements ? "border-red-500 border" : ""}
                >
                  Measurements
                </TabsTrigger>
                <TabsTrigger value="saved">Saved Products</TabsTrigger>
              </TabsList>

              {/* Order Details Tab */}
              <TabsContent value="order" className="space-y-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter customer name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    type="button"
                    onClick={() => {
                      if (validateOrderTab()) {
                        createNewItem();
                      }
                    }}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </TabsContent>

              {/* Product Details Tab */}
              <TabsContent value="product" className="space-y-4 py-4">
                {currentItem && (
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <label className="text-sm font-medium">
                        Product Type *
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div
                          className={`p-4 border rounded-md cursor-pointer flex items-center justify-center ${
                            currentItem.productType === "shirt"
                              ? "bg-blue-100 border-blue-500"
                              : "bg-gray-50"
                          }`}
                          onClick={() =>
                            handleItemChange("productType", "shirt")
                          }
                        >
                          Shirt
                        </div>
                        <div
                          className={`p-4 border rounded-md cursor-pointer flex items-center justify-center ${
                            currentItem.productType === "sharara"
                              ? "bg-blue-100 border-blue-500"
                              : "bg-gray-50"
                          }`}
                          onClick={() =>
                            handleItemChange("productType", "sharara")
                          }
                        >
                          Sharara
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Color *</label>
                      <div className="flex gap-2 flex-wrap">
                        {colorSwatches.map((color) => (
                          <div
                            key={color}
                            className={`w-10 h-10 rounded-full cursor-pointer border-2 ${
                              currentItem.colour === color
                                ? "border-black"
                                : "border-transparent"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => handleItemChange("colour", color)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Quantity *</label>
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
                      />
                    </div>

                    {errors.product && (
                      <p className="text-sm text-red-500">
                        Please select a product type and color
                      </p>
                    )}

                    <div className="flex justify-end pt-2">
                      {currentItem.productType && (
                        <Button
                          type="button"
                          onClick={() => {
                            if (validateProductTab()) {
                              setCurrentTab("measurements");
                            }
                          }}
                        >
                          Continue to Measurements
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Measurements Tab */}
              <TabsContent value="measurements" className="space-y-4 py-4">
                {renderMeasurementFields()}

                {errors.measurements && (
                  <p className="text-sm text-red-500">
                    Please fill out all measurement fields
                  </p>
                )}
              </TabsContent>

              {/* Saved Products Tab */}
              <TabsContent value="saved" className="space-y-4 py-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Saved Products</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={createNewItem}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add New Product
                    </Button>
                  </div>

                  {savedItems.length === 0 ? (
                    <p className="text-center py-4 text-muted-foreground">
                      No products saved yet. Click "Add New Product" to start.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedItems.map((item, index) => (
                        <Card key={item.productId} className="overflow-hidden">
                          <CardHeader className="p-3 pb-1 bg-gray-50">
                            <CardTitle className="text-sm flex justify-between items-center">
                              <span>
                                {item.productType === "shirt"
                                  ? "Shirt"
                                  : "Sharara"}
                              </span>
                              <div className="flex gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => viewProduct(index)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => editProduct(index)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => deleteProduct(index)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: item.colour }}
                              />
                              <span className="text-xs">
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

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading || savedItems.length === 0}
                      className="text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                    >
                      {isLoading ? "Saving..." : "Save Order"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
