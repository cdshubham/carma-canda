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
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  Users,
  Heart,
  User,
  Cake,
  Globe,
  Link as LinkIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import useFetch from "../../hooks/useFetch";

export default function HomePage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  console.log("hehehhehee", session);

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
      console.log("tutututu", userDetails);
    }
  }, [error]);

  if (error && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 p-4 sm:p-6 md:p-8">
        <div className="text-center space-y-4 w-full max-w-md">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
            Unable to load profile
          </h3>
          <p className="text-red-500 text-sm sm:text-base">{error}</p>
          <button
            className="px-3 py-2 sm:px-4 sm:py-2 bg-black hover:bg-gray-800 text-white rounded-md transition-colors text-sm sm:text-base"
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
      <div className="relative h-full w-full min-h-[50vh]">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!userDetails) {
    return null;
  }

  const name =
    `${userDetails.first_name || ""} ${userDetails.last_name || ""}`.trim();

  // const address =
  //   userDetails.street && userDetails.city
  //     ? `${userDetails.street}, ${userDetails.city}, ${userDetails.state} ${userDetails.zipcode}, ${userDetails.country}`
  //     : "Not provided";

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  // Format date to display
  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      console.log(e);

      return "Invalid date";
    }
  };

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

  const hasSpouse =
    userDetails.spouse &&
    (userDetails.spouse.first_name || userDetails.spouse.last_name);
  const spouseName = hasSpouse
    ? `${userDetails.spouse.first_name || ""} ${userDetails.spouse.last_name || ""}`.trim()
    : null;

  // Anniversary years
  const getAnniversaryYears = (dateString) => {
    if (!dateString) return null;
    try {
      const anniversaryDate = new Date(dateString);
      const currentDate = new Date();
      const years = currentDate.getFullYear() - anniversaryDate.getFullYear();
      return years;
    } catch (e) {
      console.log(e);

      return null;
    }
  };

  const anniversaryYears = getAnniversaryYears(userDetails.anniversary);

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
      <Card className="shadow-lg border-gray-200 overflow-hidden">
        <CardHeader className="pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-white shadow-md flex-shrink-0">
              <AvatarImage
                src="/placeholder-avatar.jpg"
                alt={`${name}'s avatar`}
              />
              <AvatarFallback className="text-xl sm:text-2xl bg-black text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left space-y-1 flex-1 w-full">
              <CardTitle className="text-xl sm:text-2xl font-bold break-words">
                {name}
              </CardTitle>
              <CardDescription className="text-gray-500 text-sm sm:text-base">
                Customer Profile
              </CardDescription>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-xs sm:text-sm !rounded-badgeradius"
                >
                  Member since {userDetails.memberSince || "N/A"}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-gray-50 text-xs sm:text-sm !rounded-badgeradius"
                >
                  {userDetails.gender || "Not specified"}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
          <div className="space-y-6 sm:space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
                <User className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-4 sm:gap-x-8">
                <div className="flex items-start">
                  <Cake className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500">
                      Birthday
                    </p>
                    <p className="text-sm sm:text-base text-gray-800 break-words">
                      {formatDate(userDetails.birthday)}
                    </p>
                  </div>
                </div>
                {userDetails.anniversary && (
                  <div className="flex items-start">
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-500">
                        Anniversary
                      </p>
                      <p className="text-sm sm:text-base text-gray-800 break-words">
                        {formatDate(userDetails.anniversary)}
                        {anniversaryYears !== null && (
                          <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-500">
                            ({anniversaryYears}{" "}
                            {anniversaryYears === 1 ? "year" : "years"})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
                <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-4 sm:gap-x-8">
                <div className="flex items-start">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500">
                      Email
                    </p>
                    <p className="text-sm sm:text-base text-gray-800 break-words">
                      {userDetails.email || "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500">
                      Phone
                    </p>
                    <p className="text-sm sm:text-base text-gray-800 break-words">
                      {userDetails.phone || "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start col-span-1 sm:col-span-2">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500">
                      Address
                    </p>
                    <p className="text-sm sm:text-base text-gray-800 break-words">
                      {userDetails.street}, {userDetails.city},{" "}
                      {userDetails.state} {userDetails.zipcode},{" "}
                      {userDetails.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            {userDetails.social_media &&
              userDetails.social_media.length > 0 && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
                    <Globe className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                    Social Media
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {userDetails.social_media.map((social, index) => (
                      <div key={index} className="flex items-center">
                        <LinkIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0 overflow-hidden">
                          <p className="text-xs sm:text-sm font-medium text-gray-500">
                            {social.platform}
                          </p>
                          <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm sm:text-base truncate block"
                          >
                            {social.handle || social.url}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Spouse Information */}
            {hasSpouse && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
                  <Heart className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  Spouse Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-4 sm:gap-x-8">
                  <div className="flex items-start">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-500">
                        Name
                      </p>
                      <p className="text-sm sm:text-base text-gray-800 break-words">
                        {spouseName}
                      </p>
                    </div>
                  </div>
                  {userDetails.spouse.gender && (
                    <div className="flex items-start">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-500">
                          Gender
                        </p>
                        <p className="text-sm sm:text-base text-gray-800 break-words">
                          {userDetails.spouse.gender}
                        </p>
                      </div>
                    </div>
                  )}
                  {userDetails.spouse.birthday && (
                    <div className="flex items-start">
                      <Cake className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-500">
                          Birthday
                        </p>
                        <p className="text-sm sm:text-base text-gray-800 break-words">
                          {formatDate(userDetails.spouse.birthday)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Children Information */}
            {userDetails.children && userDetails.children.length > 0 && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
                  <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  Children ({userDetails.children.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {userDetails.children.map((kid) => (
                    <Card key={kid.id} className="bg-gray-50 border-none">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 bg-black flex-shrink-0">
                            <AvatarFallback className="text-white text-xs sm:text-sm">
                              {kid.first_name?.charAt(0) || "K"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm sm:text-base truncate">
                              {kid.first_name + " " + kid.first_name}
                            </h4>
                            <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600 mt-1 gap-2 sm:gap-4">
                              <span className="flex items-center">
                                <Badge
                                  variant="outline"
                                  className="text-xs px-1 py-0 sm:px-2 !rounded-badgeradius"
                                >
                                  {kid.gender || "Unknown"}
                                </Badge>
                              </span>
                              <span className="flex items-center truncate">
                                <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
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
