const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "apikey,authorization,content-type,x-client-info",
};

interface ContactNotificationRequest {
  name: string;
  email: string;
  mobile: string;
  purpose: string;
  additional_details?: string;
}

Deno.serve(async (req: Request) => {
  console.log("=== CONTACT NOTIFICATION EMAIL FUNCTION STARTED ===");
  console.log("Request method:", req.method);
  console.log("Request URL:", req.url);
  console.log("Request headers:", Object.fromEntries(req.headers.entries()));

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
    console.log("Request body length:", requestBody.length);
    
    if (!requestBody || requestBody.trim() === '') {
      console.error("Empty request body received");
      return new Response(
        JSON.stringify({ error: "Empty request body" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let parsedData: ContactNotificationRequest;
    try {
      parsedData = JSON.parse(requestBody);
      console.log("Successfully parsed JSON:", parsedData);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body", details: parseError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    const { name, email, mobile, purpose, additional_details } = parsedData;
    console.log("Extracted fields:", { name, email, mobile, purpose, additional_details });
    
    // Validate input
    if (!name || !email || !mobile || !purpose) {
      console.log("ERROR: Missing required fields");
      console.log("Field validation:", { 
        name: !!name, 
        email: !!email, 
        mobile: !!mobile, 
        purpose: !!purpose 
      });
      return new Response(
        JSON.stringify({ error: "Name, email, mobile, and purpose are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if Resend API key is configured
    console.log("=== CHECKING RESEND CONFIGURATION ===");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    console.log("Resend API key exists:", !!resendApiKey);
    console.log("Resend API key length:", resendApiKey ? resendApiKey.length : 0);
    console.log("Resend API key starts with:", resendApiKey ? resendApiKey.substring(0, 10) + "..." : "N/A");
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY environment variable not set");
      return new Response(
        JSON.stringify({ 
          error: "Email service not configured - RESEND_API_KEY missing",
          debug: "Please set RESEND_API_KEY in Supabase Edge Functions environment variables"
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate simple HTML email content
    console.log("=== GENERATING EMAIL CONTENT ===");
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { background: #f8fafc; padding: 20px; }
          .field { margin-bottom: 10px; }
          .label { font-weight: bold; color: #1e40af; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 New Contact Form Submission</h1>
            <p>WithArijit.com</p>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Name:</span> ${name}
            </div>
            <div class="field">
              <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
            </div>
            <div class="field">
              <span class="label">Mobile:</span> <a href="tel:${mobile}">${mobile}</a>
            </div>
            <div class="field">
              <span class="label">Purpose:</span> ${purpose}
            </div>
            ${additional_details ? `
            <div class="field">
              <span class="label">Additional Details:</span><br>
              ${additional_details.replace(/\n/g, '<br>')}
            </div>
            ` : ''}
            <div class="field">
              <span class="label">Submitted:</span> ${new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log("Email HTML generated, length:", emailHtml.length);

    // Send email using Resend API
    console.log("=== SENDING EMAIL VIA RESEND ===");
    const emailPayload = {
      from: "WithArijit Contact <onboarding@resend.dev>",
      to: ["star.analytix.ai@gmail.com"],
      subject: `🔔 New Contact: ${purpose} - ${name}`,
      html: emailHtml,
    };

    console.log("Email payload:", JSON.stringify(emailPayload, null, 2));

    console.log("Making request to Resend API...");
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    console.log("Resend API response status:", response.status);
    console.log("Resend API response headers:", Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log("Resend API raw response:", responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log("Resend API parsed response:", responseData);
    } catch (parseError) {
      console.error("Failed to parse Resend response:", parseError);
      responseData = { raw_response: responseText };
    }

    if (!response.ok) {
      console.error("Resend API error:", response.status, responseData);
      
      // Handle specific Resend API errors
      if (response.status === 502) {
        console.log("Resend API is temporarily down (502 Bad Gateway)");
        return new Response(
          JSON.stringify({ 
            error: "Email service temporarily unavailable",
            details: "Resend API is experiencing issues. Contact form data has been saved.",
            status: 502,
            fallback: true
          }),
          {
            status: 502,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      throw new Error(`Resend API error: ${response.status} - ${JSON.stringify(responseData)}`);
    }

    console.log("Email sent successfully via Resend");
    console.log("Email ID:", responseData.id);
    console.log("=== EMAIL FUNCTION COMPLETED SUCCESSFULLY ===");
    
    return new Response(
      JSON.stringify({ 
        message: "Contact notification email sent successfully",
        emailId: responseData.id,
        timestamp: new Date().toISOString(),
        recipient: "ari.bombay@gmail.com"
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
        error: "Failed to send contact notification email",
        details: error.message,
        timestamp: new Date().toISOString(),
        debug: "Check Supabase Edge Functions logs for more details"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});