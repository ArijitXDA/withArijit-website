const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface EmailRequest {
  email: string;
  name: string;
}

Deno.serve(async (req: Request) => {
  console.log("=== EMAIL FUNCTION STARTED ===");
  console.log("Request method:", req.method);
  console.log("Request URL:", req.url);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight");
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log("=== PARSING REQUEST BODY ===");
    const requestBody = await req.text();
    console.log("Raw request body:", requestBody);
    
    const { email, name }: EmailRequest = JSON.parse(requestBody);
    console.log("Parsed email:", email);
    console.log("Parsed name:", name);
    
    // Validate input
    if (!email || !name) {
      console.log("ERROR: Missing email or name");
      return new Response(
        JSON.stringify({ error: "Email and name are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if Resend API key is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    console.log("Resend API key exists:", !!resendApiKey);
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY environment variable not set");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate HTML email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Thank You for Registering</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e40af, #3730a3); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Thank You for Registering!</h1>
            <p>Welcome to WithArijit</p>
          </div>
          <div class="content">
            <h2>Dear ${name},</h2>
            <p>Thank you for registering with WithArijit! We're excited to have you onboard for your AI learning journey.</p>
            
            <h3>🎯 What's Next?</h3>
            <ul>
              <li>Explore our comprehensive AI courses</li>
              <li>Join live masterclasses every weekend</li>
              <li>Connect with our learning community</li>
              <li>Start building real AI projects</li>
            </ul>

            <div style="text-align: center;">
              <a href="https://witharijit.com/courses" class="button">🚀 Explore Courses</a>
            </div>

            <p>If you have any questions, feel free to reach out to us at <a href="mailto:star.analytix.ai@gmail.com">star.analytix.ai@gmail.com</a> or call us at +91 99300 51053.</p>
            <p>If you have any questions, feel free to reach out to us at <a href="mailto:AI@withArijit.com">AI@withArijit.com</a> or call us at +91 99300 51053.</p>
            
            <p>Welcome aboard!</p>
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
    console.log(`=== SENDING EMAIL TO: ${email} ===`);
    
    // Use custom domain if available, otherwise use Resend's testing domain
    const fromEmail = "WithArijit <onboarding@resend.dev>"; // Using testing domain
    
    // Send to your email for testing (Resend restriction)
    const toEmail = "star.analytix.ai@gmail.com";
    
    const emailPayload = {
      from: fromEmail,
      to: [toEmail],
      subject: `🚀 Welcome to WithArijit - Thank You for Registering, ${name}!`,
      html: emailHtml,
    };

    console.log("Email payload:", JSON.stringify(emailPayload, null, 2));

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    const responseData = await response.json();
    console.log("Resend API response status:", response.status);
    console.log("Resend API response data:", responseData);

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.status} - ${JSON.stringify(responseData)}`);
    }

    console.log("Email sent successfully via Resend");
    console.log("=== EMAIL FUNCTION COMPLETED SUCCESSFULLY ===");
    
    return new Response(
      JSON.stringify({ 
        message: "Email sent successfully",
        recipient: email,
        name: name,
        emailId: responseData.id,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("=== EMAIL FUNCTION ERROR ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to send email",
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});