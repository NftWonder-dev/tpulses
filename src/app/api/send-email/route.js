// app/api/send-email/route.js - Email with multiple product downloads
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { generateDownloadUrl } from "@/lib/s3";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const {
      customerEmail,
      customerName,
      products, // Array of products: [{ name, fileKey }, ...]
      orderTotal,
    } = await request.json();

    // Validate required fields
    if (!customerEmail || !products || products.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Generate download URLs for all products (valid for 24 hours)
    const productsWithUrls = await Promise.all(
      products.map(async (product) => ({
        name: product.name,
        downloadUrl: await generateDownloadUrl(product.fileKey, 86400),
      })),
    );

    // Build product list HTML
    const productListHtml = productsWithUrls
      .map(
        (product) => `
  <div style="margin-bottom: 16px; padding: 20px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="vertical-align: middle;">
          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #22d3ee;">
            ${product.name}
          </p>
        </td>
        <td style="text-align: right; vertical-align: middle;">
          <a href="${product.downloadUrl}" style="display: inline-block; background: #22d3ee; color: #000000; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
            Download
          </a>
        </td>
      </tr>
    </table>
  </div>
`,
      )
      .join("");

    // Create HTML email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #ffffff; color: #1e293b; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            
            .header { 
              background: url('https://i.imgur.com/cF3l4cJ.png') center center no-repeat;
              background-size: cover;
              background-color: rgb(10, 10, 18);
              height: 150px;
              width: 100%;
            }
            
            .content { padding: 40px 20px; background-color: #ffffff; }
            
            .card { 
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 32px;
              margin-bottom: 20px;
            }
            
            h1 { color: #0f172a; font-size: 28px; margin: 0 0 16px 0; font-weight: 700; }
            h2 { color: #0f172a; font-size: 20px; margin: 0 0 16px 0; font-weight: 700; }
            p { color: #475569; line-height: 1.6; margin: 0 0 16px 0; }
            
            .download-button { 
              display: inline-block;
              background: #22d3ee;
              color: #000000;
              text-decoration: none;
              padding: 16px 48px;
              border-radius: 8px;
              font-weight: bold;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .info-box { 
              background: rgba(34, 211, 238, 0.1);
              border: 1px solid rgba(34, 211, 238, 0.3);
              border-radius: 8px;
              padding: 16px;
              margin: 24px 0;
            }
            
            .info-box p {
              margin: 0;
              font-size: 14px;
              color: #0f172a;
            }
            
            .footer { 
              text-align: center;
              color: #94a3b8;
              font-size: 12px;
              padding: 30px 20px;
              background-color: #f8fafc;
            }
            
            .footer p { 
              margin: 4px 0;
              color: #94a3b8;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header with logo background -->
            <div class="header"></div>
            
            <!-- Content -->
            <div class="content">
              <div class="card">
                <h1>Thank You for Your Purchase! 🎉</h1>
                <p>Hi ${customerName},</p>
                <p>Your order has been confirmed and your downloads are ready! You've purchased ${products.length} ${products.length === 1 ? "product" : "products"}:</p>
                
                <!-- Product Downloads -->
                ${productListHtml}
                
                <div class="info-box">
                  <p>
                    <strong>Important:</strong> These download links will expire in 24 hours. 
                    Please download your files as soon as possible.
                  </p>
                </div>
              </div>
              
              <div class="card">
  <h2 style="text-align: center;">Order Summary</h2>
  ${productsWithUrls
    .map(
      (product) => `
    <p style="text-align: center;"><strong>•</strong> ${product.name}</p>
  `,
    )
    .join("")}
  <p style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center;"><strong>Total:</strong> $${orderTotal}</p>
</div>
              
              <div class="card">
  <h2 style="text-align: center;">Need Help?</h2>
  <p style="text-align: center;">
    If you have any questions or issues with your downloads, please don't hesitate to contact us.
  </p>
  <p style="margin: 0; text-align: center;">
    Compatible with all major DAWs and convolution reverb plugins.
  </p>
</div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <p>© 2026 Trim Pulses. All rights reserved.</p>
              <p>Musically Tuned Impulse Responses</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    const { data, error } = await resend.emails.send({
      from: "Trim Pulses <onboarding@resend.dev>",
      to: [customerEmail],
      subject: `Your Purchase: ${products.length} ${products.length === 1 ? "Product" : "Products"} - Download Ready!`,
      html: htmlContent,
    });

    if (error) {
      console.error("Email error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      messageId: data.id,
    });
  } catch (error) {
    console.error("Send email error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 },
    );
  }
}
