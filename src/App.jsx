import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell/AppShell';
import ProtectedRoute from './components/layout/ProtectedRoute/ProtectedRoute';
import Spinner from './components/ui/Spinner/Spinner';
import { AuthProvider } from './context/AuthContext';
import { DateRangeProvider } from './context/DateRangeContext';
import { ThemeProvider } from './context/ThemeContext';

// Each page is its own chunk, so the first visit only downloads what it shows.
// Recharts is only imported by Overview, so it stays out of the other pages.
const Login = lazy(() => import('./pages/Login/Login'));
const Overview = lazy(() => import('./pages/Overview/Overview'));
const Orders = lazy(() => import('./pages/Orders/Orders'));
const Customers = lazy(() => import('./pages/Customers/Customers'));
const Settings = lazy(() => import('./pages/Settings/Settings'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

function FullPageSpinner() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', color: 'var(--text-3)' }}>
      <Spinner label="Loading" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DateRangeProvider>
          <BrowserRouter>
            <Suspense fallback={<FullPageSpinner />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppShell />}>
                    <Route index element={<Overview />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </DateRangeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
