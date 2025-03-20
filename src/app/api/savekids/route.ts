import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModels";
// import { connectToDB } from "@/lib/mongoose";
import { connect } from "@/db/connection";

// GET handler to fetch user's family details
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await connect();

    // Fetch user with children data
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Format the response data
    const formattedData = {
      spouse: user.spouse
        ? {
            firstName: user.spouse.first_name || "",
            lastName: user.spouse.last_name || "",
            gender: user.spouse.gender || "",
            birthday: user.spouse.birthday
              ? {
                  day: user.spouse.birthday.getDate(),
                  month: user.spouse.birthday.getMonth() + 1, // JavaScript months are 0-indexed
                  year: user.spouse.birthday.getFullYear(),
                }
              : { day: "", month: "", year: "" },
          }
        : {
            firstName: "",
            lastName: "",
            gender: "",
            birthday: { day: "", month: "", year: "" },
          },
      children:
        user.children && user.children.length > 0
          ? user.children.map((child: any) => ({
              firstName: child.first_name || "",
              lastName: child.last_name || "",
              gender: child.gender || "",
              birthday: child.birthday
                ? {
                    day: child.birthday.getDate(),
                    month: child.birthday.getMonth() + 1,
                    year: child.birthday.getFullYear(),
                  }
                : { day: "", month: "", year: "" },
            }))
          : [],
    };

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching family details:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch family details" },
      { status: 500 }
    );
  }
}

// POST handler to update family details
export async function POST(req: NextRequest) {
  try {
    const { userId, spouse, children } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await connect();

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Format spouse data
    if (spouse) {
      // Only create the date if all parts are provided
      let spouseBirthday = null;
      if (
        spouse.birthday &&
        spouse.birthday.day &&
        spouse.birthday.month &&
        spouse.birthday.year
      ) {
        spouseBirthday = new Date(
          parseInt(spouse.birthday.year),
          parseInt(spouse.birthday.month) - 1, // JavaScript months are 0-indexed
          parseInt(spouse.birthday.day)
        );
      }

      // Update spouse directly in the user document
      user.spouse = {
        first_name: spouse.firstName,
        last_name: spouse.lastName,
        gender: spouse.gender,
        birthday: spouseBirthday,
      };
    }

    // Format children data
    if (children && Array.isArray(children)) {
      // Map the children array to the format expected by the model
      const formattedChildren = children.map((child) => {
        // Only create the date if all parts are provided
        let childBirthday = null;
        if (
          child.birthday &&
          child.birthday.day &&
          child.birthday.month &&
          child.birthday.year
        ) {
          childBirthday = new Date(
            parseInt(child.birthday.year),
            parseInt(child.birthday.month) - 1, // JavaScript months are 0-indexed
            parseInt(child.birthday.day)
          );
        }

        return {
          first_name: child.firstName,
          last_name: child.lastName,
          gender: child.gender,
          birthday: childBirthday,
        };
      });

      // Update the children array in the user document
      user.children = formattedChildren;
    } else {
      // If no children data provided, set it to an empty array
      user.children = [];
    }

    // Log the user data before saving (for debugging)
    console.log(
      "Updating user with data:",
      JSON.stringify(
        {
          spouse: user.spouse,
          children: user.children,
        },
        null,
        2
      )
    );

    // Save the updated user
    await user.save();

    return NextResponse.json(
      { message: "Family details updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating family details:", error.message, error.stack);
    return NextResponse.json(
      { error: error.message || "Failed to update family details" },
      { status: 500 }
    );
  }
}
