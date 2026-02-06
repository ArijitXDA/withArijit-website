const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PaymentRecord {
  id: string;
  email: string;
  amount: number;
  payment_date: string;
  razorpay_payment_id: string;
  payment_status: string;
  course: string;
}

Deno.serve(async (req: Request) => {
  console.log("=== PAYMENT REPAIR SCRIPT STARTED ===");

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();
    const { email, dryRun = true } = body;

    console.log("Repair request:", { email, dryRun });

    if (!email) {
      return new Response(
        JSON.stringify({
          error: "Email is required",
          usage: "POST { email: 'student@example.com', dryRun: true/false }",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // STEP 1: Fetch all successful payments for this student, sorted by date
    console.log(`Fetching all successful payments for ${email}...`);
    const { data: allPayments, error: paymentsError } = await supabase
      .from("payments")
      .select("id, email, amount, payment_date, payment_time, razorpay_payment_id, payment_status, course, currency")
      .eq("email", email)
      .eq("payment_status", "success")
      .order("payment_date", { ascending: true })
      .order("payment_time", { ascending: true });

    if (paymentsError) {
      throw new Error(`Failed to fetch payments: ${paymentsError.message}`);
    }

    if (!allPayments || allPayments.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No successful payments found for this email",
          email: email,
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Found ${allPayments.length} total successful payments`);

    // Filter for significant payments only (matching webhook logic)
    const payments = allPayments.filter(p => {
      const isSignificant = (p.currency === 'USD' && p.amount >= 100) ||
                           (p.currency !== 'USD' && p.amount >= 2000);
      return isSignificant;
    });

    console.log(`Filtered to ${payments.length} significant payments (>= 2000 INR or >= 100 USD)`);

    if (payments.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No significant payments found for this email (payments must be >= 2000 INR or >= 100 USD)",
          email: email,
          total_payments_found: allPayments.length,
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // STEP 2: Fetch the student's current record
    const { data: studentRecord, error: studentError } = await supabase
      .from("student_master_table")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (studentError) {
      throw new Error(`Failed to fetch student record: ${studentError.message}`);
    }

    if (!studentRecord) {
      return new Response(
        JSON.stringify({
          error: "No student record found",
          message: "Student record doesn't exist in student_master_table",
          email: email,
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Current student record:", {
      id: studentRecord.id,
      email: studentRecord.email,
      total_payments_count: studentRecord.total_payments_count,
      total_amount_paid: studentRecord.total_amount_paid,
      payment_slots: {
        first: {
          amount: studentRecord["1st_Course_Payment_Amount"],
          date: studentRecord["1st_Pay_Date"],
          razorpay_id: studentRecord["1st_Payment_Razorpay_ID"],
        },
        second: {
          amount: studentRecord["2nd_Payment_Amt"],
          date: studentRecord["2nd_Payment_Date"],
          razorpay_id: studentRecord["2nd_Payment_Razorpay_ID"],
        },
        third: {
          amount: studentRecord["3rd_Payment_Amt"],
          date: studentRecord["3rd_Payment_Date"],
          razorpay_id: studentRecord["3rd_Payment_Razorpay_ID"],
        },
        fourth: {
          amount: studentRecord["4th_Payment_Amt"],
          date: studentRecord["4th_Payment_Date"],
          razorpay_id: studentRecord["4th_Payment_Razorpay_ID"],
        },
      },
    });

    // STEP 3: Build the corrected payment slots from chronological payments
    const correctedSlots: any = {
      "1st_Course_Payment_Amount": null,
      "1st_Pay_Date": null,
      "1st_Payment_Razorpay_ID": null,
      "2nd_Payment_Amt": null,
      "2nd_Payment_Date": null,
      "2nd_Payment_Razorpay_ID": null,
      "3rd_Payment_Amt": null,
      "3rd_Payment_Date": null,
      "3rd_Payment_Razorpay_ID": null,
      "4th_Payment_Amt": null,
      "4th_Payment_Date": null,
      "4th_Payment_Razorpay_ID": null,
    };

    // Map payments to slots (max 4 payments)
    const slotsToFill = Math.min(payments.length, 4);
    for (let i = 0; i < slotsToFill; i++) {
      const payment = payments[i];
      const slotNum = i + 1;

      if (slotNum === 1) {
        correctedSlots["1st_Course_Payment_Amount"] = payment.amount;
        correctedSlots["1st_Pay_Date"] = payment.payment_date;
        correctedSlots["1st_Payment_Razorpay_ID"] = payment.razorpay_payment_id;
      } else if (slotNum === 2) {
        correctedSlots["2nd_Payment_Amt"] = payment.amount;
        correctedSlots["2nd_Payment_Date"] = payment.payment_date;
        correctedSlots["2nd_Payment_Razorpay_ID"] = payment.razorpay_payment_id;
      } else if (slotNum === 3) {
        correctedSlots["3rd_Payment_Amt"] = payment.amount;
        correctedSlots["3rd_Payment_Date"] = payment.payment_date;
        correctedSlots["3rd_Payment_Razorpay_ID"] = payment.razorpay_payment_id;
      } else if (slotNum === 4) {
        correctedSlots["4th_Payment_Amt"] = payment.amount;
        correctedSlots["4th_Payment_Date"] = payment.payment_date;
        correctedSlots["4th_Payment_Razorpay_ID"] = payment.razorpay_payment_id;
      }
    }

    // Calculate correct aggregates
    const totalAmount = payments.slice(0, 4).reduce((sum, p) => sum + p.amount, 0);
    const totalCount = Math.min(payments.length, 4);

    correctedSlots.total_amount_paid = totalAmount;
    correctedSlots.total_payments_count = totalCount;
    correctedSlots.last_payment_date = payments[Math.min(payments.length, 4) - 1].payment_date;
    correctedSlots.updated_at = new Date().toISOString();

    console.log("Corrected payment slots:", correctedSlots);

    // STEP 4: Build comparison report
    const comparisonReport = {
      email: email,
      dryRun: dryRun,
      total_payments_found: allPayments.length,
      significant_payments_found: payments.length,
      payments_mapped_to_slots: Math.min(payments.length, 4),
      current_data: {
        total_payments_count: studentRecord.total_payments_count,
        total_amount_paid: studentRecord.total_amount_paid,
        slots: {
          first: {
            amount: studentRecord["1st_Course_Payment_Amount"],
            date: studentRecord["1st_Pay_Date"],
            razorpay_id: studentRecord["1st_Payment_Razorpay_ID"],
          },
          second: {
            amount: studentRecord["2nd_Payment_Amt"],
            date: studentRecord["2nd_Payment_Date"],
            razorpay_id: studentRecord["2nd_Payment_Razorpay_ID"],
          },
          third: {
            amount: studentRecord["3rd_Payment_Amt"],
            date: studentRecord["3rd_Payment_Date"],
            razorpay_id: studentRecord["3rd_Payment_Razorpay_ID"],
          },
          fourth: {
            amount: studentRecord["4th_Payment_Amt"],
            date: studentRecord["4th_Payment_Date"],
            razorpay_id: studentRecord["4th_Payment_Razorpay_ID"],
          },
        },
      },
      corrected_data: {
        total_payments_count: correctedSlots.total_payments_count,
        total_amount_paid: correctedSlots.total_amount_paid,
        slots: {
          first: {
            amount: correctedSlots["1st_Course_Payment_Amount"],
            date: correctedSlots["1st_Pay_Date"],
            razorpay_id: correctedSlots["1st_Payment_Razorpay_ID"],
          },
          second: {
            amount: correctedSlots["2nd_Payment_Amt"],
            date: correctedSlots["2nd_Payment_Date"],
            razorpay_id: correctedSlots["2nd_Payment_Razorpay_ID"],
          },
          third: {
            amount: correctedSlots["3rd_Payment_Amt"],
            date: correctedSlots["3rd_Payment_Date"],
            razorpay_id: correctedSlots["3rd_Payment_Razorpay_ID"],
          },
          fourth: {
            amount: correctedSlots["4th_Payment_Amt"],
            date: correctedSlots["4th_Payment_Date"],
            razorpay_id: correctedSlots["4th_Payment_Razorpay_ID"],
          },
        },
      },
      significant_payments_list: payments.slice(0, 4).map((p) => ({
        razorpay_payment_id: p.razorpay_payment_id,
        amount: p.amount,
        date: p.payment_date,
        course: p.course,
      })),
    };

    // STEP 5: Apply update if not dry run
    if (!dryRun) {
      console.log("Applying repair update to database...");
      const { data: updatedRecord, error: updateError } = await supabase
        .from("student_master_table")
        .update(correctedSlots)
        .eq("id", studentRecord.id)
        .select();

      if (updateError) {
        throw new Error(`Failed to update student record: ${updateError.message}`);
      }

      console.log("Student record repaired successfully:", updatedRecord);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Student payment data repaired successfully",
          ...comparisonReport,
          updated_record: updatedRecord[0],
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else {
      console.log("DRY RUN - No changes applied");
      return new Response(
        JSON.stringify({
          success: true,
          message:
            "DRY RUN - No changes applied. Review the comparison and run with dryRun: false to apply changes.",
          ...comparisonReport,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Repair script error:", error);
    return new Response(
      JSON.stringify({
        error: "Repair script failed",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
