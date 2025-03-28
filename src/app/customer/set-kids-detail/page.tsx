"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function FamilyDetailsPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      children: [
        {
          firstName: "",
          lastName: "",
          gender: "",
          birthday: { day: "", month: "", year: "" },
        },
      ],
      spouse: {
        firstName: "",
        lastName: "",
        gender: "",
        birthday: { day: "", month: "", year: "" },
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "children",
  });

  useEffect(() => {
    if (!userId) {
      setApiError("No user ID provided. Please log in to access this page.");
      return;
    }

    const fetchFamilyDetails = async () => {
      setIsLoading(true);
      setApiError("");

      try {
        const response = await fetch(`/api/savekids?userId=${userId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched family details:", data);

        const formData = {
          spouse: data.spouse || {
            firstName: "",
            lastName: "",
            gender: "",
            birthday: { day: "", month: "", year: "" },
          },
          children:
            data.children && data.children.length > 0
              ? data.children
              : [
                  {
                    firstName: "",
                    lastName: "",
                    gender: "",
                    birthday: { day: "", month: "", year: "" },
                  },
                ],
        };

        reset(formData);
      } catch (error) {
        console.error("Error fetching family details:", error);
        setApiError(`Failed to fetch family details: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFamilyDetails();
  }, [userId, reset]);

  const onSubmit = async (data) => {
    if (!userId) {
      setApiError("No user ID provided");
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
      console.log("Submitting data:", JSON.stringify(data, null, 2));

      const response = await fetch("/api/savekids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          spouse: data.spouse,
          children: data.children,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `Error: ${response.status}`);
      }

      console.log("Response:", responseData);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setApiError(`Failed to update family details: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="p-4 bg-red-100 text-red-700 rounded-md border border-red-200 mb-4">
          No user ID provided. Please log in to access this page.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white !rounded-cardradius shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-black text-center">
        Family Details
      </h1>

      {apiError && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 !rounded-cardradius border border-red-200">
          <p className="font-medium">Error</p>
          <p>{apiError}</p>
        </div>
      )}

      {isLoading && !isSubmitting && (
        <div className="mb-6 p-4 bg-gray-100 text-black !rounded-cardradius border border-gray-200 flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 mr-3 text-black"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading family details...
        </div>
      )}

      {isSubmitted && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 !rounded-cardradius border border-green-200 flex items-center">
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
          Family details updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Spouse Details Section */}
        <div className="bg-gray-50 p-6 !rounded-cardradius shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-black"
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
                className="w-full px-3 py-2 border border-gray-300 !rounded-inputradius focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
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
                className="w-full px-3 py-2 border border-gray-300 !rounded-inputradius focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
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
                className="w-full px-3 py-2 border border-gray-300 !rounded-inputradius focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
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
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    type="text"
                    placeholder="DD"
                    maxLength="2"
                    {...register("spouse.birthday.day", {
                      required: true,
                      pattern: /^(0?[1-9]|[12][0-9]|3[01])$/,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 !rounded-inputradius focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-center"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="MM"
                    maxLength="2"
                    {...register("spouse.birthday.month", {
                      required: true,
                      pattern: /^(0?[1-9]|1[012])$/,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 !rounded-inputradius focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-center"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="YYYY"
                    maxLength="4"
                    {...register("spouse.birthday.year", {
                      required: true,
                      pattern: /^(19|20)\d{2}$/,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 !rounded-inputradius focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-center"
                  />
                </div>
              </div>
              {(errors.spouse?.birthday?.day ||
                errors.spouse?.birthday?.month ||
                errors.spouse?.birthday?.year) && (
                <p className="mt-1 text-sm text-red-600">
                  Please enter a valid date
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Children Details Section */}
        <div className="bg-gray-50 p-6 !rounded-cardradius shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-black flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-black"
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
                  birthday: { day: "", month: "", year: "" },
                })
              }
              className="px-4 py-2 bg-black text-white !rounded-buttonradius hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors duration-200 flex items-center"
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

          {fields.length === 0 ? (
            <div className="mb-6 p-4 bg-gray-100 text-gray-700 !rounded-cardradius">
              No children added yet. Click 'Add Child' to add a child.
            </div>
          ) : (
            fields.map((field, index) => (
              <div
                key={field.id}
                className="mb-6 p-4 border border-gray-200 !rounded-cardradius bg-white shadow-sm"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-black">
                    Child {index + 1}
                  </h3>
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
                      className="w-full px-3 py-2 border border-gray-300 !rounded-inputradius focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
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
                      className="w-full px-3 py-2 border border-gray-300 !rounded-inputradius focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
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
                      className="w-full px-3 py-2 border border-gray-300 !rounded-inputradius focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
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
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <input
                          type="text"
                          placeholder="DD"
                          maxLength="2"
                          {...register(`children.${index}.birthday.day`, {
                            required: true,
                            pattern: /^(0?[1-9]|[12][0-9]|3[01])$/,
                          })}
                          className="w-full px-3 py-2 border border-gray-300 !rounded-inputradius !focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-center"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="MM"
                          maxLength="2"
                          {...register(`children.${index}.birthday.month`, {
                            required: true,
                            pattern: /^(0?[1-9]|1[012])$/,
                          })}
                          className="w-full px-3 py-2 border border-gray-300 !rounded-inputradius !focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-center"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="YYYY"
                          maxLength="4"
                          {...register(`children.${index}.birthday.year`, {
                            required: true,
                            pattern: /^(19|20)\d{2}$/,
                          })}
                          className="w-full px-3 py-2 border border-gray-300   !focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-center !rounded-inputradius"
                        />
                      </div>
                    </div>
                    {(errors.children?.[index]?.birthday?.day ||
                      errors.children?.[index]?.birthday?.month ||
                      errors.children?.[index]?.birthday?.year) && (
                      <p className="mt-1 text-sm text-red-600">
                        Please enter a valid date
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className={`px-4 py-2 bg-black text-white !rounded-buttonradius hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors duration-200 font-medium flex items-center ${
              isLoading || isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
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
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
