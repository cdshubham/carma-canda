import { NextResponse } from "next/server";
import User from "@/models/userModels";
import { connect } from "@/db/connection";

export async function GET(request, { params }) {
  try {
    await connect();

    const id = await params.id;
    console.log("Fetching data for userId:", id);

    const user = await User.findById(id).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = {
      id: user._id,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email,
      phone: user.phone || "Not provided",
      street: user.address?.street || "Not provided",
      city: user.address?.city || "Not provided",
      state: user.address?.state || "Not provided",
      zipcode: user.address?.zip_code || "Not provided",
      country: user.address?.country || "Not provided",
      gender: user.gender,
      birthday: user.birthday
        ? user.birthday.toISOString().split("T")[0]
        : null,
      anniversary: user.anniversary
        ? user.anniversary.toISOString().split("T")[0]
        : null,
      social_media: user.social_media || [],
      spouse: user.spouse
        ? {
            first_name: user.spouse.first_name || "",
            last_name: user.spouse.last_name || "",
            gender: user.spouse.gender || "",
            birthday: user.spouse.birthday
              ? user.spouse.birthday.toISOString().split("T")[0]
              : null,
          }
        : null,
      memberSince: new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      }),
      children: (user.children || []).map((child) => ({
        id: child._id,
        first_name: child.first_name,
        last_name: child.last_name,
        gender: child.gender,
        birthday: child.birthday
          ? child.birthday.toISOString().split("T")[0]
          : "N/A",
      })),
    };
    console.log(userData);

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
export async function PUT(request, { params }) {
  try {
    await connect();

    const id = params.id;
    const {
      first_name,
      last_name,
      gender,
      email,
      phone,
      state,
      city,
      street,
      country,
      zipcode,
      sizeParameter1,
      sizeParameter2,
      birthday,
      anniversary,
      social_media,
    } = await request.json();

    console.log(
      first_name,
      last_name,
      gender,
      email,
      phone,
      state,
      city,
      street,
      country,
      zipcode,
      gender,
      sizeParameter1,
      sizeParameter2,
      birthday,
      anniversary,
      social_media
    );

    if (!email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        first_name,
        last_name,
        email,
        phone,
        "address.street": street,
        "address.city": city,
        "address.state": state,
        "address.zip_code": zipcode,
        "address.country": country,
        gender,
        birthday,
        anniversary,
        social_media: social_media
          ? social_media.map((item) => ({
              platform: item.platform,
              handle: item.handle,
              url: item.url,
            }))
          : [],
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
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        phone: updatedUser.phone || "Not provided",
        street: updatedUser.address?.street || "Not provided",
        city: updatedUser.address?.city || "Not provided",
        state: updatedUser.address?.state || "Not provided",
        zipcode: updatedUser.address?.zip_code || "Not provided",
        country: updatedUser.address?.country || "Not provided",
        gender: updatedUser.gender,
        birthday: updatedUser.birthday,
        anniversary: updatedUser.anniversary,
        social_media: updatedUser.social_media,
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
