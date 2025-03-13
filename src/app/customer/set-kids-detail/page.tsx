// "use client";

// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import useFetch from "@/hooks/useFetch";
// import { useSession } from "next-auth/react";

// export default function SetKidsDetailPage() {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { data: session } = useSession();
//   const userId = session?.user?.id;

//   const {
//     register,
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       children: [{ firstName: "", lastName: "", birthday: "", gender: "" }],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "children",
//   });

//   const addNewChild = () => {
//     append({ firstName: "", lastName: "", birthday: "", gender: "" });
//   };
//   const { loading, fetchData } = useFetch("/api/savekids", { method: "POST" });

//   const onSubmit = async (data) => {
//     setIsSubmitting(true);
//     console.log(data);

//     try {
//       if (!userId) {
//         throw new Error("User not authenticated");
//       }

//       const kidsData = data.children.map((child) => ({
//         name: `${child.firstName} ${child.lastName}`.trim(),
//         gender: child.gender,
//         birthday: child.birthday,
//       }));

//       const requestData = {
//         userId,
//         kids: kidsData,
//       };

//       const response = await fetchData(requestData);

//       if (!response) {
//         throw new Error("Failed to save data");
//       }
//     } catch (error) {
//       console.error("Error saving data:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div className="space-y-6 p-4 sm:p-6 lg:p-8 h-screen overflow-y-auto">
//       <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
//         Kids Details
//       </h1>
//       <p className="text-muted-foreground">
//         Manage information about your children
//       </p>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         {fields.map((field, index) => (
//           <Card key={field.id} className="w-full">
//             <CardHeader className="flex flex-row items-center justify-between">
//               <div>
//                 <CardTitle>Child {index + 1}</CardTitle>
//                 <CardDescription>
//                   Enter information for your child
//                 </CardDescription>
//               </div>
//               {fields.length > 1 && (
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="text-red-500 hover:text-red-700"
//                   onClick={() => remove(index)}
//                 >
//                   Remove
//                 </Button>
//               )}
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor={`firstName-${field.id}`}>First name</Label>
//                   <Input
//                     id={`firstName-${field.id}`}
//                     className="w-full"
//                     {...register(`children.${index}.firstName`, {
//                       required: "First name is required",
//                     })}
//                   />
//                   {errors.children?.[index]?.firstName && (
//                     <p className="text-sm text-red-500">
//                       {errors.children[index].firstName.message}
//                     </p>
//                   )}
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor={`lastName-${field.id}`}>Last name</Label>
//                   <Input
//                     id={`lastName-${field.id}`}
//                     className="w-full"
//                     {...register(`children.${index}.lastName`, {
//                       required: "Last name is required",
//                     })}
//                   />
//                   {errors.children?.[index]?.lastName && (
//                     <p className="text-sm text-red-500">
//                       {errors.children[index].lastName.message}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor={`birthday-${field.id}`}>Birthday</Label>
//                   <Input
//                     id={`birthday-${field.id}`}
//                     type="date"
//                     className="w-full"
//                     max={today}
//                     {...register(`children.${index}.birthday`, {
//                       required: "Birthday is required",
//                     })}
//                   />
//                   {errors.children?.[index]?.birthday && (
//                     <p className="text-sm text-red-500">
//                       {errors.children[index].birthday.message}
//                     </p>
//                   )}
//                 </div>
//                 <div className="space-y-2"></div>
//                 <div className="space-y-2">
//                   <Label htmlFor={`gender-${field.id}`}>Gender</Label>
//                   <Controller
//                     name={`children.${index}.gender`}
//                     control={control}
//                     rules={{ required: "Gender is required" }}
//                     render={({ field }) => (
//                       <Select
//                         onValueChange={field.onChange}
//                         value={field.value}
//                       >
//                         <SelectTrigger
//                           id={`gender-${field.id}`}
//                           className="w-full"
//                         >
//                           <SelectValue placeholder="Select gender" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-white shadow-md rounded-md">
//                           <SelectItem value="Male">Male</SelectItem>
//                           <SelectItem value="Female">Female</SelectItem>
//                           <SelectItem value="Other">Other</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                   {errors.children?.[index]?.gender && (
//                     <p className="text-sm text-red-500">
//                       {errors.children[index].gender.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </CardContent>
//             {index !== fields.length - 1 && <Separator className="my-2" />}
//           </Card>
//         ))}

//         <div className="flex flex-col sm:flex-row justify-between gap-4">
//           <Button
//             type="button"
//             onClick={addNewChild}
//             variant="outline"
//             className="flex items-center gap-1 w-full sm:w-auto"
//           >
//             Add Another Child
//           </Button>

//           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//             <Button
//               type="button"
//               variant="outline"
//               className="w-full sm:w-auto"
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               className="w-full sm:w-auto text-white bg-black"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "Saving..." : "Save Changes"}
//             </Button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }

"use client";

// pages/family-details.js
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import Head from "next/head";

export default function FamilyDetailsPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      children: [{ firstName: "", lastName: "", gender: "", birthday: "" }],
      spouse: {
        firstName: "",
        lastName: "",
        gender: "",
        birthday: "",
        anniversary: "",
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "children",
  });

  const onSubmit = (data) => {
    console.log(data);
    // Here you would typically send this data to your backend
    setIsSubmitted(true);

    // Reset form submission status after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <>
      <Head>
        <title>Family Details Form</title>
        <meta name="description" content="Form to collect family details" />
      </Head>

      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Family Details
        </h1>

        {isSubmitted && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md border border-green-200 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Form submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Spouse Details Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              Spouse Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  {...register("spouse.firstName", {
                    required: "First name is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter first name"
                />
                {errors.spouse?.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.spouse.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  {...register("spouse.lastName", {
                    required: "Last name is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter last name"
                />
                {errors.spouse?.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.spouse.lastName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  {...register("spouse.gender", {
                    required: "Gender is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.spouse?.gender && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.spouse.gender.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birthday
                </label>
                <input
                  type="date"
                  {...register("spouse.birthday", {
                    required: "Birthday is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.spouse?.birthday && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.spouse.birthday.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Anniversary
                </label>
                <input
                  type="date"
                  {...register("spouse.anniversary", {
                    required: "Anniversary is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.spouse?.anniversary && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.spouse.anniversary.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Children Details Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Children Details
              </h2>
              <button
                type="button"
                onClick={() =>
                  append({
                    firstName: "",
                    lastName: "",
                    gender: "",
                    birthday: "",
                  })
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Child
              </button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-700">
                    Child {index + 1}
                  </h3>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:text-red-800 flex items-center focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      {...register(`children.${index}.firstName`, {
                        required: "First name is required",
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter first name"
                    />
                    {errors.children?.[index]?.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.children[index].firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      {...register(`children.${index}.lastName`, {
                        required: "Last name is required",
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter last name"
                    />
                    {errors.children?.[index]?.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.children[index].lastName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      {...register(`children.${index}.gender`, {
                        required: "Gender is required",
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.children?.[index]?.gender && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.children[index].gender.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Birthday
                    </label>
                    <input
                      type="date"
                      {...register(`children.${index}.birthday`, {
                        required: "Birthday is required",
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.children?.[index]?.birthday && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.children[index].birthday.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 font-medium flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
