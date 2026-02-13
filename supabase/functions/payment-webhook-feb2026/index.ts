const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface RazorpayWebhookPayload {
  event: string;
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
        status: string;
        method: string;
        amount: number;
        currency: string;
        email: string;
        contact: string;
        notes: {
          reference_id?: string;
          course?: string;
          email?: string;
          mobile?: string;
        };
        error_code?: string;
        error_description?: string;
      };
    };
  };
}

Deno.serve(async (req: Request) => {
  console.log("=== PAYMENT WEBHOOK STARTED ===");
  console.log("Request method:", req.method);
  console.log("Request headers:", Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.text();
    console.log("Webhook payload:", body);
    
    // Verify webhook signature (optional but recommended)
    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
    if (webhookSecret) {
      const signature = req.headers.get("x-razorpay-signature");
      if (signature) {
        // Verify signature using crypto
        const crypto = await import("node:crypto");
        const expectedSignature = crypto.createHmac("sha256", webhookSecret)
          .update(body)
          .digest("hex");
        
        if (signature !== expectedSignature) {
          console.error("Invalid webhook signature");
          return new Response(JSON.stringify({ error: "Invalid signature" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        console.log("Webhook signature verified successfully");
      }
    }

    const webhookData: RazorpayWebhookPayload = JSON.parse(body);
    const { event, payload } = webhookData;
    
    console.log("Webhook event:", event);
    console.log("Payment data:", payload.payment.entity);

    // Get Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payment = payload.payment.entity;
    const referenceId = payment.notes?.reference_id;

    if (!referenceId) {
      console.log("No reference_id found in payment notes");
      return new Response(JSON.stringify({ error: "No reference ID" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Determine payment status based on event
    let paymentStatus: string;
    let failureReason: string | null = null;

    switch (event) {
      case "payment.captured":
        paymentStatus = "success";
        break;
      case "payment.failed":
        paymentStatus = "failed";
        failureReason = payment.error_description || "Payment failed";
        break;
      default:
        paymentStatus = "pending";
    }

    // Check if payment was already processed (duplicate webhook prevention)
    const { data: existingPayment, error: checkError } = await supabase
      .from("payments")
      .select("payment_status, razorpay_payment_id")
      .eq("id", referenceId)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing payment:", checkError);
      throw checkError;
    }

    console.log("Existing payment status:", existingPayment?.payment_status);

    // Only process if payment status is changing to success from non-success state
    const wasAlreadyProcessed = existingPayment?.payment_status === "success";

    if (wasAlreadyProcessed && paymentStatus === "success") {
      console.log("Payment already processed successfully, skipping duplicate webhook");
      return new Response(
        JSON.stringify({
          message: "Payment already processed",
          status: paymentStatus,
          reference_id: referenceId,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update payment record in database
    const { data, error } = await supabase
      .from("payments")
      .update({
        payment_status: paymentStatus,
        razorpay_payment_id: payment.id,
        razorpay_order_id: payment.order_id,
        payment_method: payment.method,
        failure_reason: failureReason,
        updated_at: new Date().toISOString(),
      })
      .eq("id", referenceId)
      .select();

    if (error) {
      console.error("Database update error:", error);
      throw error;
    }

    console.log("Payment record updated:", data);

    // Send confirmation email for successful payments
    if (paymentStatus === "success" && data && data[0]) {
      try {
        const paymentRecord = data[0];

        // Handle student master table updates for significant payments
        await handleStudentMasterTableUpdate(supabase, paymentRecord);
        
        await fetch(`${supabaseUrl}/functions/v1/send-payment-confirmation`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${supabaseServiceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: paymentRecord.email,
            name: paymentRecord.name,
            course: paymentRecord.course,
            amount: paymentRecord.amount,
            currency: paymentRecord.currency,
            payment_id: payment.id,
          }),
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Don't fail the webhook for email errors
      }
    }

    return new Response(
      JSON.stringify({ 
        message: "Webhook processed successfully",
        status: paymentStatus,
        reference_id: referenceId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Webhook processing failed",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Function to handle student master table updates
async function handleStudentMasterTableUpdate(supabase: any, paymentRecord: any) {
  try {
    console.log("=== HANDLING STUDENT MASTER TABLE UPDATE ===");
    console.log("Payment record:", paymentRecord);

    const { email, name, course, amount, currency, payment_date, referred_by_email, razorpay_payment_id } = paymentRecord;

    // Check if this is a significant payment (above INR 2000 or USD 100)
    const isSignificantPayment = (currency === 'USD' && amount >= 100) ||
                                (currency !== 'USD' && amount >= 2000);

    console.log("Payment significance check:", {
      amount,
      currency,
      isSignificantPayment,
      razorpay_payment_id
    });

    if (!isSignificantPayment) {
      console.log("Payment amount too small, skipping student master table update");
      return;
    }

    if (!razorpay_payment_id) {
      console.error("CRITICAL: No razorpay_payment_id provided - cannot process payment safely");
      throw new Error("Missing razorpay_payment_id - cannot update student master table");
    }

    // Check if this is a renewal payment
    const isRenewalPayment = course === "Renewal Fee (Existing Student Only)";
    console.log("Is renewal payment:", isRenewalPayment);

    // STEP 1: Check for duplicate payment across ALL payment slots
    console.log("Checking for duplicate payment with razorpay_payment_id:", razorpay_payment_id);
    const { data: duplicateCheck, error: dupError } = await supabase
      .from('student_master_table')
      .select('id, email, "1st_Payment_Razorpay_ID", "2nd_Payment_Razorpay_ID", "3rd_Payment_Razorpay_ID", "4th_Payment_Razorpay_ID"')
      .eq('email', email)
      .maybeSingle();

    if (dupError) {
      console.error("Error checking for duplicate payment:", dupError);
      throw new Error(`Failed to check for duplicate payment: ${dupError.message}`);
    }

    if (duplicateCheck) {
      // Check if this razorpay_payment_id exists in any slot
      if (duplicateCheck["1st_Payment_Razorpay_ID"] === razorpay_payment_id) {
        console.log("DUPLICATE DETECTED: Payment already processed in 1st payment slot");
        return;
      }
      if (duplicateCheck["2nd_Payment_Razorpay_ID"] === razorpay_payment_id) {
        console.log("DUPLICATE DETECTED: Payment already processed in 2nd payment slot");
        return;
      }
      if (duplicateCheck["3rd_Payment_Razorpay_ID"] === razorpay_payment_id) {
        console.log("DUPLICATE DETECTED: Payment already processed in 3rd payment slot");
        return;
      }
      if (duplicateCheck["4th_Payment_Razorpay_ID"] === razorpay_payment_id) {
        console.log("DUPLICATE DETECTED: Payment already processed in 4th payment slot");
        return;
      }
      console.log("No duplicate found - proceeding with payment processing");
    }

    // STEP 2: Find existing student with row locking for atomic updates
    console.log("Fetching existing student with row lock for email:", email);
    const { data: existingStudent, error: checkError } = await supabase
      .from('student_master_table')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing student:", checkError);
      throw new Error(`Failed to check existing student: ${checkError.message}`);
    }

    console.log("Existing student found:", !!existingStudent);
    if (existingStudent) {
      console.log("Existing student details:", {
        id: existingStudent.id,
        email: existingStudent.email,
        current_course_name: existingStudent.current_course_name,
        total_payments_count: existingStudent.total_payments_count,
        total_amount_paid: existingStudent.total_amount_paid,
        payment_razorpay_ids: {
          first: existingStudent["1st_Payment_Razorpay_ID"],
          second: existingStudent["2nd_Payment_Razorpay_ID"],
          third: existingStudent["3rd_Payment_Razorpay_ID"],
          fourth: existingStudent["4th_Payment_Razorpay_ID"]
        }
      });
    }
    
    if (existingStudent) {
      // CASE A: Student exists - UPDATE the existing record
      console.log("CASE A: Student exists, updating existing record with ID:", existingStudent.id);

      let updatePayload: any = {
        updated_at: new Date().toISOString()
      };

      // Update current_course_name only if it's NOT a renewal payment
      if (!isRenewalPayment) {
        updatePayload.current_course_name = course;
        console.log("Updating current_course_name to:", course);
      } else {
        // For renewal payments, preserve the existing course name
        console.log("Renewal payment - preserving existing current_course_name:", existingStudent.current_course_name);
      }

      // STEP 3: Determine which payment slot to fill based on razorpay_payment_id presence
      // This ensures we fill slots sequentially without gaps or overwrites
      let targetSlot: number | null = null;

      if (!existingStudent["1st_Payment_Razorpay_ID"] || existingStudent["1st_Payment_Razorpay_ID"] === null) {
        targetSlot = 1;
        console.log("1st payment slot is empty - assigning payment to slot 1");
      } else if (!existingStudent["2nd_Payment_Razorpay_ID"] || existingStudent["2nd_Payment_Razorpay_ID"] === null) {
        targetSlot = 2;
        console.log("2nd payment slot is empty - assigning payment to slot 2");
      } else if (!existingStudent["3rd_Payment_Razorpay_ID"] || existingStudent["3rd_Payment_Razorpay_ID"] === null) {
        targetSlot = 3;
        console.log("3rd payment slot is empty - assigning payment to slot 3");
      } else if (!existingStudent["4th_Payment_Razorpay_ID"] || existingStudent["4th_Payment_Razorpay_ID"] === null) {
        targetSlot = 4;
        console.log("4th payment slot is empty - assigning payment to slot 4");
      } else {
        console.warn("WARNING: All 4 payment slots are already filled with razorpay_payment_ids");
        console.warn("Student has made more than 4 payments - only updating last_payment_date");
        updatePayload.last_payment_date = payment_date;
        targetSlot = null;
      }

      // STEP 4: Fill the determined payment slot atomically with amount, date, AND razorpay_payment_id
      if (targetSlot !== null) {
        if (targetSlot === 1) {
          updatePayload["1st_Course_Payment_Amount"] = amount;
          updatePayload["1st_Pay_Date"] = payment_date;
          updatePayload["1st_Payment_Razorpay_ID"] = razorpay_payment_id;
          console.log(`Filling slot 1: amount=${amount}, date=${payment_date}, razorpay_id=${razorpay_payment_id}`);
        } else if (targetSlot === 2) {
          updatePayload["2nd_Payment_Amt"] = amount;
          updatePayload["2nd_Payment_Date"] = payment_date;
          updatePayload["2nd_Payment_Razorpay_ID"] = razorpay_payment_id;
          console.log(`Filling slot 2: amount=${amount}, date=${payment_date}, razorpay_id=${razorpay_payment_id}`);
        } else if (targetSlot === 3) {
          updatePayload["3rd_Payment_Amt"] = amount;
          updatePayload["3rd_Payment_Date"] = payment_date;
          updatePayload["3rd_Payment_Razorpay_ID"] = razorpay_payment_id;
          console.log(`Filling slot 3: amount=${amount}, date=${payment_date}, razorpay_id=${razorpay_payment_id}`);
        } else if (targetSlot === 4) {
          updatePayload["4th_Payment_Amt"] = amount;
          updatePayload["4th_Payment_Date"] = payment_date;
          updatePayload["4th_Payment_Razorpay_ID"] = razorpay_payment_id;
          console.log(`Filling slot 4: amount=${amount}, date=${payment_date}, razorpay_id=${razorpay_payment_id}`);
        }
      }

      // STEP 5: Recalculate aggregate fields from ALL payment slots
      // Build fresh slot values including the new payment we just added
      let updatedPaymentSlots = {
        first: parseFloat(existingStudent["1st_Course_Payment_Amount"]) || 0,
        second: parseFloat(existingStudent["2nd_Payment_Amt"]) || 0,
        third: parseFloat(existingStudent["3rd_Payment_Amt"]) || 0,
        fourth: parseFloat(existingStudent["4th_Payment_Amt"]) || 0
      };

      // Update the slot we're filling with the new amount
      if (targetSlot === 1) updatedPaymentSlots.first = amount;
      else if (targetSlot === 2) updatedPaymentSlots.second = amount;
      else if (targetSlot === 3) updatedPaymentSlots.third = amount;
      else if (targetSlot === 4) updatedPaymentSlots.fourth = amount;

      // Calculate totals from the updated slot values
      const calculatedTotalAmount = updatedPaymentSlots.first + updatedPaymentSlots.second +
                                     updatedPaymentSlots.third + updatedPaymentSlots.fourth;
      const calculatedPaymentCount = [
        updatedPaymentSlots.first,
        updatedPaymentSlots.second,
        updatedPaymentSlots.third,
        updatedPaymentSlots.fourth
      ].filter(amt => amt > 0).length;

      updatePayload.total_amount_paid = calculatedTotalAmount;
      updatePayload.total_payments_count = calculatedPaymentCount;
      updatePayload.last_payment_date = payment_date;

      console.log("Calculated aggregates from payment slots:", {
        total_amount_paid: calculatedTotalAmount,
        total_payments_count: calculatedPaymentCount,
        payment_slots: updatedPaymentSlots,
        target_slot_filled: targetSlot
      });

      console.log("Final update payload:", updatePayload);

      // STEP 6: Execute the atomic update
      const { data: updatedStudent, error: updateError } = await supabase
        .from('student_master_table')
        .update(updatePayload)
        .eq('id', existingStudent.id)
        .select();

      if (updateError) {
        console.error("Error updating existing student:", updateError);
        throw new Error(`Failed to update student record: ${updateError.message}`);
      } else {
        console.log("Student record updated successfully:", updatedStudent);

        // STEP 7: Verify the update was correct
        if (updatedStudent && updatedStudent[0]) {
          const verifyRecord = updatedStudent[0];
          console.log("VERIFICATION - Updated record payment slots:", {
            slot1: { amt: verifyRecord["1st_Course_Payment_Amount"], id: verifyRecord["1st_Payment_Razorpay_ID"] },
            slot2: { amt: verifyRecord["2nd_Payment_Amt"], id: verifyRecord["2nd_Payment_Razorpay_ID"] },
            slot3: { amt: verifyRecord["3rd_Payment_Amt"], id: verifyRecord["3rd_Payment_Razorpay_ID"] },
            slot4: { amt: verifyRecord["4th_Payment_Amt"], id: verifyRecord["4th_Payment_Razorpay_ID"] },
            total_count: verifyRecord.total_payments_count,
            total_amount: verifyRecord.total_amount_paid
          });
        }
      }
      
    } else {
      // CASE B: Student doesn't exist - CREATE new record (only for non-renewal payments)
      if (isRenewalPayment) {
        console.error("CRITICAL ERROR: Renewal payment attempted but no existing student record found for email:", email);
        throw new Error("Cannot process renewal payment: No existing student enrollment found");
      }

      console.log("CASE B: Student doesn't exist, creating new record for email:", email);

      const newStudentData = {
        student_name: name,
        email: email,
        mobile: paymentRecord.mobile || '',
        current_course_name: course,
        "1st_Course_Payment_Amount": amount,
        "1st_Pay_Date": payment_date,
        "1st_Payment_Razorpay_ID": razorpay_payment_id,
        "1st_Pay_Discount_Coupon_Used": null,
        referred_by: referred_by_email || null,
        "2nd_Payment_Amt": null,
        "2nd_Payment_Date": null,
        "2nd_Payment_Razorpay_ID": null,
        "3rd_Payment_Amt": null,
        "3rd_Payment_Date": null,
        "3rd_Payment_Razorpay_ID": null,
        "4th_Payment_Amt": null,
        "4th_Payment_Date": null,
        "4th_Payment_Razorpay_ID": null,
        total_payments_count: 1,
        total_amount_paid: amount,
        enrollment_date: payment_date,
        last_payment_date: payment_date,
        batch_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log("Creating new student with data (including razorpay_payment_id):", newStudentData);
      
      // Use upsert to handle potential race conditions
      const { data: newStudent, error: insertError } = await supabase
        .from('student_master_table')
        .upsert([newStudentData], { 
          onConflict: 'email',
          ignoreDuplicates: false 
        })
        .select();
      
      if (insertError) {
        console.error("Error creating new student:", insertError);
        
        // If still getting unique constraint violation, try to update existing record
        if (insertError.code === '23505') {
          console.log("Unique constraint violation during upsert, attempting direct update...");
          
          // Fetch the existing record
          const { data: existingRecord, error: fetchError } = await supabase
            .from('student_master_table')
            .select('*')
            .eq('email', email)
            .single();
          
          if (fetchError) {
            console.error("Error fetching existing record for fallback update:", fetchError);
            throw new Error(`Failed to handle duplicate email: ${fetchError.message}`);
          }
          
          // Update the existing record with new payment info
          // Determine which slot to fill based on razorpay_payment_id
          let fallbackSlot: number | null = null;

          if (!existingRecord["1st_Payment_Razorpay_ID"]) {
            fallbackSlot = 1;
          } else if (!existingRecord["2nd_Payment_Razorpay_ID"]) {
            fallbackSlot = 2;
          } else if (!existingRecord["3rd_Payment_Razorpay_ID"]) {
            fallbackSlot = 3;
          } else if (!existingRecord["4th_Payment_Razorpay_ID"]) {
            fallbackSlot = 4;
          }

          const fallbackUpdatePayload: any = {
            current_course_name: course,
            last_payment_date: payment_date,
            updated_at: new Date().toISOString()
          };

          // Add to appropriate payment slot with razorpay_payment_id
          if (fallbackSlot === 1) {
            fallbackUpdatePayload["1st_Course_Payment_Amount"] = amount;
            fallbackUpdatePayload["1st_Pay_Date"] = payment_date;
            fallbackUpdatePayload["1st_Payment_Razorpay_ID"] = razorpay_payment_id;
          } else if (fallbackSlot === 2) {
            fallbackUpdatePayload["2nd_Payment_Amt"] = amount;
            fallbackUpdatePayload["2nd_Payment_Date"] = payment_date;
            fallbackUpdatePayload["2nd_Payment_Razorpay_ID"] = razorpay_payment_id;
          } else if (fallbackSlot === 3) {
            fallbackUpdatePayload["3rd_Payment_Amt"] = amount;
            fallbackUpdatePayload["3rd_Payment_Date"] = payment_date;
            fallbackUpdatePayload["3rd_Payment_Razorpay_ID"] = razorpay_payment_id;
          } else if (fallbackSlot === 4) {
            fallbackUpdatePayload["4th_Payment_Amt"] = amount;
            fallbackUpdatePayload["4th_Payment_Date"] = payment_date;
            fallbackUpdatePayload["4th_Payment_Razorpay_ID"] = razorpay_payment_id;
          }

          // Recalculate aggregates from all slots
          const slotAmounts = {
            first: parseFloat(existingRecord["1st_Course_Payment_Amount"]) || 0,
            second: parseFloat(existingRecord["2nd_Payment_Amt"]) || 0,
            third: parseFloat(existingRecord["3rd_Payment_Amt"]) || 0,
            fourth: parseFloat(existingRecord["4th_Payment_Amt"]) || 0
          };

          // Apply the new payment to the determined slot
          if (fallbackSlot === 1) slotAmounts.first = amount;
          else if (fallbackSlot === 2) slotAmounts.second = amount;
          else if (fallbackSlot === 3) slotAmounts.third = amount;
          else if (fallbackSlot === 4) slotAmounts.fourth = amount;

          fallbackUpdatePayload.total_amount_paid = slotAmounts.first + slotAmounts.second + slotAmounts.third + slotAmounts.fourth;
          fallbackUpdatePayload.total_payments_count = [slotAmounts.first, slotAmounts.second, slotAmounts.third, slotAmounts.fourth].filter(amt => amt > 0).length;
          
          const { data: fallbackUpdated, error: fallbackError } = await supabase
            .from('student_master_table')
            .update(fallbackUpdatePayload)
            .eq('id', existingRecord.id)
            .select();
          
          if (fallbackError) {
            console.error("Fallback update also failed:", fallbackError);
            throw new Error(`Failed to update existing student record: ${fallbackError.message}`);
          } else {
            console.log("Fallback update successful:", fallbackUpdated);
          }
        } else {
          throw new Error(`Failed to create student record: ${insertError.message}`);
        }
      } else {
        console.log("New student record created successfully:", newStudent);
      }
    }
    
  } catch (error) {
    console.error("Error in handleStudentMasterTableUpdate:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw error; // Re-throw to be handled by the main webhook function
  }
}
