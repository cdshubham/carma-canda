import { NextResponse } from "next/server";
import User from "@/models/userModels";
import nodemailer from "nodemailer";
import { connect } from "@/db/connection";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email
const sendEmail = async (to, subject, text, imageUrl) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: `
      <h2>${subject}</h2>
      <p>${text}</p>
      <img src="${imageUrl}" alt="Greeting Image" style="width:100%;max-width:400px;">
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email: ${error}`);
  }
};

// API Route
export async function GET() {
  await connect();

  const today = new Date();
  const formattedToday = `${today.getMonth() + 1}-${today.getDate()}`;

  const users = await User.find();

  for (const user of users) {
    const userBirthday = user.birthday
      ? `${user.birthday.getMonth() + 1}-${user.birthday.getDate()}`
      : null;
    const anniversary = user.anniversary
      ? `${user.anniversary.getMonth() + 1}-${user.anniversary.getDate()}`
      : null;

    //  User's Birthday Email
    if (userBirthday === formattedToday) {
      await sendEmail(
        user.email,
        "Happy Birthday! 🎉",
        `Dear ${user.first_name},\n\nWishing you a fantastic birthday filled with joy and happiness!\n\nBest regards,\nYour Company`,
        "https://www.sugar.org/wp-content/uploads/Birthday-Cake-1.png"
      );
    }

    //  Anniversary Email
    if (anniversary === formattedToday) {
      await sendEmail(
        user.email,
        "Happy Anniversary! 🎊",
        `Dear ${user.first_name},\n\nCongratulations on your special day! Wishing you many more years of happiness.\n\nBest regards,\nYour Company`,
        "https://png.pngtree.com/png-vector/20240506/ourlarge/pngtree-happy-anniversary-my-love-png-image_12376873.png"
      );
    }

    //  Spouse's Birthday Email
    if (user.spouse && user.spouse.birthday) {
      const spouseBirthday = `${user.spouse.birthday.getMonth() + 1}-${user.spouse.birthday.getDate()}`;
      if (spouseBirthday === formattedToday) {
        await sendEmail(
          user.email,
          `Happy Birthday to Your Spouse, ${user.spouse.first_name}! 🎂`,
          `Dear ${user.first_name},\n\nWishing your beloved ${user.spouse.first_name} a wonderful birthday!\n\nBest regards,\nYour Company`,
          "https://www.sugar.org/wp-content/uploads/Birthday-Cake-1.png"
        );
      }
    }

    // Children's Birthday Email
    if (user.children && user.children.length > 0) {
      for (const child of user.children) {
        const childBirthday = child.birthday
          ? `${child.birthday.getMonth() + 1}-${child.birthday.getDate()}`
          : null;
        if (childBirthday === formattedToday) {
          await sendEmail(
            user.email,
            `Happy Birthday to ${child.first_name}! 🎂`,
            `Dear ${user.first_name},\n\nWishing your child, ${child.first_name}, a fantastic birthday!\n\nBest regards,\nYour Company`,
            "https://thumbs.dreamstime.com/b/cartoon-kids-birthday-party-greeting-card-happy-children-celebrating-balloons-gifts-colorful-vector-illustration-347960233.jpg"
          );
        }
      }
    }
  }

  return NextResponse.json({ message: "Emails sent successfully!" });
}
