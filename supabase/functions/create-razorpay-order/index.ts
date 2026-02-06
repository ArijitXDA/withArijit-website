const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
};

interface CreateOrderRequest {
  amount: number;
  currency: string;
  receipt: string;
  notes?: {
    course?: string;
    email?: string;
    mobile?: string;
    reference_id?: string;
  };
}

interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

Deno.serve(async (req: Request) => {
  console.log("=== CREATE RAZORPAY ORDER FUNCTION STARTED ===");
  console.log("Request method:", req.method);
  console.log("Request URL:", req.url);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Parse request body
    console.log("=== PARSING REQUEST BODY ===");
    const requestBodyText = await req.text();
    console.log("Raw request body:", requestBodyText);
    
    let requestBody: CreateOrderRequest;
    try {
      requestBody = JSON.parse(requestBodyText);
      console.log("Request body parsed successfully:", requestBody);
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid JSON in request body",
          details: parseError.message,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { amount, currency, receipt, notes } = requestBody;
    
    console.log("Order creation request:", { amount, currency, receipt, notes });

    // Validate input
    if (!amount || !currency || !receipt) {
      console.error("Missing required fields:", { amount: !!amount, currency: !!currency, receipt: !!receipt });
      return new Response(
        JSON.stringify({
          success: false,
          error: "Amount, currency, and receipt are required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get Razorpay credentials
    console.log("=== CHECKING ENVIRONMENT VARIABLES ===");
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    
    console.log("RAZORPAY_KEY_ID exists:", !!razorpayKeyId);
    console.log("RAZORPAY_KEY_SECRET exists:", !!razorpayKeySecret);
    console.log("RAZORPAY_KEY_ID value:", razorpayKeyId ? `${razorpayKeyId.substring(0, 10)}...` : "NOT SET");
    console.log("RAZORPAY_KEY_SECRET value:", razorpayKeySecret ? `${razorpayKeySecret.substring(0, 10)}...` : "NOT SET");
    
    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error("Razorpay credentials missing from environment");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Razorpay credentials not configured in Supabase environment",
          details: {
            keyIdExists: !!razorpayKeyId,
            keySecretExists: !!razorpayKeySecret,
            message: "Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Supabase Edge Functions environment variables"
          }
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create order using Razorpay Orders API
    const orderData = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency,
      receipt: receipt.length > 40 ? receipt.substring(0, 40) : receipt,
      notes: notes || {},
    };

    console.log("=== CREATING RAZORPAY ORDER ===");
    console.log("Creating Razorpay order with data:", orderData);

    // Encode credentials for Basic Auth
    const credentials = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    console.log("Basic auth credentials prepared");

    console.log("Making request to Razorpay API...");

    let response;
    try {
      response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${credentials}`,
          "Content-Type": "application/json",
          "User-Agent": "Supabase-Edge-Function/1.0",
        },
        body: JSON.stringify(orderData),
      });
      console.log("Razorpay API response status:", response.status);
      console.log("Razorpay API response headers:", Object.fromEntries(response.headers.entries()));
    } catch (fetchError) {
      console.error("Network error calling Razorpay API:", fetchError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Network error calling Razorpay API",
          details: fetchError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let responseData;
    try {
      const responseText = await response.text();
      console.log("Razorpay API raw response:", responseText);
      responseData = JSON.parse(responseText);
      console.log("Razorpay API parsed response:", responseData);
    } catch (jsonError) {
      console.error("Failed to parse Razorpay API response:", jsonError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid response from Razorpay API",
          details: jsonError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!response.ok) {
      console.error("Razorpay API error:", response.status, responseData);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Razorpay API error: ${response.status}`,
          details: responseData,
          razorpayStatus: response.status,
          message: "Check your Razorpay API credentials and account status"
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const order: RazorpayOrderResponse = responseData;

    console.log("Order created successfully:", order.id);
    console.log("=== FUNCTION COMPLETED SUCCESSFULLY ===");

    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
          status: order.status,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("=== UNEXPECTED ERROR IN EDGE FUNCTION ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: "Unexpected error in edge function",
        details: error.message,
        stack: error.stack,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});