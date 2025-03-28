import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModels";
import { connect } from "@/db/connection";

interface IChild {
  first_name: string;
  last_name?: string;
  gender: "male" | "female" | "other";
  birthday?: Date;
}
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

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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
          ? // ? user.children.map((child: any) => ({
            user.children.map((child: IChild) => ({
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
  } catch (error) {
    console.error("Error fetching family details:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch family details" },
      { status: 500 }
    );
  }
}

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

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (spouse) {
      let spouseBirthday = null;
      if (
        spouse.birthday &&
        spouse.birthday.day &&
        spouse.birthday.month &&
        spouse.birthday.year
      ) {
        spouseBirthday = new Date(
          parseInt(spouse.birthday.year),
          parseInt(spouse.birthday.month) - 1,
          parseInt(spouse.birthday.day)
        );
      }

      user.spouse = {
        first_name: spouse.firstName,
        last_name: spouse.lastName,
        gender: spouse.gender,
        birthday: spouseBirthday,
      };
    }

    if (children && Array.isArray(children)) {
      const formattedChildren = children.map((child) => {
        let childBirthday = null;
        if (
          child.birthday &&
          child.birthday.day &&
          child.birthday.month &&
          child.birthday.year
        ) {
          childBirthday = new Date(
            parseInt(child.birthday.year),
            parseInt(child.birthday.month) - 1,
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

      user.children = formattedChildren;
    } else {
      user.children = [];
    }

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

    await user.save();

    return NextResponse.json(
      { message: "Family details updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating family details:", error.message, error.stack);
    return NextResponse.json(
      { error: error.message || "Failed to update family details" },
      { status: 500 }
    );
  }
}
