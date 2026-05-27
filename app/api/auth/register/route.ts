import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import bcrypt from "bcryptjs";
import { generateOTP } from "@/src/lib/otp";
import { sendEmail } from "@/src/lib/sendEmail";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  const hashed = await bcrypt.hash(password, 10);
  const otp = generateOTP();

  await db.insert(users).values({
    name,
    email,
    password: hashed,
    otp,
    otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
  });

  const otpHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: linear-gradient(135deg, #141D3D, #364FA3); padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 600;">Verify Your Account</h1>
        <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin-top: 8px;">Use the code below to complete your registration</p>
      </div>
      <div style="padding: 32px 24px; text-align: center;">
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 16px;">Hi ${name || "there"},</p>
        <p style="color: #374151; font-size: 14px; margin: 0 0 24px;">Your one-time verification code is:</p>
        <div style="background: #f0f4ff; border: 2px dashed #364FA3; border-radius: 12px; padding: 20px; display: inline-block;">
          <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #141D3D;">${otp}</span>
        </div>
        <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">This code expires in 10 minutes.</p>
      </div>
      <div style="background: #f9fafb; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">If you didn't request this, please ignore this email.</p>
      </div>
    </div>`;

  await sendEmail(email, "Your OTP Verification Code", otpHtml);

  return Response.json({ success: true });
}