import React, { useState } from 'react'
import { X, CreditCard, User, Mail, BookOpen } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface RazorpaySuccessResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature?: string
}

interface RazorpayFailureResponse {
  error: {
    code: string
    description: string
    source: string
    step: string
    reason: string
    metadata: Record<string, any>
  }
}

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  defaultCourse?: string
  restrictToZodiacCourse?: boolean
  isRenewalPayment?: boolean
  onlyRenewalOption?: boolean
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, defaultCourse = '', restrictToZodiacCourse = false, isRenewalPayment = false, onlyRenewalOption = false }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile_no || '',
    country: 'India',
    course: onlyRenewalOption ? 'Renewal Fee (Existing Student Only)' : defaultCourse || 'Agentic AI',
    couponCode: '',
    payFullAmount: false,
    renewalMonths: 3
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [couponMessage, setCouponMessage] = useState('')
  const [isCheckingReferral, setIsCheckingReferral] = useState(false)
  const [referralDiscount, setReferralDiscount] = useState(0)

  const countries = [
    { value: 'India', label: 'India' },
    { value: 'US', label: 'US' },
    { value: 'Canada', label: 'Canada' },
    { value: 'South America', label: 'South America' },
    { value: 'Rest of Asia & Australia', label: 'Rest of Asia & Australia' },
    { value: 'Africa', label: 'Africa' }
  ]

  const getCoursesForCountry = (country: string) => {
    const allCoursesIndia = [
      { value: '', label: 'Select a course', price: 0, duration: '', currency: 'INR' },
      { value: 'Agentic AI', label: 'Agentic AI Full Course 4 months - INR 2999 per month', price: 2999, duration: '4 months (monthly payment)', currency: 'INR' },
      { value: 'Vibe Coding', label: 'Vibe Coding Full Course 4 months - INR 2999 per month', price: 2999, duration: '4 months (monthly payment)', currency: 'INR' },
      { value: 'Python for ML & AI', label: 'Python for ML & AI (4 Months) - INR 2999 per month', price: 2999, duration: '4 months (monthly payment)', currency: 'INR' },
      { value: '4 Months AI Certification For Professionals', label: '4 Months AI Certification For Professionals - INR 2999 per month', price: 2999, duration: '4 months (monthly payment)', currency: 'INR' },
      { value: 'PowerBI & Tableau', label: 'PowerBI & Tableau (4 Months) - INR 2999 per month', price: 2999, duration: '4 months (monthly payment)', currency: 'INR' },
      { value: 'O365 & Excel Automation', label: 'O365 & Excel Automation (4 Months) - INR 2999 per month', price: 2999, duration: '4 months (monthly payment)', currency: 'INR' },
      { value: 'Quantum Computing', label: 'Quantum Computing (4 Months) - INR 11999 per month', price: 11999, duration: '4 months (monthly payment)', currency: 'INR' },
      { value: 'Masterclass', label: 'Master Class 2 Hours - ₹199 (was ₹3999)', price: 199, duration: '2 hours on Sunday', currency: 'INR' },
      { value: 'Zodiac Premium AI Course', label: 'Zodiac Premium AI Course (4 Months) - INR 3999 per month', price: 3999, duration: '4 months (monthly payment)', currency: 'INR' },
      { value: 'Renewal Fee (Existing Student Only)', label: 'Renewal Fee (Existing Student Only) - INR 2999', price: 2999, duration: 'Monthly renewal payment', currency: 'INR' }
    ]
    
    const allCoursesInternational = [
      { value: '', label: 'Select a course', price: 0, duration: '', currency: 'USD' },
      { value: 'Agentic AI', label: 'Agentic AI Full Course 4 months - USD 149 per month', price: 149, duration: '4 months (monthly payment)', currency: 'USD' },
      { value: 'Vibe Coding', label: 'Vibe Coding Full Course 4 months - USD 149 per month', price: 149, duration: '4 months (monthly payment)', currency: 'USD' },
      { value: 'Python for ML & AI', label: 'Python for ML & AI (4 Months) - USD 149 per month', price: 149, duration: '4 months (monthly payment)', currency: 'USD' },
      { value: '4 Months AI Certification For Professionals', label: '4 Months AI Certification For Professionals - USD 149 per month', price: 149, duration: '4 months (monthly payment)', currency: 'USD' },
      { value: 'PowerBI & Tableau', label: 'PowerBI & Tableau (4 Months) - USD 149 per month', price: 149, duration: '4 months (monthly payment)', currency: 'USD' },
      { value: 'O365 & Excel Automation', label: 'O365 & Excel Automation (4 Months) - USD 149 per month', price: 149, duration: '4 months (monthly payment)', currency: 'USD' },
      { value: 'Quantum Computing', label: 'Quantum Computing (4 Months) - USD 599 per month', price: 599, duration: '4 months (monthly payment)', currency: 'USD' },
      { value: 'Masterclass', label: 'Master Class 2 Hours - $4.99 (was $19.99)', price: 4.99, duration: '2 hours on Sunday', currency: 'USD' },
      { value: 'Zodiac Premium AI Course', label: 'Zodiac Premium AI Course (4 Months) - USD 199 per month', price: 199, duration: '4 months (monthly payment)', currency: 'USD' },
      { value: 'Renewal Fee (Existing Student Only)', label: 'Renewal Fee (Existing Student Only) - USD 149', price: 149, duration: 'Monthly renewal payment', currency: 'USD' }
    ]

    // If this is a renewal payment, only show renewal option
    if (isRenewalPayment) {
      if (country === 'India') {
        return [
          { value: '', label: 'Select a course', price: 0, duration: '', currency: 'INR' },
          { value: 'Renewal Fee (Existing Student Only)', label: 'Renewal Fee (Existing Student Only) - INR 2999', price: 2999, duration: 'Monthly renewal payment', currency: 'INR' }
        ]
      } else {
        return [
          { value: '', label: 'Select a course', price: 0, duration: '', currency: 'USD' },
          { value: 'Renewal Fee (Existing Student Only)', label: 'Renewal Fee (Existing Student Only) - USD 149', price: 149, duration: 'Monthly renewal payment', currency: 'USD' }
        ]
      }
    }

    // If only renewal option should be shown
    if (onlyRenewalOption) {
      if (country === 'India') {
        return [
          { value: 'Renewal Fee (Existing Student Only)', label: 'Renewal Fee (Existing Student Only) - INR 2999', price: 2999, duration: 'Monthly renewal payment', currency: 'INR' }
        ]
      } else {
        return [
          { value: 'Renewal Fee (Existing Student Only)', label: 'Renewal Fee (Existing Student Only) - USD 149', price: 149, duration: 'Monthly renewal payment', currency: 'USD' }
        ]
      }
    }

    if (restrictToZodiacCourse) {
      // Only show Zodiac course when restricted
      if (country === 'India') {
        return [
          { value: '', label: 'Select a course', price: 0, duration: '', currency: 'INR' },
          { value: 'Zodiac Premium AI Course', label: 'Zodiac Premium AI Course (4 Months) - INR 3999 per month', price: 3999, duration: '4 months (monthly payment)', currency: 'INR' }
        ]
      } else {
        return [
          { value: '', label: 'Select a course', price: 0, duration: '', currency: 'USD' },
          { value: 'Zodiac Premium AI Course', label: 'Zodiac Premium AI Course (4 Months) - USD 199 per month', price: 199, duration: '4 months (monthly payment)', currency: 'USD' }
        ]
      }
    }

    if (country === 'India') {
      return allCoursesIndia
    } else {
      return allCoursesInternational
    }
  }

  const courses = getCoursesForCountry(formData.country)
  const selectedCourse = courses.find(c => c.value === formData.course)
  
  // Check if coupon code is an email and apply referral discount
  const isEmailReferral = formData.couponCode.includes('@') && formData.couponCode.includes('.')
  
  // Calculate 4-month payment discount (only for 4-month courses)
  const is4MonthCourse = selectedCourse?.duration?.includes('4 months') || false
  
  // Calculate discounts
  const baseAmount = selectedCourse?.price || 0
  const isValidCoupon = formData.couponCode === '44agentx44' || formData.couponCode === 'goldisold'
  const couponDiscount = formData.couponCode === 'goldisold' ? 0.30 : 
                        formData.couponCode === '44agentx44' ? 0.15 : 0
  
  // For renewal payments, apply discount to the total amount being paid
  let discountBaseAmount = baseAmount
  if (isRenewalPayment && formData.course === 'Renewal Fee (Existing Student Only)') {
    discountBaseAmount = baseAmount * formData.renewalMonths
  } else if (formData.payFullAmount && is4MonthCourse) {
    discountBaseAmount = baseAmount * 4
  }
  
  const couponDiscountAmount = discountBaseAmount * couponDiscount
  
  const referralDiscountAmount = discountBaseAmount * referralDiscount
  const totalDiscountAmount = couponDiscountAmount + referralDiscountAmount
  
  const fullPaymentDiscount = formData.payFullAmount && is4MonthCourse ? 0.07 : 0
  const fullPaymentDiscountAmount = discountBaseAmount * fullPaymentDiscount
  
  // Calculate final amount
  let finalAmount = discountBaseAmount - totalDiscountAmount - fullPaymentDiscountAmount
  
  // Ensure minimum amount
  finalAmount = Math.max(finalAmount, 0)
  
  const amount = finalAmount

  // Function to check if email exists in payments table
  const checkReferralEmail = async (email: string) => {
    if (!email || !email.includes('@') || !email.includes('.')) {
      return false
    }

    try {
      setIsCheckingReferral(true)
      
      const { data, error } = await supabase
        .from('users')
        .select('user_id, email')
        .eq('email', email.toLowerCase().trim())
        .limit(1)

      if (error) {
        console.error('Error checking referral email:', error)
        return false
      }

      return data && data.length > 0
    } catch (error) {
      console.error('Error checking referral email:', error)
      return false
    } finally {
      setIsCheckingReferral(false)
    }
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Reset course selection when country changes
    if (name === 'country') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        course: '' // Reset course when country changes
      }))
    }
    
    // Handle coupon code validation
    if (name === 'couponCode') {
      // Reset referral discount when coupon changes
      setReferralDiscount(0)
      
      if (value === '') {
        setCouponMessage('')
      } else if (value === '44agentx44' || value === 'goldisold') {
        setCouponMessage('')
      } else if (value.includes('@') && value.includes('.')) {
        // Check if it's a valid referral email
        setCouponMessage('Checking referral email...')
        checkReferralEmail(value).then((isValidReferral) => {
          if (isValidReferral) {
            setReferralDiscount(0.07) // 7% referral discount
            setCouponMessage('✅ Valid referral! 7% discount applied')
          } else {
            setReferralDiscount(0)
            setCouponMessage('❌ Email not found in our student database')
          }
        })
      } else {
        setCouponMessage('Wrong coupon code, you can get your discount amount refunded later, write an email to ai@witharijit.com after your payment is complete')
      }
    }
    
    // Handle renewal months change
    if (name === 'renewalMonths') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value)
      }))
    }
    
    setError('')
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
    setError('')
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.course) {
      setError('Please select a course')
      return
    }

    if (!formData.name || !formData.email || !formData.mobile) {
      setError('Please fill in all required fields')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      console.log('=== STARTING PAYMENT PROCESS ===')
      console.log('Form data:', formData)
      console.log('Selected course:', selectedCourse)
      console.log('Amount:', amount)
      console.log('CRITICAL: This should NOT immediately show success')
      console.log('CRITICAL: Must wait for actual Razorpay payment completion')
      
      // Use Razorpay JavaScript SDK to capture response
      await initiateRazorpayPayment()

    } catch (error) {
      console.error('Payment error:', error)
      setError(`Failed to initiate payment: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact support at AI@withArijit.com`)
      setIsProcessing(false)
    } finally {
      // DO NOT set processing to false here - let payment handlers do it
      console.log('Payment initiation completed - waiting for user action')
    }
  }

  const initiateRazorpayPayment = async () => {
    try {
      // Check if we're in a secure context
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        throw new Error('Razorpay requires HTTPS or localhost for security')
      }
      
      // Check if Razorpay SDK is loaded
      if (typeof window.Razorpay === 'undefined') {
        console.error('Razorpay SDK not loaded, attempting to load...')
        
        // Try to load Razorpay SDK dynamically
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.crossOrigin = 'anonymous'
          script.onload = () => resolve()
          script.onerror = (error) => {
            console.error('Failed to load Razorpay script:', error)
            reject(new Error('Failed to load Razorpay SDK. Please check your internet connection and try again.'))
          }
          document.head.appendChild(script)
        })
        
        // Wait a bit for the script to initialize
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        if (typeof window.Razorpay === 'undefined') {
          throw new Error('Failed to load Razorpay SDK. Please check your internet connection and try again.')
        }
      } else {
        console.log('Razorpay SDK already loaded')
      }
      
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID
      
      console.log('Razorpay Key ID exists:', !!razorpayKey)
      console.log('User object:', user)
      
      if (!razorpayKey) {
        throw new Error('Razorpay Key ID is not configured. Please add VITE_RAZORPAY_KEY_ID to your .env file')
      }
      
      if (razorpayKey.trim() === '') {
        throw new Error('Razorpay Key ID is empty. Please check your .env file')
      }
      
      // Determine user_id - use authenticated user's ID or create a unique identifier
      let paymentUserId: string
      
      if (user && user.id) {
        paymentUserId = user.id
        console.log('Using authenticated user ID:', paymentUserId)
      } else {
        paymentUserId = `guest_${crypto.randomUUID()}`
        console.log('Using guest user ID:', paymentUserId)
      }
      
      // Create payment record
      const paymentRecord = {
        user_id: paymentUserId,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        course: formData.course,
        duration: selectedCourse?.duration || '',
        country: formData.country,
        currency: selectedCourse?.currency || 'INR',
        amount: amount,
        payment_status: 'pending',
        payment_date: new Date().toISOString().split('T')[0],
        payment_time: new Date().toTimeString().split(' ')[0],
        referred_by_email: isEmailReferral ? formData.couponCode.toLowerCase().trim() : null
      }

      console.log('Payment record:', paymentRecord)

      // Insert payment record
      const { data: paymentData, error: dbError } = await supabase
        .from('payments')
        .insert([paymentRecord])
        .select()
        .single()

      if (dbError) {
        console.error('Database error:', dbError)
        throw new Error(`Failed to create payment record: ${dbError.message}`)
      }

      console.log('Payment record created:', paymentData)
      
      // Create Razorpay order via edge function
      console.log('Creating Razorpay order via edge function...')
      
      let orderResponse, orderError
      
      try {
        const response = await supabase.functions.invoke('create-razorpay-order', {
          body: {
            amount: amount,
            currency: selectedCourse?.currency || 'INR',
            receipt: `receipt_${paymentData.id}`,
            notes: {
              course: formData.course,
              email: formData.email,
              mobile: formData.mobile,
              reference_id: paymentData.id
            }
          }
        })
        
        orderResponse = response.data
        orderError = response.error
        
        console.log('Edge function response:', { orderResponse, orderError })
      } catch (edgeFunctionError) {
        console.error('Edge function call failed:', edgeFunctionError)
        throw new Error(`Failed to create order: ${edgeFunctionError.message}`)
      }
      
      if (orderError) {
        console.error('Order creation error:', orderError)
        throw new Error(`Failed to create order: ${orderError.message}`)
      }
      
      if (!orderResponse?.success) {
        console.error('Order creation failed:', orderResponse)
        throw new Error(`Failed to create order: ${orderResponse?.error || 'Unknown error'}`)
      }
      
      console.log('Razorpay order created:', orderResponse.order)
      
      // Calculate amount in paise for Razorpay (always use INR for Razorpay)
      const razorpayAmount = selectedCourse?.currency === 'USD' 
        ? Math.round(amount * 83 * 100) // Convert USD to INR paise
        : Math.round(amount * 100) // Convert to paise
      
      console.log('Razorpay amount calculation:', {
        originalAmount: amount,
        currency: selectedCourse?.currency,
        razorpayAmount: razorpayAmount
      })

      // Razorpay options
      const options = {
        key: razorpayKey,
        order_id: orderResponse.order.id, // Use the order ID from Razorpay
        amount: razorpayAmount, // Amount in paise
        currency: 'INR', // Always use INR for Razorpay
        name: 'WithArijit',
        description: `Payment for ${formData.course}`,
        image: `${window.location.origin}/82597b4e-e193-45e5-a266-e303e029de30-removebg-preview.png`,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile
        },
        notes: {
          course: formData.course,
          email: formData.email,
          mobile: formData.mobile,
          reference_id: paymentData.id
        },
        theme: {
          color: '#2563eb'
        },
        handler: async function (response: RazorpaySuccessResponse) {
          console.log('Payment successful:', response)
          await handlePaymentSuccess(response, paymentData.id)
        },
        modal: {
          ondismiss: async function() {
            console.log('Payment cancelled by user')
            await handlePaymentCancel(paymentData.id)
          }
        }
      }

      console.log('Razorpay options:', options)

      console.log('Creating Razorpay instance...')
      
      let rzp
      try {
        // Test if Razorpay constructor is available
        if (typeof window.Razorpay !== 'function') {
          throw new Error('Razorpay SDK loaded but constructor not available')
        }
        
        // Create Razorpay instance and open
        rzp = new window.Razorpay(options)
        console.log('Razorpay instance created successfully')
      } catch (razorpayError) {
        console.error('Error creating Razorpay instance:', razorpayError)
        throw new Error(`Failed to initialize Razorpay: ${razorpayError.message}`)
      }
      
      rzp.on('payment.failed', function (response: RazorpayFailureResponse) {
        console.log('Payment failed:', response)
        handlePaymentFailure(response, paymentData.id)
      })
      
      console.log('Opening Razorpay modal...')
      try {
        rzp.open()
        console.log('Razorpay modal opened successfully')
        console.log('IMPORTANT: Payment modal should now be visible to user')
        console.log('IMPORTANT: Do NOT call success handler until user completes payment')
        
      } catch (openError) {
        console.error('Error opening Razorpay modal:', openError)
        throw new Error(`Failed to open payment modal: ${openError.message}`)
      }

    } catch (error) {
      console.error('Razorpay payment error:', error)
      
      setError(`Failed to initiate payment: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact support at AI@withArijit.com`)
      setIsProcessing(false)
    }
  }

  const handlePaymentFailure = async (razorpayResponse: RazorpayFailureResponse, paymentRecordId: string) => {
    try {
      console.log('=== PAYMENT FAILURE HANDLER ===')
      console.log('Razorpay failure response:', razorpayResponse)
      console.log('Payment record ID:', paymentRecordId)
      
      // Update payment record with failure status
      const { error } = await supabase
        .from('payments')
        .update({
          payment_status: 'failed',
          failure_reason: razorpayResponse.error?.description || 'Payment failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentRecordId)
        .select()

      if (error) {
        console.error('Error updating payment record:', error)
      } else {
        console.log('Payment failure recorded successfully')
      }

      // Show error to user
      setError(`Payment failed: ${razorpayResponse.error?.description || 'Unknown error'}`)
      setIsProcessing(false)
      
    } catch (error) {
      console.error('Error handling payment failure:', error)
      setIsProcessing(false)
    }
  }

  const handlePaymentSuccess = async (razorpayResponse: RazorpaySuccessResponse, paymentRecordId: string) => {
    try {
      console.log('=== PAYMENT SUCCESS HANDLER ===')
      console.log('Razorpay response:', razorpayResponse)
      console.log('Payment record ID:', paymentRecordId)
      
      // CRITICAL: Validate that this is a real Razorpay response
      if (!razorpayResponse || typeof razorpayResponse !== 'object') {
        console.error('Invalid payment response - not an object')
        setError('Invalid payment response. Please try again.')
        setIsProcessing(false)
        return
      }
      
      // Validate that this is a real Razorpay response
      if (!razorpayResponse.razorpay_payment_id || !razorpayResponse.razorpay_order_id) {
        console.error('Invalid Razorpay response - missing payment IDs')
        setError('Invalid payment response. Please try again.')
        setIsProcessing(false)
        return
      }
      
      console.log('Updating payment record with success status')
      
      // Update payment record with success status
      const { data, error } = await supabase
        .from('payments')
        .update({
          payment_status: 'success',
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          payment_method: 'online',
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentRecordId)
        .select()

      if (error) {
        console.error('Error updating payment record:', error)
        alert(`Payment successful but failed to update record: ${error.message}. Please contact support with payment ID: ${razorpayResponse.razorpay_payment_id}`)
      } else {
        console.log('Payment record updated successfully:', data)

        // NOTE: Student master table updates are handled by the payment webhook
        // The webhook is the single source of truth for student_master_table updates
        // This ensures atomic updates with proper duplicate detection and slot assignment
        console.log('Student master table will be updated by payment webhook')

        // Send confirmation email
        try {
          const updatedRecord = data[0]
          console.log('Sending payment confirmation email...')
          
          // Check if Supabase URL is properly configured before calling edge function
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
          const isPlaceholderUrl = !supabaseUrl || 
            supabaseUrl.includes('your_') || 
            supabaseUrl === 'your_supabase_url_here' ||
            supabaseUrl.startsWith('http://localhost')
            
          if (isPlaceholderUrl) {
            setError('❌ Supabase configuration error! Please check your .env file and update VITE_SUPABASE_URL with your actual Supabase project URL.')
            return
          } else {
            const { data: emailData, error: emailError } = await supabase.functions.invoke('send-payment-confirmation', {
              body: {
                email: updatedRecord.email,
                name: updatedRecord.name,
                course: updatedRecord.course,
                amount: updatedRecord.amount,
                currency: updatedRecord.currency,
                payment_id: razorpayResponse.razorpay_payment_id
              }
            })
            
            if (emailError) {
              console.error('Email sending failed:', emailError)
            } else {
              console.log('Confirmation email sent successfully:', emailData)
            }
          }
          
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError)
        }
      }

      // Close modal and redirect to success page
      onClose()
      window.location.href = '/payment-success'
      
    } catch (error) {
      console.error('Error handling payment success:', error)
      alert(`Payment successful but failed to update record: ${error.message}. Please contact support.`)
    }
  }

  const handlePaymentCancel = async (paymentRecordId: string) => {
    try {
      console.log('=== PAYMENT CANCEL HANDLER ===')
      console.log('Payment record ID:', paymentRecordId)
      
      console.log('Updating payment record with cancelled status')
      
      // Update payment record with cancelled status
      const { data, error } = await supabase
        .from('payments')
        .update({
          payment_status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentRecordId)
        .select()

      if (error) {
        console.error('Error updating payment record:', error)
      } else {
        console.log('Payment cancellation recorded successfully:', data)
      }

      setIsProcessing(false)
      // Close modal and redirect to cancel page
      onClose()
      window.location.href = '/payment-cancelled'
      
    } catch (error) {
      console.error('Error handling payment cancellation:', error)
      setIsProcessing(false)
    }
  }

  // Alternative WhatsApp payment method
  const handleWhatsAppPayment = () => {
    const message = `Hi! I want to make a payment for:

Course: ${formData.course}
Amount: ${selectedCourse?.currency === 'USD' ? '$' : '₹'}${amount.toFixed(2)}
Name: ${formData.name}
Email: ${formData.email}
Mobile: ${formData.mobile}
Country: ${formData.country}

Please help me complete the payment.`

    const whatsappUrl = `https://wa.me/919930051053?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    // Show confirmation
    alert('📱 WhatsApp opened! Send the message to complete your payment via WhatsApp.')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Pay Now to Book Your Seat</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Payment Method Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Payment Options Available:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Online Payment via Razorpay (Cards, UPI, NetBanking)</li>
            </ul>
          </div>

          {/* Form */}
          <form onSubmit={handlePayment} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number *
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                required
                value={formData.mobile}
                onChange={handleInputChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your mobile number"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <select
                id="country"
                name="country"
                required
                value={formData.country}
                onChange={handleInputChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                Course *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="course"
                  name="course"
                  required
                  value={formData.course}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {courses.map((course) => (
                    <option key={course.value} value={course.value}>
                      {course.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Renewal Months Selection - Only for renewal payments */}
            {isRenewalPayment && formData.course === 'Renewal Fee (Existing Student Only)' && (
              <div>
                <label htmlFor="renewalMonths" className="block text-sm font-medium text-gray-700 mb-2">
                  How many months? *
                </label>
                <select
                  id="renewalMonths"
                  name="renewalMonths"
                  required
                  value={formData.renewalMonths}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>1 Month</option>
                  <option value={2}>2 Months</option>
                  <option value={3}>3 Months</option>
                  <option value={4}>4 Months</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Select how many months you want to pay for
                </p>
              </div>
            )}

            <div>
              <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700 mb-2">
                Discount coupon code or referral email
              </label>
              <div className="relative">
                <input
                  id="couponCode"
                  name="couponCode"
                  type="text"
                  value={formData.couponCode}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter coupon code (optional)"
                />
                {isCheckingReferral && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter any enrolled student's email for 7% referral discount
              </p>
              {couponMessage && (
                <p className={`text-sm mt-2 ${
                  couponMessage.includes('✅') ? 'text-green-600' : 
                  couponMessage.includes('❌') ? 'text-red-600' : 
                  couponMessage.includes('Checking') ? 'text-blue-600' : 
                  'text-green-600'
                }`}>
                  {couponMessage}
                </p>
              )}
            </div>

            {/* 4-Month Payment Discount Checkbox */}
            {is4MonthCourse && (
              <div className="flex items-start space-x-3">
                <input
                  id="payFullAmount"
                  name="payFullAmount"
                  type="checkbox"
                  checked={formData.payFullAmount}
                  onChange={handleCheckboxChange}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="payFullAmount" className="text-sm text-gray-700">
                  <span className="font-medium">Avail extra 7% discount by paying for 4 months now</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Pay the full 4-month amount upfront and save 7% on the total cost
                  </p>
                </label>
              </div>
            )}

            {selectedCourse && selectedCourse.value && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-900">{selectedCourse.value}</span>
                    <span className="text-lg font-bold text-gray-900">
                      {selectedCourse.currency === 'USD' ? '$' : '₹'}{discountBaseAmount.toFixed(2)}
                    </span>
                  </div>
                  {(couponDiscountAmount > 0 || referralDiscountAmount > 0) && (
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-green-600 text-sm">
                        {isValidCoupon && referralDiscount > 0 
                          ? `Discount (${Math.round(couponDiscount * 100)}% + 7% referral)`
                          : isValidCoupon 
                          ? `Discount (${Math.round(couponDiscount * 100)}%)`
                          : 'Referral Discount (7%)'
                        }
                      </span>
                      <span className="text-green-600 font-semibold">
                        -{selectedCourse.currency === 'USD' ? '$' : '₹'}{totalDiscountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {formData.payFullAmount && is4MonthCourse && (
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-green-600 text-sm">4-Month Upfront Discount (7%)</span>
                      <span className="text-green-600 font-semibold">
                        -{selectedCourse.currency === 'USD' ? '$' : '₹'}{fullPaymentDiscountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {selectedCourse.currency === 'USD' ? '$' : '₹'}{amount.toFixed(2)}
                    </span>
                  </div>
                  {isRenewalPayment && formData.course === 'Renewal Fee (Existing Student Only)' && (
                    <div className="text-xs text-gray-600 mt-2">
                      Payment for {formData.renewalMonths} month{formData.renewalMonths > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {formData.payFullAmount && is4MonthCourse 
                    ? `Full 4-month payment with discounts applied`
                    : isRenewalPayment && formData.course === 'Renewal Fee (Existing Student Only)'
                    ? `Renewal payment for ${formData.renewalMonths} month${formData.renewalMonths > 1 ? 's' : ''}`
                    : selectedCourse.duration
                  }
                </p>
              </div>
            )}

            {/* Payment Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isProcessing || !formData.course}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Pay {selectedCourse?.currency === 'USD' ? '$' : '₹'}{amount.toFixed(2)} Online</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any
  }
}

export default PaymentModal