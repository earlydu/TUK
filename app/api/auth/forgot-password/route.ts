import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { sendEmail } from "@/src/lib/sendEmail";
import { generateOTP } from "@/src/lib/otp";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { email } = await req.json();

  const otp = generateOTP();

  await db
    .update(users)
    .set({
      otp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    })
    .where(eq(users.email, email));

  const resetHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: linear-gradient(135deg, #141D3D, #364FA3); padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 600;">Password Reset</h1>
        <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin-top: 8px;">Use the code below to reset your password</p>
      </div>
      <div style="padding: 32px 24px; text-align: center;">
        <p style="color: #374151; font-size: 14px; margin: 0 0 24px;">Your password reset code is:</p>
        <div style="background: #fef3c7; border: 2px dashed #d97706; border-radius: 12px; padding: 20px; display: inline-block;">
          <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #92400e;">${otp}</span>
        </div>
        <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">This code expires in 10 minutes.</p>
      </div>
      <div style="background: #f9fafb; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">If you didn't request a password reset, please ignore this email.</p>
      </div>
    </div>`;

  await sendEmail(email, "Password Reset Code", resetHtml);

  return Response.json({ success: true });
}