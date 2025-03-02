"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import useFetch from "@/hooks/useFetch";
import { useSession } from "next-auth/react";

export default function SetKidsDetailPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      children: [{ firstName: "", lastName: "", birthday: "", gender: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "children",
  });

  const addNewChild = () => {
    append({ firstName: "", lastName: "", birthday: "", gender: "" });
  };
  const { loading, fetchData } = useFetch("/api/savekids", { method: "POST" });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    console.log(data);

    try {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const kidsData = data.children.map((child) => ({
        name: `${child.firstName} ${child.lastName}`.trim(),
        gender: child.gender,
        birthday: child.birthday,
      }));

      const requestData = {
        userId,
        kids: kidsData,
      };

      const response = await fetchData(requestData);

      if (!response) {
        throw new Error("Failed to save data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 h-screen overflow-y-auto">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
        Kids Details
      </h1>
      <p className="text-muted-foreground">
        Manage information about your children
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <Card key={field.id} className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Child {index + 1}</CardTitle>
                <CardDescription>
                  Enter information for your child
                </CardDescription>
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`firstName-${field.id}`}>First name</Label>
                  <Input
                    id={`firstName-${field.id}`}
                    className="w-full"
                    {...register(`children.${index}.firstName`, {
                      required: "First name is required",
                    })}
                  />
                  {errors.children?.[index]?.firstName && (
                    <p className="text-sm text-red-500">
                      {errors.children[index].firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`lastName-${field.id}`}>Last name</Label>
                  <Input
                    id={`lastName-${field.id}`}
                    className="w-full"
                    {...register(`children.${index}.lastName`, {
                      required: "Last name is required",
                    })}
                  />
                  {errors.children?.[index]?.lastName && (
                    <p className="text-sm text-red-500">
                      {errors.children[index].lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`birthday-${field.id}`}>Birthday</Label>
                  <Input
                    id={`birthday-${field.id}`}
                    type="date"
                    className="w-full"
                    max={today}
                    {...register(`children.${index}.birthday`, {
                      required: "Birthday is required",
                    })}
                  />
                  {errors.children?.[index]?.birthday && (
                    <p className="text-sm text-red-500">
                      {errors.children[index].birthday.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2"></div>
                <div className="space-y-2">
                  <Label htmlFor={`gender-${field.id}`}>Gender</Label>
                  <Controller
                    name={`children.${index}.gender`}
                    control={control}
                    rules={{ required: "Gender is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          id={`gender-${field.id}`}
                          className="w-full"
                        >
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-white shadow-md rounded-md">
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.children?.[index]?.gender && (
                    <p className="text-sm text-red-500">
                      {errors.children[index].gender.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
            {index !== fields.length - 1 && <Separator className="my-2" />}
          </Card>
        ))}

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button
            type="button"
            onClick={addNewChild}
            variant="outline"
            className="flex items-center gap-1 w-full sm:w-auto"
          >
            Add Another Child
          </Button>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto text-white bg-black"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
