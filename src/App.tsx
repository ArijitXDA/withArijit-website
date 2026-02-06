import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import BuildAIProjects from './pages/BuildAIProjects'
import MasterClass from './pages/MasterClass'
import FindAIJob from './pages/FindAIJob'
import PythonMLAI from './pages/PythonMLAI'
import About from './pages/About'
import Contact from './pages/Contact'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import RefundPolicy from './pages/RefundPolicy'
import ShippingPolicy from './pages/ShippingPolicy'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancelled from './pages/PaymentCancelled'
import ContactSuccess from './pages/ContactSuccess'
import AICertification from './pages/AICertification'
import AICertificationPharmaFMCG from './pages/AICertificationPharmaFMCG'
import AICertificationSales from './pages/AICertificationSales'
import AICertificationMarketing from './pages/AICertificationMarketing'
import AICertificationHRProject from './pages/AICertificationHRProject'
import AICertificationStartups from './pages/AICertificationStartups'
import AICertificationCXO from './pages/AICertificationCXO'
import VibeCoding from './pages/VibeCoding'
import ResetPassword from './pages/ResetPassword'
import ZodiacPremiumAI from './pages/ZodiacPremiumAI'
import AdminSessions from './pages/AdminSessions'
import AdminStudents from './pages/AdminStudents'
import AdminSessionLinks from './pages/AdminSessionLinks'
import AdminCertificates from './pages/AdminCertificates'
import Library from './pages/Library'
import AdminLibrary from './pages/AdminLibrary'
import AIReadinessQuiz from './pages/AIReadinessQuiz'
import AICertificateApplication from './pages/AICertificateApplication'
import AISpots from './pages/AISpots'
import AdminAISpotManagement from './pages/AdminAISpotManagement'
import AdminAISpotAnalytics from './pages/AdminAISpotAnalytics'

function App() {
  console.log('App component rendering')
  
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/build-ai-projects" element={<BuildAIProjects />} />
              <Route path="/courses/agentic-ai" element={<Courses />} />
              <Route path="/courses/vibe-coding" element={<VibeCoding />} />
              <Route path="/courses/python-ml-ai" element={<PythonMLAI />} />
              <Route path="/courses/other" element={<Courses />} />
              <Route path="/ai-certification" element={<AICertification />} />
              <Route path="/ai-certification/pharma-fmcg" element={<AICertificationPharmaFMCG />} />
              <Route path="/ai-certification/sales" element={<AICertificationSales />} />
              <Route path="/ai-certification/marketing" element={<AICertificationMarketing />} />
              <Route path="/ai-certification/hr-project" element={<AICertificationHRProject />} />
              <Route path="/ai-certification/startups" element={<AICertificationStartups />} />
              <Route path="/ai-certification/cxo" element={<AICertificationCXO />} />
              <Route path="/masterclass" element={<MasterClass />} />
              <Route path="/find-ai-job" element={<FindAIJob />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-cancelled" element={<PaymentCancelled />} />
              <Route path="/contact-success" element={<ContactSuccess />} />
              <Route path="/zodiac-premium-ai" element={<ZodiacPremiumAI />} />
              <Route path="/admin/sessions" element={<AdminSessions />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              <Route path="/admin/session-links" element={<AdminSessionLinks />} />
              <Route path="/admin/certificates" element={<AdminCertificates />} />
              <Route path="/library" element={<Library />} />
              <Route path="/admin/library" element={<AdminLibrary />} />
              <Route path="/ai-readiness-quiz" element={<AIReadinessQuiz />} />
              <Route path="/ai-certificate-application" element={<AICertificateApplication />} />
              <Route path="/ai-spots" element={<AISpots />} />
              <Route path="/admin/ai-spot-management" element={<AdminAISpotManagement />} />
              <Route path="/admin/ai-spot-analytics" element={<AdminAISpotAnalytics />} />
            </Routes>
          </Layout>
        </Router>
      </AdminAuthProvider>
    </AuthProvider>
  )
}

export default App