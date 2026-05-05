import { sendEmail } from "@/src/lib/mailer";

export async function POST(req: Request) {
  try {
    const { name, company, email, phone, productIds, productId, requirement, business } =
      await req.json();

    // Handle both old productId and new productIds for backward compatibility
    const products = productIds || (productId ? [productId] : []);

    const message = `
New Quote Request:

Name: ${name}
Company: ${company}
Email: ${email}
Phone: ${phone}
Business: ${business}
Products of Interest: ${products.join(", ")}

Requirement:
${requirement}
    `;

    await sendEmail(
      process.env.EMAIL_USER!,
      "New Quote Request",
      message
    );

    await sendEmail(
      email,
      "Quote Request Received",
      "Thanks! Our team will contact you shortly."
    );

    return Response.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: "Failed to send quote" }, { status: 500 });
  }
}