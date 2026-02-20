// app/api/send-email/route.js - API route for sending purchase emails
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { generateDownloadUrl } from "@/lib/s3";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const {
      customerEmail,
      customerName,
      productName,
      productFileKey,
      orderTotal,
    } = await request.json();

    // Validate required fields
    if (!customerEmail || !productName || !productFileKey) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Generate download URL (valid for 24 hours)
    const downloadUrl = await generateDownloadUrl(productFileKey, 86400);

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
        
        .product-name { 
          color: #22d3ee;
          font-weight: bold;
          font-size: 24px;
          display: block;
          margin: 20px 0;
        }
        
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
            <p>Your order has been confirmed and your download is ready! You've purchased:</p>
            <span class="product-name">${productName}</span>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${downloadUrl}" class="download-button">Download Now</a>
            </div>
            
            <div class="info-box">
              <p>
                <strong>Important:</strong> This download link will expire in 24 hours. 
                Please download your files as soon as possible.
              </p>
            </div>
          </div>
          
          <div class="card">
            <h2>Order Summary</h2>
            <p><strong>Product:</strong> ${productName}</p>
            <p style="margin: 0;"><strong>Total:</strong> $${orderTotal}</p>
          </div>
          
          <div class="card">
            <h2>Need Help?</h2>
            <p>If you have any questions or issues with your download, please don't hesitate to contact us.</p>
            <p style="margin: 0;">Compatible with all major DAWs and convolution reverb plugins.</p>
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
      subject: `Your Purchase: ${productName} - Download Ready!`,
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
