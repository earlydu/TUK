// src/lib/sendEmail.ts

import { resend } from "./resend";

interface SendEmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

/**
 * Send an email via Resend.
 * Accepts either HTML or plain text (plain text is auto-wrapped in a styled template).
 */
export async function sendEmail(to: string, subject: string, content: string) {
  try {
    // If the content already contains HTML tags, use it directly;
    // otherwise treat it as plain text and wrap it in a styled template.
    const isHtml = /<[a-z][\s\S]*>/i.test(content);

    const html = isHtml
      ? content
      : `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #141D3D, #364FA3); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 600;">${subject}</h1>
        </div>
        <div style="padding: 32px 24px;">
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; color: #374151; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${content}</div>
        </div>
        <div style="background: #f9fafb; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">This email was sent from TUK</p>
        </div>
      </div>`;

    const data = await resend.emails.send({
      from: "TUK <website@updates.tuk.co.uk>",
      to,
      subject,
      html,
    });

    return data;
  } catch (error) {
    console.error("Resend email error:", error);
    throw error;
  }
}