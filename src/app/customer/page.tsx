"use client";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Mail, Phone, MapPin, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import useFetch from "../../hooks/useFetch";

export default function HomePage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const {
    data: userDetails,
    loading,
    error,
    fetchData,
  } = useFetch(`/api/users/${userId}`, {
    method: "GET",
  });

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 p-8">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Unable to load profile
          </h3>
          <p className="text-red-500">{error}</p>
          <button
            className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-md transition-colors"
            onClick={() => fetchData()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="relative h-full w-full">
        <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  const {
    name,
    email,
    phone,
    address,
    memberSince,
    kids = [],
  } = userDetails || {};
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const calculateAge = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      const birthDate = new Date(dateString);
      const currentDate = new Date();

      let age = currentDate.getFullYear() - birthDate.getFullYear();

      const birthMonth = birthDate.getMonth();
      const currentMonth = currentDate.getMonth();
      const birthDay = birthDate.getDate();
      const currentDay = currentDate.getDate();

      if (
        currentMonth < birthMonth ||
        (currentMonth === birthMonth && currentDay < birthDay)
      ) {
        age--;
      }

      return `${age} ${age === 1 ? "year" : "years"}`;
    } catch (e) {
      console.error("Error calculating age:", e);
      return "Unknown";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24 border-2 border-white shadow-md">
              <AvatarImage
                src="/placeholder-avatar.jpg"
                alt={`${name}'s avatar`}
              />
              <AvatarFallback className="text-2xl bg-black text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left space-y-1 flex-1">
              <CardTitle className="text-2xl font-bold">{name}</CardTitle>
              <CardDescription className="text-gray-500">
                Customer Profile
              </CardDescription>
              <Badge variant="outline" className="mt-2 bg-blue-50">
                Member since {memberSince}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="mr-2 h-5 w-5 text-white" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-800">{email || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-gray-800">{phone || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-start col-span-full">
                  <MapPin className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-gray-800">{address || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>

            {kids && kids.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-white" />
                  Children ({kids.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kids.map((kid) => (
                    <Card key={kid.id} className="bg-gray-200 border-none">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 bg-black">
                            <AvatarFallback className="text-white">
                              {kid.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{kid.name}</h4>
                            <div className="flex items-center text-sm text-gray-600 mt-1 gap-4">
                              <span className="flex items-center">
                                <Badge variant="outline" className="mr-1">
                                  {kid.gender}
                                </Badge>
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {calculateAge(kid.birthday)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
