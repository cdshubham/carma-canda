"use client";

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

export default function SetKidsDetailPage() {
  const [children, setChildren] = useState([
    { id: 1, firstName: "", lastName: "", birthday: "", age: "", gender: "" },
  ]);

  const addNewChild = () => {
    const newId =
      children.length > 0
        ? Math.max(...children.map((child) => child.id)) + 1
        : 1;
    setChildren([
      ...children,
      {
        id: newId,
        firstName: "",
        lastName: "",
        birthday: "",
        age: "",
        gender: "",
      },
    ]);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 h-screen overflow-y-auto">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
        Kids Details
      </h1>
      <p className="text-muted-foreground">
        Manage information about your children
      </p>

      <div className="space-y-6">
        {children.map((child, index) => (
          <Card key={child.id} className="w-full">
            <CardHeader>
              <CardTitle>Child {index + 1}</CardTitle>
              <CardDescription>
                Enter information for your child
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`firstName-${child.id}`}>First name</Label>
                  <Input id={`firstName-${child.id}`} className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`lastName-${child.id}`}>Last name</Label>
                  <Input id={`lastName-${child.id}`} className="w-full" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`birthday-${child.id}`}>Birthday</Label>
                  <Input
                    id={`birthday-${child.id}`}
                    type="date"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`age-${child.id}`}>Age</Label>
                  <Input
                    id={`age-${child.id}`}
                    type="number"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`gender-${child.id}`}>Gender</Label>
                  <Select>
                    <SelectTrigger id={`gender-${child.id}`} className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-white shadow-md rounded-md">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            {index !== children.length - 1 && <Separator className="my-2" />}
          </Card>
        ))}

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button
            onClick={addNewChild}
            variant="outline"
            className="flex items-center gap-1 w-full sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Another Child
          </Button>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button className="w-full sm:w-auto text-white bg-black">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
