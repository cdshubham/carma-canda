"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";

export default function SetDetailsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [originalData, setOriginalData] = useState(null);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      gender: "",
      email: "",
      phone: "",
      birthday: {
        day: "",
        month: "",
        year: "",
      },
      address: {
        street: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
      },
      anniversary: {
        day: "",
        month: "",
        year: "",
      },
      social_media: [],
      sizeParameter1: "",
      sizeParameter2: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "social_media",
  });

  const watchSocialMedia = watch("social_media");

  const fetchUserData = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/${userId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();

      const formattedData = {
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        gender: userData.gender || "",
        email: userData.email || "",
        phone: userData.phone !== "Not provided" ? userData.phone : "",
        address: {
          street: userData.street !== "Not provided" ? userData.street : "",
          city: userData.city !== "Not provided" ? userData.city : "",
          state: userData.state !== "Not provided" ? userData.state : "",
          zip_code: userData.zipcode !== "Not provided" ? userData.zipcode : "",
          country: userData.country !== "Not provided" ? userData.country : "",
        },
        birthday: {
          day: "",
          month: "",
          year: "",
        },
        anniversary: {
          day: "",
          month: "",
          year: "",
        },
        social_media: userData.social_media || [],
        sizeParameter1: userData.sizeParameter1 || "",
        sizeParameter2: userData.sizeParameter2 || "",
      };

      // Parse and set dates if available
      if (userData.birthday) {
        try {
          const [year, month, day] = userData.birthday.split("-");
          formattedData.birthday = {
            day: day,
            month: month,
            year: year,
          };
        } catch (error) {
          console.error("Error parsing birthday:", error);
        }
      }

      if (userData.anniversary) {
        try {
          const [year, month, day] = userData.anniversary.split("-");
          formattedData.anniversary = {
            day: day,
            month: month,
            year: year,
          };
        } catch (error) {
          console.error("Error parsing anniversary:", error);
        }
      }

      setOriginalData(formattedData);

      // Reset form with the data
      reset(formattedData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  // Clean up social media entries when platform changes
  useEffect(() => {
    if (watchSocialMedia) {
      watchSocialMedia.forEach((social, index) => {
        if (social.platform) {
          const fieldType = getFieldTypeForPlatform(social.platform);
          // Clear the opposite field type when platform changes
          if (fieldType === "handle" && social.url) {
            setValue(`social_media.${index}.url`, "");
          } else if (fieldType === "url" && social.handle) {
            setValue(`social_media.${index}.handle`, "");
          }
        }
      });
    }
  }, [watchSocialMedia, setValue]);

  // Validate date helper function
  const validateDate = (date) => {
    const { day, month, year } = date;

    if (!day && !month && !year) return true; // Optional dates are allowed

    if (!day || !month || !year) {
      return "Complete date is required";
    }

    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
      return "Invalid day";
    }

    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return "Invalid month";
    }

    if (
      isNaN(yearNum) ||
      yearNum < 1900 ||
      yearNum > new Date().getFullYear()
    ) {
      return "Invalid year";
    }

    // Check for invalid dates like Feb 30
    const testDate = new Date(yearNum, monthNum - 1, dayNum);
    if (
      testDate.getDate() !== dayNum ||
      testDate.getMonth() !== monthNum - 1 ||
      testDate.getFullYear() !== yearNum
    ) {
      return "Invalid date";
    }

    return true;
  };

  const onSubmit = async (data) => {
    if (!userId) {
      return;
    }

    // Clear any previous errors
    clearErrors(["birthday", "anniversary"]);

    // Validate dates
    const birthdayValidation = validateDate(data.birthday);
    if (birthdayValidation !== true) {
      setError("birthday", {
        type: "manual",
        message: birthdayValidation,
      });
      return;
    }

    const anniversaryValidation = validateDate(data.anniversary);
    if (anniversaryValidation !== true) {
      setError("anniversary", {
        type: "manual",
        message: anniversaryValidation,
      });
      return;
    }

    // Format date fields for timezone safety
    const formatDate = (dateParts) => {
      if (!dateParts.day || !dateParts.month || !dateParts.year) return null;

      // Use YYYY-MM-DD format directly to avoid timezone issues
      return `${dateParts.year}-${dateParts.month.padStart(2, "0")}-${dateParts.day.padStart(2, "0")}`;
    };
    console.log("hrhrhhrr", data);

    const formattedData = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone || "Not provided",
      street: data.address.street || "Not provided",
      city: data.address.city || "Not provided",
      state: data.address.state || "Not provided",
      zipcode: data.address.zip_code || "Not provided",
      country: data.address.country || "Not provided",
      gender: data.gender,
      sizeParameter1: data.sizeParameter1,
      sizeParameter2: data.sizeParameter2,
      birthday: formatDate(data.birthday),
      anniversary: formatDate(data.anniversary),
      social_media: data.social_media.map((social) => {
        const fieldType = getFieldTypeForPlatform(social.platform);
        return {
          platform: social.platform,
          [fieldType === "handle" ? "handle" : "url"]:
            fieldType === "handle" ? social.handle : social.url,
        };
      }),
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update user data");
      }

      await fetchUserData(); // Refresh data after successful update
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      reset(originalData);
    }
  };

  const platformOptions = [
    { value: "instagram", label: "Instagram", fieldType: "handle" },
    { value: "facebook", label: "Facebook", fieldType: "url" },
    { value: "twitter", label: "Twitter", fieldType: "handle" },
    { value: "linkedin", label: "LinkedIn", fieldType: "url" },
    { value: "youtube", label: "YouTube", fieldType: "url" },
    { value: "tiktok", label: "TikTok", fieldType: "handle" },
    { value: "pinterest", label: "Pinterest", fieldType: "handle" },
    { value: "snapchat", label: "Snapchat", fieldType: "handle" },
  ];

  const getFieldTypeForPlatform = (platform) => {
    const option = platformOptions.find((opt) => opt.value === platform);
    return option ? option.fieldType : "url";
  };

  if (isLoading) {
    return (
      <div className="space-y-6 overflow-hidden">
        <h1 className="text-3xl font-bold tracking-tight">Customer Details</h1>
        <p className="text-muted-foreground">Loading your information...</p>
        <Card className=" text-white">
          <CardContent className="flex items-center justify-center py-10">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
              <span>Loading your details...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-4 bg-gray-100 min-h-screen p-4">
      <h1 className="text-3xl font-bold tracking-tight text-black">
        Customer Details
      </h1>
      <p className="text-gray-600">Update your personal information</p>

      <Card className="border border-gray-200 shadow-sm bg-white text-black">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="border-b border-gray-100 bg-gray-50">
            <CardTitle className="text-xl font-semibold">
              Personal Information
            </CardTitle>
            <CardDescription className="text-gray-500">
              Make changes to your personal details here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="font-medium">
                  First name
                </Label>
                <Input
                  id="first_name"
                  className="border-gray-300 focus:border-black focus:ring-black"
                  {...register("first_name", {
                    required: "First name is required",
                  })}
                  aria-invalid={errors.first_name ? "true" : "false"}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500">
                    {errors.first_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="font-medium">
                  Last name
                </Label>
                <Input
                  id="last_name"
                  className="border-gray-300 focus:border-black focus:ring-black"
                  {...register("last_name", {
                    required: "Last name is required",
                  })}
                  aria-invalid={errors.last_name ? "true" : "false"}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="font-medium">
                Gender
              </Label>
              <Controller
                name="gender"
                control={control}
                rules={{ required: "Gender is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      id="gender"
                      className="border-gray-300 focus:border-black focus:ring-black"
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="border-gray-300 focus:border-black focus:ring-black"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="font-medium">
                Phone number
              </Label>
              <Input
                id="phone"
                type="tel"
                className="border-gray-300 focus:border-black focus:ring-black"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value:
                      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/,
                    message: "Invalid phone number format",
                  },
                })}
                aria-invalid={errors.phone ? "true" : "false"}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="sizeParameter1" className="font-medium">
                  Size Parameter 1
                </Label>
                <Input
                  id="sizeParameter1"
                  className="border-gray-300 focus:border-black focus:ring-black"
                  {...register("sizeParameter1")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sizeParameter2" className="font-medium">
                  Size Parameter 2
                </Label>
                <Input
                  id="sizeParameter2"
                  className="border-gray-300 focus:border-black focus:ring-black"
                  {...register("sizeParameter2")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Birthday</Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label
                    htmlFor="birthday-day"
                    className="text-xs text-gray-500"
                  >
                    Day
                  </Label>
                  <Input
                    id="birthday-day"
                    placeholder="DD"
                    className="border-gray-300 focus:border-black focus:ring-black"
                    {...register("birthday.day")}
                    maxLength={2}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="birthday-month"
                    className="text-xs text-gray-500"
                  >
                    Month
                  </Label>
                  <Input
                    id="birthday-month"
                    placeholder="MM"
                    className="border-gray-300 focus:border-black focus:ring-black"
                    {...register("birthday.month")}
                    maxLength={2}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="birthday-year"
                    className="text-xs text-gray-500"
                  >
                    Year
                  </Label>
                  <Input
                    id="birthday-year"
                    placeholder="YYYY"
                    className="border-gray-300 focus:border-black focus:ring-black"
                    {...register("birthday.year")}
                    maxLength={4}
                  />
                </div>
              </div>
              {errors.birthday && (
                <p className="text-sm text-red-500">
                  {errors.birthday.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Anniversary</Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label
                    htmlFor="anniversary-day"
                    className="text-xs text-gray-500"
                  >
                    Day
                  </Label>
                  <Input
                    id="anniversary-day"
                    placeholder="DD"
                    className="border-gray-300 focus:border-black focus:ring-black"
                    {...register("anniversary.day")}
                    maxLength={2}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="anniversary-month"
                    className="text-xs text-gray-500"
                  >
                    Month
                  </Label>
                  <Input
                    id="anniversary-month"
                    placeholder="MM"
                    className="border-gray-300 focus:border-black focus:ring-black"
                    {...register("anniversary.month")}
                    maxLength={2}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="anniversary-year"
                    className="text-xs text-gray-500"
                  >
                    Year
                  </Label>
                  <Input
                    id="anniversary-year"
                    placeholder="YYYY"
                    className="border-gray-300 focus:border-black focus:ring-black"
                    {...register("anniversary.year")}
                    maxLength={4}
                  />
                </div>
              </div>
              {errors.anniversary && (
                <p className="text-sm text-red-500">
                  {errors.anniversary.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardHeader className="border-b border-t border-gray-100 bg-gray-50 mt-6">
            <CardTitle className="text-xl font-semibold">Address</CardTitle>
            <CardDescription className="text-gray-500">
              Your shipping and billing address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="street" className="font-medium">
                Street
              </Label>
              <Input
                id="street"
                className="border-gray-300 focus:border-black focus:ring-black"
                {...register("address.street", {
                  required: "Street address is required",
                })}
                aria-invalid={errors.address?.street ? "true" : "false"}
              />
              {errors.address?.street && (
                <p className="text-sm text-red-500">
                  {errors.address.street.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city" className="font-medium">
                  City
                </Label>
                <Input
                  id="city"
                  className="border-gray-300 focus:border-black focus:ring-black"
                  {...register("address.city", {
                    required: "City is required",
                  })}
                  aria-invalid={errors.address?.city ? "true" : "false"}
                />
                {errors.address?.city && (
                  <p className="text-sm text-red-500">
                    {errors.address.city.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="font-medium">
                  State
                </Label>
                <Input
                  id="state"
                  className="border-gray-300 focus:border-black focus:ring-black"
                  {...register("address.state", {
                    required: "State is required",
                  })}
                  aria-invalid={errors.address?.state ? "true" : "false"}
                />
                {errors.address?.state && (
                  <p className="text-sm text-red-500">
                    {errors.address.state.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="zip_code" className="font-medium">
                  ZIP Code
                </Label>
                <Input
                  id="zip_code"
                  className="border-gray-300 focus:border-black focus:ring-black"
                  {...register("address.zip_code", {
                    required: "ZIP code is required",
                  })}
                  aria-invalid={errors.address?.zip_code ? "true" : "false"}
                />
                {errors.address?.zip_code && (
                  <p className="text-sm text-red-500">
                    {errors.address.zip_code.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="font-medium">
                  Country
                </Label>
                <Input
                  id="country"
                  className="border-gray-300 focus:border-black focus:ring-black"
                  {...register("address.country", {
                    required: "Country is required",
                  })}
                  aria-invalid={errors.address?.country ? "true" : "false"}
                />
                {errors.address?.country && (
                  <p className="text-sm text-red-500">
                    {errors.address.country.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          <CardHeader className="border-b border-t border-gray-100 bg-gray-50 mt-6">
            <CardTitle className="text-xl font-semibold">
              Social Media
            </CardTitle>
            <CardDescription className="text-gray-500">
              Your social media profiles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border border-gray-200 rounded-md bg-gray-50"
              >
                <div className="flex justify-between items-center mb-4">
                  <Label className="font-medium">
                    Social Profile #{index + 1}
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="h-8 px-2 text-gray-500 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`platform-${index}`}
                      className="font-medium"
                    >
                      Platform
                    </Label>
                    <Controller
                      name={`social_media.${index}.platform`}
                      control={control}
                      rules={{ required: "Platform is required" }}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            // Clear both handle and url when platform changes
                            setValue(`social_media.${index}.handle`, "");
                            setValue(`social_media.${index}.url`, "");
                          }}
                          value={field.value}
                        >
                          <SelectTrigger
                            id={`platform-${index}`}
                            className="border-gray-300 focus:border-black focus:ring-black"
                          >
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            {platformOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.social_media?.[index]?.platform && (
                      <p className="text-sm text-red-500">
                        {errors.social_media[index].platform.message}
                      </p>
                    )}
                  </div>

                  {watchSocialMedia[index]?.platform && (
                    <div className="space-y-2">
                      <Label
                        htmlFor={
                          getFieldTypeForPlatform(
                            watchSocialMedia[index].platform
                          ) === "handle"
                            ? `handle-${index}`
                            : `url-${index}`
                        }
                        className="font-medium"
                      >
                        {getFieldTypeForPlatform(
                          watchSocialMedia[index].platform
                        ) === "handle"
                          ? "Username/Handle"
                          : "Profile URL"}
                      </Label>
                      <Input
                        id={
                          getFieldTypeForPlatform(
                            watchSocialMedia[index].platform
                          ) === "handle"
                            ? `handle-${index}`
                            : `url-${index}`
                        }
                        className="border-gray-300 focus:border-black focus:ring-black"
                        {...register(
                          getFieldTypeForPlatform(
                            watchSocialMedia[index].platform
                          ) === "handle"
                            ? `social_media.${index}.handle`
                            : `social_media.${index}.url`,
                          {
                            required: `${getFieldTypeForPlatform(watchSocialMedia[index].platform) === "handle" ? "Username" : "URL"} is required`,
                          }
                        )}
                      />
                      {(errors.social_media?.[index]?.handle ||
                        errors.social_media?.[index]?.url) && (
                        <p className="text-sm text-red-500">
                          {getFieldTypeForPlatform(
                            watchSocialMedia[index].platform
                          ) === "handle"
                            ? errors.social_media?.[index]?.handle?.message
                            : errors.social_media?.[index]?.url?.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => append({ platform: "", handle: "", url: "" })}
              className="w-full border-dashed border-gray-300 hover:border-black hover:bg-gray-50 flex items-center justify-center py-3"
            >
              <PlusCircle size={16} className="mr-2" />
              Add Social Media Profile
            </Button>
          </CardContent>

          <CardFooter className="flex justify-end space-x-4 py-6 border-t border-gray-100 bg-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting || !isDirty}
              className="border-gray-300 hover:bg-gray-100 hover:text-black"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="bg-black hover:bg-gray-800 text-white"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
