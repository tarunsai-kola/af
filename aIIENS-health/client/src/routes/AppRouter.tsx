import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { RootLayout } from '@/layouts/RootLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Spinner } from '@/components/ui/Spinner';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute';

// ── Lazy-load page components ────────────────────────────────────────────────
const HomePage = lazy(() => import('@/pages/HomePage'));
const HealthCheckPage = lazy(() => import('@/pages/HealthCheckPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Blood Donation Hub
const BloodHubPage = lazy(() => import('@/pages/blood/BloodHubPage'));
const BloodRequestsFeedPage = lazy(() => import('@/pages/blood/BloodRequestsFeedPage'));
const BloodRequestDetailsPage = lazy(() => import('@/pages/blood/BloodRequestDetailsPage'));
const DonorDirectoryPage = lazy(() => import('@/pages/blood/DonorDirectoryPage'));
const BecomeDonorPage = lazy(() => import('@/pages/blood/BecomeDonorPage'));
const RaiseBloodRequestPage = lazy(() => import('@/pages/blood/RaiseBloodRequestPage'));

// User Dashboard & Profile
const MyDashboardPage = lazy(() => import('@/pages/MyDashboardPage'));
const FamilyMembersPage = lazy(() => import('@/pages/FamilyMembersPage'));

// Other Public Pages
const CampsPage = lazy(() => import('@/pages/camps/CampsPage'));
const CampDetailsPage = lazy(() => import('@/pages/camps/CampDetailsPage'));
const HostCampPage = lazy(() => import('@/pages/camps/HostCampPage'));

const FundraisersPage = lazy(() => import('@/pages/FundraisersPage'));
const FundraiserDetailsPage = lazy(() => import('@/pages/FundraiserDetailsPage'));
const ImpactPage = lazy(() => import('@/pages/impact/ImpactPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const DonationPolicyPage = lazy(() => import('@/pages/DonationPolicyPage'));
const TransparencyPage = lazy(() => import('@/pages/TransparencyPage'));
const ComingSoonPage = lazy(() => import('@/pages/ComingSoonPage'));

const CreateFundraiserPage = lazy(() => import('@/pages/CreateFundraiserPage')); // Keeping old one just in case, but let's override route

// Wizard
const WizardLayout = lazy(() => import('@/pages/fundraiser-wizard/WizardLayout'));
const PatientStep = lazy(() => import('@/pages/fundraiser-wizard/steps/PatientStep'));
const HospitalStep = lazy(() => import('@/pages/fundraiser-wizard/steps/HospitalStep'));
const TreatmentStep = lazy(() => import('@/pages/fundraiser-wizard/steps/TreatmentStep'));
const FinancialStep = lazy(() => import('@/pages/fundraiser-wizard/steps/FinancialStep'));
const DocumentsStep = lazy(() => import('@/pages/fundraiser-wizard/steps/DocumentsStep'));
const ConsentStep = lazy(() => import('@/pages/fundraiser-wizard/steps/ConsentStep'));
const ReviewStep = lazy(() => import('@/pages/fundraiser-wizard/steps/ReviewStep'));

// Admin
const AdminLayout = lazy(() => import('@/layouts/AdminLayout'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminCasesPage = lazy(() => import('@/pages/admin/AdminCasesPage'));
const AdminCaseDetailsPage = lazy(() => import('@/pages/admin/AdminCaseDetailsPage'));
const AdminBloodRequestsPage = lazy(() => import('@/pages/admin/AdminBloodRequestsPage'));

// Finance Admin
const FinanceDashboardPage = lazy(() => import('@/pages/admin/finance/FinanceDashboardPage'));
const FinanceDonationsPage = lazy(() => import('@/pages/admin/finance/FinanceDonationsPage'));
const FinanceSettlementsPage = lazy(() => import('@/pages/admin/finance/FinanceSettlementsPage'));
const FinanceReconciliationPage = lazy(() => import('@/pages/admin/finance/FinanceReconciliationPage'));

// Admin Camp Pages
const AdminCampsPage = lazy(() => import('@/pages/admin/AdminCampsPage'));

// Admin Impact
const AdminImpactPage = lazy(() => import('@/pages/admin/AdminImpactPage'));

// Admin Audit
const AdminAuditPage = lazy(() => import('@/pages/admin/AdminAuditPage'));

function PageLoader() {
  return (
    <div className="min-h-[70dvh] flex items-center justify-center">
      <Spinner size="xl" />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'health-check',
        element: (
          <Suspense fallback={<PageLoader />}>
            <HealthCheckPage />
          </Suspense>
        ),
      },
      {
        path: 'blood',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BloodHubPage />
          </Suspense>
        ),
      },
      {
        path: 'blood/requests',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BloodRequestsFeedPage />
          </Suspense>
        ),
      },
      {
        path: 'blood/requests/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BloodRequestDetailsPage />
          </Suspense>
        ),
      },
      {
        path: 'blood/donors',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DonorDirectoryPage />
          </Suspense>
        ),
      },
      {
        path: 'blood/become-donor',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <BecomeDonorPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'blood/raise',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <RaiseBloodRequestPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile/family',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <FamilyMembersPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'camps',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CampsPage />
          </Suspense>
        ),
      },
      {
        path: 'camps/host',
        element: (
          <RoleProtectedRoute allowedRoles={['PUBLIC_USER']}>
            <Suspense fallback={<PageLoader />}>
              <HostCampPage />
            </Suspense>
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'camps/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CampDetailsPage />
          </Suspense>
        ),
      },
      {
        path: 'fundraisers',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FundraisersPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <RoleProtectedRoute allowedRoles={['PUBLIC_USER', 'PATIENT_GUARDIAN']}>
            <Suspense fallback={<PageLoader />}>
              <MyDashboardPage />
            </Suspense>
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'fundraisers/create',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <WizardLayout />
            </Suspense>
          </ProtectedRoute>
        ),
        children: [
          // If no ID is passed, the layout will redirect them by creating a draft
          {
            path: ':id/patient',
            element: <PatientStep />
          },
          {
            path: ':id/hospital',
            element: <HospitalStep />
          },
          {
            path: ':id/treatment',
            element: <TreatmentStep />
          },
          {
            path: ':id/financial',
            element: <FinancialStep />
          },
          {
            path: ':id/documents',
            element: <DocumentsStep />
          },
          {
            path: ':id/consent',
            element: <ConsentStep />
          },
          {
            path: ':id/review',
            element: <ReviewStep />
          }
        ]
      },
      // Admin Routes
      {
        path: 'admin',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'cases', element: <AdminCasesPage /> },
          { path: 'cases/:id', element: <AdminCaseDetailsPage /> },
          { path: 'camps', element: <AdminCampsPage /> },
          { path: 'blood-requests', element: <AdminBloodRequestsPage /> },
          { path: 'impact', element: <AdminImpactPage /> },
          { path: 'audit', element: <AdminAuditPage /> },
          // Placeholders for future admin pages
          { path: 'campaigns', element: <div className="p-8">Campaigns Dashboard (Coming Soon)</div> },
          { path: 'hospitals', element: <div className="p-8">Hospital Verification (Coming Soon)</div> },
          { path: 'fraud', element: <div className="p-8">Fraud & Integrity (Coming Soon)</div> },
          { path: 'users', element: <div className="p-8">User Management (Coming Soon)</div> },
          
          // Finance Module Routes
          { path: 'finance', element: <FinanceDashboardPage /> },
          { path: 'finance/donations', element: <FinanceDonationsPage /> },
          { path: 'finance/settlements', element: <FinanceSettlementsPage /> },
          { path: 'finance/reconciliation', element: <FinanceReconciliationPage /> },
        ]
      },
      {
        path: 'fundraisers/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FundraiserDetailsPage />
          </Suspense>
        ),
      },
      {
        path: 'impact',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ImpactPage />
          </Suspense>
        ),
      },
      {
        path: 'transparency',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TransparencyPage />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContactPage />
          </Suspense>
        ),
      },
      {
        path: 'privacy',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PrivacyPage />
          </Suspense>
        ),
      },
      {
        path: 'terms',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TermsPage />
          </Suspense>
        ),
      },
      {
        path: 'donation-policy',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DonationPolicyPage />
          </Suspense>
        ),
      },
      {
        path: 'partner',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ComingSoonPage />
          </Suspense>
        ),
      },
      {
        path: 'volunteer',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ComingSoonPage />
          </Suspense>
        ),
      },
      {
        path: 'assistance',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ComingSoonPage />
          </Suspense>
        ),
      },
      {
        path: 'ngo-network',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ComingSoonPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ForgotPasswordPage />
          </Suspense>
        ),
      },
      {
        path: 'reset-password',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ResetPasswordPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
