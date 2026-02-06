const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface PaymentConfirmationRequest {
  email: string;
  name: string;
  course: string;
  amount: number;
  currency: string;
  payment_id: string;
}

Deno.serve(async (req: Request) => {
  console.log("=== PAYMENT CONFIRMATION EMAIL FUNCTION STARTED ===");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { email, name, course, amount, currency, payment_id }: PaymentConfirmationRequest = await req.json();
    
    // Check if Resend API key is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("Email service not configured");
    }

    // Generate HTML email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .payment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
          .button { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Payment Confirmed!</h1>
            <p>Your enrollment is now active</p>
          </div>
          <div class="content">
            <h2>Dear ${name},</h2>
            <p>Great news! Your payment has been successfully processed and your enrollment is now confirmed.</p>
            
            <div class="payment-details">
              <h3>📋 Payment Details</h3>
              <p><strong>Course:</strong> ${course}</p>
              <p><strong>Amount:</strong> ${currency === 'USD' ? '$' : '₹'}${amount}</p>
              <p><strong>Payment ID:</strong> ${payment_id}</p>
              <p><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">CONFIRMED</span></p>
            </div>

            <h3>🎯 What's Next?</h3>
            <ul>
              <li>You'll receive course access details within 24 hours</li>
              <li>Check your email for session schedules</li>
              <li>Join our exclusive learning community</li>
              <li>Start your AI transformation journey!</li>
            </ul>

            <div style="text-align: center;">
              <a href="https://witharijit.com/dashboard" class="button">🚀 Access Dashboard</a>
            </div>

            <p>If you have any questions, feel free to reach out to us at <a href="mailto:AI@withArijit.com">AI@withArijit.com</a> or call us at +91 99300 51053.</p>
            
            <p>Welcome to your AI learning journey!</p>
            <p><strong>Arijit Chowdhury</strong><br>
            Trainer & Research Consultant<br>
            AI, BI & Agentic AI</p>
          </div>
          <div class="footer">
            <p>© 2024 WithArijit. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email using Resend API
    const emailPayload = {
      from: "WithArijit <onboarding@resend.dev>",
      to: ["star.analytix.ai@gmail.com"], // Send to your email due to Resend restrictions
      subject: `💳 Payment Confirmed - ${course} Enrollment for ${name}`,
      html: emailHtml,
    };

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.status} - ${JSON.stringify(responseData)}`);
    }

    console.log("Payment confirmation email sent successfully");
    
    return new Response(
      JSON.stringify({ 
        message: "Payment confirmation email sent successfully",
        emailId: responseData.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Payment confirmation email error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to send payment confirmation email",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});