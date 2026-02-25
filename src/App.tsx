import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import Layout from './components/Layout'

// =====================================================
// Existing Pages (direct imports - critical for initial load)
// =====================================================
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'

// =====================================================
// Lazy-loaded Existing Pages
// =====================================================
const Courses = lazy(() => import('./pages/Courses'))
const BuildAIProjects = lazy(() => import('./pages/BuildAIProjects'))
const MasterClass = lazy(() => import('./pages/MasterClass'))
const FindAIJob = lazy(() => import('./pages/FindAIJob'))
const PythonMLAI = lazy(() => import('./pages/PythonMLAI'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'))
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'))
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'))
const PaymentCancelled = lazy(() => import('./pages/PaymentCancelled'))
const ContactSuccess = lazy(() => import('./pages/ContactSuccess'))
const AICertification = lazy(() => import('./pages/AICertification'))
const AICertificationPharmaFMCG = lazy(() => import('./pages/AICertificationPharmaFMCG'))
const AICertificationSales = lazy(() => import('./pages/AICertificationSales'))
const AICertificationMarketing = lazy(() => import('./pages/AICertificationMarketing'))
const AICertificationHRProject = lazy(() => import('./pages/AICertificationHRProject'))
const AICertificationStartups = lazy(() => import('./pages/AICertificationStartups'))
const AICertificationCXO = lazy(() => import('./pages/AICertificationCXO'))
const VibeCoding = lazy(() => import('./pages/VibeCoding'))
const ZodiacPremiumAI = lazy(() => import('./pages/ZodiacPremiumAI'))
const Library = lazy(() => import('./pages/Library'))
const AIReadinessQuiz = lazy(() => import('./pages/AIReadinessQuiz'))
const AICertificateApplication = lazy(() => import('./pages/AICertificateApplication'))
const AISpots = lazy(() => import('./pages/AISpots'))

// =====================================================
// Legacy Admin Pages (still within Layout)
// =====================================================
const AdminSessions = lazy(() => import('./pages/AdminSessions'))
const AdminStudents = lazy(() => import('./pages/AdminStudents'))
const AdminSessionLinks = lazy(() => import('./pages/AdminSessionLinks'))
const AdminCertificates = lazy(() => import('./pages/AdminCertificates'))
const AdminLibrary = lazy(() => import('./pages/AdminLibrary'))
const AdminAISpotManagement = lazy(() => import('./pages/AdminAISpotManagement'))
const AdminAISpotAnalytics = lazy(() => import('./pages/AdminAISpotAnalytics'))

// =====================================================
// V2 Pages (New - all lazy loaded)
// =====================================================
const CoursesV2 = lazy(() => import('./pages/CoursesV2'))
const CourseDetailV2 = lazy(() => import('./pages/CourseDetailV2'))
const ChooseBatch = lazy(() => import('./pages/ChooseBatch'))
const GroupBooking = lazy(() => import('./pages/GroupBooking'))
const GroupBookingSignup = lazy(() => import('./pages/GroupBookingSignup'))
const AuthCallback = lazy(() => import('./pages/auth/AuthCallback'))

// =====================================================
// V2 Admin (New admin system with AdminLayout)
// =====================================================
const AdminLoginV2 = lazy(() => import('./components/admin/AdminLoginV2'))
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminCoursesManage = lazy(() => import('./pages/admin/AdminCoursesManage'))
const AdminDiscounts = lazy(() => import('./pages/admin/AdminDiscounts'))
const AdminBatches = lazy(() => import('./pages/admin/AdminBatches'))
const AdminEnrollments = lazy(() => import('./pages/admin/AdminEnrollments'))
const AdminPaymentsV2 = lazy(() => import('./pages/admin/AdminPaymentsV2'))
const AdminAIChatLimits = lazy(() => import('./pages/admin/AdminAIChatLimits'))
const AdminStudyMaterials = lazy(() => import('./pages/admin/AdminStudyMaterials'))
const AdminGroupBookings = lazy(() => import('./pages/admin/AdminGroupBookings'))
const AdminEmailTemplates = lazy(() => import('./pages/admin/AdminEmailTemplates'))
const AdminUserManagement = lazy(() => import('./pages/admin/AdminUserManagement'))
const AdminReports = lazy(() => import('./pages/admin/AdminReports'))

// =====================================================
// Loading Fallback
// =====================================================
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  )
}

