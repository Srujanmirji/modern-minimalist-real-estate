import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AnimatePage from './components/AnimatePage';

// Pages
import LandingPage from './pages/LandingPage';
import ListingsPage from './pages/ListingsPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import BookingInquiryPage from './pages/BookingInquiryPage';
import MapSearchPage from './pages/MapSearchPage';
import ComparisonPage from './pages/ComparisonPage';
import DashboardHub from './pages/DashboardHub';
import LoginPage from './pages/LoginPage';
import InfoPage from './pages/InfoPage';
import ContactPage from './pages/ContactPage';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop />
        <ThemeProvider>
          <AuthProvider>
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<AnimatePage><LandingPage /></AnimatePage>} />
                <Route path="/properties" element={<AnimatePage><ListingsPage /></AnimatePage>} />
                <Route path="/properties/:id" element={<AnimatePage><PropertyDetailsPage /></AnimatePage>} />
                <Route path="/map-search" element={<AnimatePage><MapSearchPage /></AnimatePage>} />
                <Route path="/compare" element={<AnimatePage><ComparisonPage /></AnimatePage>} />
                
                {/* Authentication */}
                <Route path="/login" element={<AnimatePage><LoginPage /></AnimatePage>} />
                
                {/* Contact Page */}
                <Route path="/contact-us" element={<AnimatePage><ContactPage /></AnimatePage>} />
                
                {/* Informational Dynamic Pages */}
                <Route path="/info/:slug" element={<AnimatePage><InfoPage /></AnimatePage>} />
                
                {/* Protected Dashboard Hub (Lock to ADMIN and AGENT only) */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'AGENT']}>
                      <AnimatePage>
                        <DashboardHub />
                      </AnimatePage>
                    </ProtectedRoute>
                  }
                />
                
                {/* Tour Appointment Booking (Public for all guest users) */}
                <Route
                  path="/booking/:id"
                  element={
                    <AnimatePage>
                      <BookingInquiryPage />
                    </AnimatePage>
                  }
                />
                
                {/* Catch-all Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </Provider>
  );
};

export default App;
