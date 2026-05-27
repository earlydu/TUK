import { sendEmail } from "@/src/lib/sendEmail";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const wishlistRows =
      Array.isArray(data.wishlistProducts) && data.wishlistProducts.length
        ? data.wishlistProducts
            .map((item: any, index: number) => {
              const label =
                typeof item === "string"
                  ? item
                  : `${item.name} × ${item.quantity ?? 1}`;
              return `<tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">${index + 1}</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px;">${label}</td>
              </tr>`;
            })
            .join("")
        : "";

    const wishlistSection = wishlistRows
      ? `<div style="margin-top: 24px;">
          <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px;">Wishlist Products</p>
          <table style="width: 100%; border-collapse: collapse; background: #f9fafb; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 8px 12px; text-align: left; color: #6b7280; font-size: 12px; font-weight: 600; width: 40px;">#</th>
                <th style="padding: 8px 12px; text-align: left; color: #6b7280; font-size: 12px; font-weight: 600;">Product</th>
              </tr>
            </thead>
            <tbody>${wishlistRows}</tbody>
          </table>
        </div>`
      : "";

    const enquiryHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #141D3D, #364FA3); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 600;">New Enquiry Form</h1>
          <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin-top: 8px;">A new enquiry has been submitted</p>
        </div>
        <div style="padding: 32px 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; width: 120px; vertical-align: top;">Full Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px; font-weight: 500;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; vertical-align: top;">Company</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px; font-weight: 500;">${data.company}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; vertical-align: top;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px; font-weight: 500;">
                <a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none;">${data.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; vertical-align: top;">Phone</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px; font-weight: 500;">
                <a href="tel:${data.phone}" style="color: #2563eb; text-decoration: none;">${data.phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; vertical-align: top;">Product</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px; font-weight: 500;">${data.product}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; vertical-align: top;">Spend</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px; font-weight: 500;">${data.spend}</td>
            </tr>
          </table>
          <div style="margin-top: 24px;">
            <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px;">Message</p>
            <div style="background: #f9fafb; border-radius: 8px; padding: 16px; color: #374151; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.message}</div>
          </div>
          ${wishlistSection}
        </div>
        <div style="background: #f9fafb; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">This email was sent from the TUK website enquiry form</p>
        </div>
      </div>`;

    await sendEmail("sales@tuk.co.uk", `New Enquiry from ${data.name}`, enquiryHtml);

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to send enquiry" }, { status: 500 });
  }
}
