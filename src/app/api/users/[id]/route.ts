import { NextResponse } from "next/server";
import User from "@/models/userModels";
import Kid from "@/models/KidModels";
import { connect } from "@/db/connection";

export async function GET(request, { params }) {
  try {
    await connect();

    const id = params.id;
    console.log("Fetching data for userId:", id);

    const user = await User.findById(id).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const kids = await Kid.find({ userId: id });

    const userData = {
      name: user.username || "User",
      email: user.email,
      phone: user.phoneNumber || "Not provided",
      address: user.address || "Not provided",
      memberSince: new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      }),
      kids: kids.map((kid) => ({
        id: kid._id,
        name: kid.name,
        gender: kid.gender,
        birthday: kid.birthday
          ? kid.birthday.toISOString().split("T")[0]
          : "N/A",
      })),
    };
    console.log(userData);

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error fetching user and kids:", error);
    return NextResponse.json(
      { error: "Failed to fetch user and kids data" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connect();

    const id = params.id;

    const { firstName, lastName, email, phone, address } = await request.json();

    // Basic validation
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "First name, last name, and email are required" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        username: `${firstName} ${lastName}`,
        firstName,
        lastName,
        email,
        phoneNumber: phone,
        address,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "User details updated successfully",
      user: {
        id: updatedUser._id,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`,
        email: updatedUser.email,
        phone: updatedUser.phoneNumber || "Not provided",
        address: updatedUser.address || "Not provided",
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update user data" },
      { status: 500 }
    );
  }
}
