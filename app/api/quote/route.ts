import { sendEmail } from "@/src/lib/sendEmail";

export async function POST(req: Request) {
  try {
    const { name, company, email, phone, productIds, productId, requirement, business } =
      await req.json();

    // Handle both old productId and new productIds for backward compatibility
    const products = productIds || (productId ? [productId] : []);

    // Admin notification email
    const adminHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #141D3D, #364FA3); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 600;">New Quote Request</h1>
          <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin-top: 8px;">A new quote request has been submitted</p>
        </div>
        <div style="padding: 32px 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; width: 140px; vertical-align: top;">Full Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px; font-weight: 500;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; vertical-align: top;">Company</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px; font-weight: 500;">${company}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; vertical-align: top;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px; font-weight: 500;">
                <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; vertical-align: top;">Phone</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px; font-weight: 500;">
                <a href="tel:${phone}" style="color: #2563eb; text-decoration: none;">${phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; vertical-align: top;">Business</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px; font-weight: 500;">${business}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; vertical-align: top;">Products</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px; font-weight: 500;">${products.join(", ") || "N/A"}</td>
            </tr>
          </table>
          <div style="margin-top: 24px;">
            <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px;">Requirement</p>
            <div style="background: #f9fafb; border-radius: 8px; padding: 16px; color: #374151; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${requirement}</div>
          </div>
        </div>
        <div style="background: #f9fafb; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">This email was sent from the TUK website quote form</p>
        </div>
      </div>`;

    // Customer confirmation email
    const customerHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #141D3D, #364FA3); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 600;">Quote Request Received</h1>
          <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin-top: 8px;">Thank you for your interest!</p>
        </div>
        <div style="padding: 32px 24px; text-align: center;">
          <div style="width: 64px; height: 64px; background: #d1fae5; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 28px;">✓</span>
          </div>
          <p style="color: #374151; font-size: 16px; font-weight: 600; margin: 0 0 12px;">Hi ${name},</p>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">We've received your quote request and our team will review it shortly. We'll get back to you as soon as possible.</p>
        </div>
        <div style="background: #f9fafb; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">TUK — Thank you for choosing us</p>
        </div>
      </div>`;

    await sendEmail(
      "sales@tuk.co.uk",
      `New Quote Request from ${name}`,
      adminHtml
    );

    await sendEmail(
      email,
      "Quote Request Received — TUK",
      customerHtml
    );

    return Response.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: "Failed to send quote" }, { status: 500 });
  }
}