// =====================================================
// App Component
// =====================================================
function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ============================================ */}
              {/* Admin V2 Routes - Outside main Layout        */}
              {/* ============================================ */}
              <Route path="/admin/login" element={<AdminLoginV2 />} />

              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="courses" element={<AdminCoursesManage />} />
                <Route path="discounts" element={<AdminDiscounts />} />
                <Route path="batches" element={<AdminBatches />} />
                <Route path="enrollments" element={<AdminEnrollments />} />
                <Route path="payments" element={<AdminPaymentsV2 />} />
                <Route path="ai-chat-limits" element={<AdminAIChatLimits />} />
                <Route path="study-materials" element={<AdminStudyMaterials />} />
                <Route path="group-bookings" element={<AdminGroupBookings />} />
                <Route path="email-templates" element={<AdminEmailTemplates />} />
                <Route path="user-management" element={<AdminUserManagement />} />
                <Route path="reports" element={<AdminReports />} />

                {/* Legacy admin pages - now nested under admin layout */}
                <Route path="sessions" element={<AdminSessions />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="session-links" element={<AdminSessionLinks />} />
                <Route path="certificates" element={<AdminCertificates />} />
                <Route path="library" element={<AdminLibrary />} />
                <Route path="ai-spot-management" element={<AdminAISpotManagement />} />
                <Route path="ai-spot-analytics" element={<AdminAISpotAnalytics />} />
              </Route>

              {/* ============================================ */}
              {/* Auth Callback - Outside main Layout          */}
              {/* ============================================ */}
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* ============================================ */}
              {/* Main Application Routes - Inside Layout      */}
              {/* ============================================ */}
              <Route
                path="/*"
                element={
                  <Layout>
                    <Routes>
                      {/* Core Pages */}
                      <Route path="/" element={<Home />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/signin" element={<SignIn />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />

                      {/* V2 Course Pages (DB-driven) */}
                      <Route path="/courses" element={<CoursesV2 />} />
                      <Route path="/courses/:courseCode" element={<CourseDetailV2 />} />

                      {/* Legacy Course Routes (redirect to V2 equivalents) */}
                      <Route path="/courses/agentic-ai" element={<CourseDetailV2 />} />
                      <Route path="/courses/vibe-coding" element={<CourseDetailV2 />} />
                      <Route path="/courses/python-ml-ai" element={<CourseDetailV2 />} />
                      <Route path="/courses/other" element={<Navigate to="/courses" replace />} />

                      {/* Legacy Certification Routes (keep working) */}
                      <Route path="/ai-certification" element={<AICertification />} />
                      <Route path="/ai-certification/pharma-fmcg" element={<AICertificationPharmaFMCG />} />
                      <Route path="/ai-certification/sales" element={<AICertificationSales />} />
                      <Route path="/ai-certification/marketing" element={<AICertificationMarketing />} />
                      <Route path="/ai-certification/hr-project" element={<AICertificationHRProject />} />
                      <Route path="/ai-certification/startups" element={<AICertificationStartups />} />
                      <Route path="/ai-certification/cxo" element={<AICertificationCXO />} />

                      {/* Other Pages */}
                      <Route path="/build-ai-projects" element={<BuildAIProjects />} />
                      <Route path="/masterclass" element={<MasterClass />} />
                      <Route path="/find-ai-job" element={<FindAIJob />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/library" element={<Library />} />
                      <Route path="/ai-readiness-quiz" element={<AIReadinessQuiz />} />
                      <Route path="/ai-certificate-application" element={<AICertificateApplication />} />
                      <Route path="/ai-spots" element={<AISpots />} />
                      <Route path="/zodiac-premium-ai" element={<ZodiacPremiumAI />} />

                      {/* V2 Flow Pages */}
                      <Route path="/choose-batch" element={<ChooseBatch />} />
                      <Route path="/group-booking" element={<GroupBooking />} />
                      <Route path="/group-booking/signup/:token" element={<GroupBookingSignup />} />

                      {/* Legal & Status Pages */}
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/refund-policy" element={<RefundPolicy />} />
                      <Route path="/shipping-policy" element={<ShippingPolicy />} />
                      <Route path="/payment-success" element={<PaymentSuccess />} />
                      <Route path="/payment-cancelled" element={<PaymentCancelled />} />
                      <Route path="/contact-success" element={<ContactSuccess />} />

                      {/* Catch-all: redirect to home */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Layout>
                }
              />
            </Routes>
          </Suspense>
        </Router>
      </AdminAuthProvider>
    </AuthProvider>
  )
}

export default App
