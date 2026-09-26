import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/layout/Layout';
import OnboardingPage from './components/OnboardingPage';

// Lazy loaded pages
const Dashboard = React.lazy(() => import('./pages/DashboardPage'));
const MarketsPage = React.lazy(() => import('./pages/MarketsPage'));
const StockDetailPage = React.lazy(() => import('./pages/StockDetailPage'));
const TradePage = React.lazy(() => import('./pages/TradePage'));
const OrdersPage = React.lazy(() => import('./pages/OrdersPage'));
const PortfolioPage = React.lazy(() => import('./pages/PortfolioPage'));
const WatchlistPage = React.lazy(() => import('./pages/WatchlistPage'));
const LearningPage = React.lazy(() => import('./pages/LearningPage'));
const ChallengesPage = React.lazy(() => import('./pages/ChallengesPage'));
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));

// Placeholder Loading component
const LoadingSpinner = () => (
  <div className="flex h-full items-center justify-center p-8">
    <div className="text-brand-600 animate-spin text-4xl">⟳</div>
  </div>
);

const App: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <OnboardingPage />;
  }

  return (
    <HashRouter>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/markets" element={<MarketsPage />} />
            <Route path="/stock/:symbol" element={<StockDetailPage />} />
            <Route path="/trade" element={<TradePage />} />
            <Route path="/trade/:symbol" element={<TradePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/watchlists" element={<WatchlistPage />} />
            <Route path="/learn" element={<LearningPage />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </HashRouter>
  );
};

export default App;
