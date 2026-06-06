import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  Globe, 
  Share2, 
  Bell,
  Smile,
  Home,
  MapPin,
  Star,
  PhoneCall,
  Mail,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchNotifications } from '../store/slices/notificationsSlice';
import { fetchFavorites } from '../store/slices/favoritesSlice';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const dispatch = useAppDispatch();
  const unreadNotifications = useAppSelector((state) => state.notifications.unreadCount);

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
      
      // Poll notifications every 60s
      const interval = setInterval(() => {
        dispatch(fetchNotifications());
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [user, dispatch]);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch, user]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location]);

  const handleListProperty = () => {
    if (!user) {
      navigate('/login?redirect=create-property');
    } else if (user.role === 'USER') {
      alert('Only registered agents or admin managers can list properties. Please contact support.');
    } else {
      navigate('/dashboard'); // Agents/Admins manage listed properties from dashboard
    }
  };

  // Check if we are in the Map Discovery layout (full-bleed) or Dashboard portal
  const isMapSearch = location.pathname === '/map-search';
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background transition-colors duration-300">
      {/* Navigation Header */}
      {!isDashboard && (
        <header
          className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            scrolled || isMapSearch
              ? 'bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 shadow-sm'
              : 'bg-transparent'
          }`}
        >
        <nav className="flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto h-20">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-display-lg text-headline-lg font-bold text-primary tracking-tighter">
              XYZ Homes
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/properties"
                className={`font-body-md text-body-md transition-colors relative py-1 ${
                  location.pathname === '/' || (location.pathname === '/properties' && !location.search.includes('status=FOR_RENT'))
                    ? 'text-primary border-b-2 border-primary font-bold'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                Buy
              </Link>
              <Link
                to="/properties?status=FOR_RENT"
                className={`font-body-md text-body-md transition-colors relative py-1 ${
                  location.pathname === '/properties' && location.search.includes('status=FOR_RENT')
                    ? 'text-primary border-b-2 border-primary font-bold'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                Rent
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {user && (
              <Link
                to="/dashboard"
                className="relative p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-on-primary animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
              </Link>
            )}
            
            {user && (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border border-outline-variant/30 hover:border-primary transition-colors"
                  />
                </button>
                
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-outline-variant/20">
                      <p className="font-bold text-sm text-on-surface truncate">{user.name}</p>
                      <p className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                        {user.role}
                      </p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error-container/10 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-secondary hover:text-primary"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden bg-surface border-b border-outline-variant/30 px-gutter py-4 space-y-4 overflow-hidden"
            >
              <Link to="/properties" className="block text-body-lg py-2 border-b border-outline-variant/10 text-on-surface">
                Buy
              </Link>
              <Link to="/properties?status=FOR_RENT" className="block text-body-lg py-2 border-b border-outline-variant/10 text-on-surface">
                Rent
              </Link>
              {user && (
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    to="/dashboard"
                    className="text-center font-label-md text-label-md py-3 bg-surface-container-high rounded-lg text-on-surface"
                  >
                    Dashboard ({unreadNotifications} Unread Alerts)
                  </Link>
                  <button
                    onClick={logout}
                    className="text-center font-label-md text-label-md py-3 bg-error-container/10 text-error rounded-lg"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      )}

      {/* Main page content */}
      <main className={`flex-grow ${isDashboard ? 'pt-0' : 'pt-20'}`}>{children}</main>

      {/* Footer */}
      {!isMapSearch && !isDashboard && (
        <footer className="bg-slate-50 dark:bg-[#060e20] border-t border-slate-200 dark:border-slate-800/80 w-full pt-16 pb-8 transition-colors duration-300">
          <div className="max-w-container-max mx-auto px-gutter">
            
            {/* Statistics Section (Modern Card Layout) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {[
                { label: 'Happy Customers', value: '50K+', icon: Smile, color: 'text-green-500' },
                { label: 'Properties Listed', value: '20K+', icon: Home, color: 'text-[#004ac6] dark:text-[#adc6ff]' },
                { label: 'Cities Covered', value: '120+', icon: MapPin, color: 'text-orange-500' },
                { label: 'Customer Rating', value: '4.8/5', icon: Star, color: 'text-amber-500', fillStar: true },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-white dark:bg-[#131b2e] border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-3">
                      <Icon className={`h-5 w-5 ${stat.color}`} {...(stat.fillStar ? { fill: 'currentColor' } : {})} />
                    </div>
                    <span className="font-display text-2xl font-bold text-slate-850 dark:text-slate-100">{stat.value}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">{stat.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Top Grid Area (Brand Column & Navigation & Support Card) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 border-b border-slate-200 dark:border-slate-800">
              
              {/* Brand Info Column */}
              <div className="lg:col-span-3 space-y-5">
                <Link to="/" className="font-display-lg text-2xl font-bold text-[#004ac6] dark:text-[#adc6ff] tracking-tight">
                  XYZ Homes
                </Link>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                  Find your perfect home. Buy, rent or sell properties with confidence.
                </p>
                <div className="flex gap-4 pt-2">
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#004ac6] dark:hover:text-[#adc6ff] hover:border-[#004ac6] dark:hover:border-[#adc6ff] transition-all duration-200"
                  >
                    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3l-.5 3h-2.5v6.8c4.56-.93 8-4.96 8-9.8z"/>
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-label="Instagram"
                    className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#004ac6] dark:hover:text-[#adc6ff] hover:border-[#004ac6] dark:hover:border-[#adc6ff] transition-all duration-200"
                  >
                    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-label="LinkedIn"
                    className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#004ac6] dark:hover:text-[#adc6ff] hover:border-[#004ac6] dark:hover:border-[#adc6ff] transition-all duration-200"
                  >
                    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-label="Twitter (X)"
                    className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#004ac6] dark:hover:text-[#adc6ff] hover:border-[#004ac6] dark:hover:border-[#adc6ff] transition-all duration-200"
                  >
                    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Navigation Columns (5 columns layout) */}
              <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
                {[
                  {
                    title: 'Buy',
                    links: [
                      { name: 'Search Properties', path: '/properties?status=FOR_SALE' },
                      { name: 'Apartments', path: '/properties?status=FOR_SALE&type=Apartment' },
                      { name: 'Villas', path: '/properties?status=FOR_SALE&type=Villa' },
                      { name: 'Plots', path: '/properties?status=FOR_SALE&type=Land' },
                      { name: 'Commercial', path: '/properties?status=FOR_SALE&type=Commercial' },
                    ],
                  },
                  {
                    title: 'Rent',
                    links: [
                      { name: 'Search Rentals', path: '/properties?status=FOR_RENT' },
                      { name: 'Apartments', path: '/properties?status=FOR_RENT&type=Apartment' },
                      { name: 'Independent Houses', path: '/properties?status=FOR_RENT&type=House' },
                      { name: 'PG & Rooms', path: '/properties?status=FOR_RENT&type=House' },
                      { name: 'Commercial', path: '/properties?status=FOR_RENT&type=Commercial' },
                    ],
                  },
                  {
                    title: 'Sell',
                    links: [
                      { name: 'Post Property', path: '/dashboard' },
                      { name: 'My Listings', path: '/dashboard' },
                      { name: 'Pricing', path: '/info/pricing' },
                      { name: 'How It Works', path: '/info/how-it-works' },
                    ],
                  },
                  {
                    title: 'Resources',
                    links: [
                      { name: 'Home Loan Guide', path: '/info/home-loan-guide' },
                      { name: 'Legal Guide', path: '/info/legal-guide' },
                      { name: 'Blog', path: '/info/blog' },
                      { name: 'Market Trends', path: '/info/market-trends' },
                      { name: 'Property Tips', path: '/info/property-tips' },
                    ],
                  },
                  {
                    title: 'Company',
                    links: [
                      { name: 'About Us', path: '/info/about-us' },
                      { name: 'Careers', path: '/info/careers' },
                      { name: 'Contact Us', path: '/contact-us' },
                      { name: 'Privacy Policy', path: '/info/privacy-policy' },
                      { name: 'Terms & Conditions', path: '/info/terms-and-conditions' },
                    ],
                  },
                ].map((col, idx) => (
                  <div key={idx} className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                      {col.title}
                    </h4>
                    <ul className="space-y-2.5">
                      {col.links.map((link) => (
                        <li key={link.name}>
                          <Link
                            to={link.path}
                            className="text-sm text-slate-500 dark:text-slate-400 hover:text-[#004ac6] dark:hover:text-[#adc6ff] transition-colors"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Right Side Support Card */}
              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-[#131b2e] border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-shadow duration-300">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                    Need Help?
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                    Our support team is here to guide you with any platform inquiries.
                  </p>
                  <div className="space-y-3 pt-2">
                    <a
                      href="tel:+18005550199"
                      className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-350 hover:text-[#004ac6] dark:hover:text-[#adc6ff] transition-colors"
                    >
                      <PhoneCall className="h-4.5 w-4.5 text-[#004ac6] dark:text-[#adc6ff]" />
                      <span>+1 (800) 555-0199</span>
                    </a>
                    <a
                      href="mailto:support@xyzhomes.com"
                      className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-350 hover:text-[#004ac6] dark:hover:text-[#adc6ff] transition-colors"
                    >
                      <Mail className="h-4.5 w-4.5 text-[#004ac6] dark:text-[#adc6ff]" />
                      <span>support@xyzhomes.com</span>
                    </a>
                  </div>
                  <button
                    onClick={() => window.open('tel:+18005550199')}
                    className="w-full py-2.5 bg-[#004ac6] hover:bg-blue-750 text-white rounded-lg text-xs font-bold transition-all active:scale-95 text-center flex items-center justify-center gap-2 shadow-sm"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    Call Support
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-8 text-xs text-slate-400 dark:text-slate-500 gap-4">
              <div>
                Copyright © 2026 <span className="font-bold text-[#004ac6] dark:text-[#adc6ff]">XYZ Homes</span>. All rights reserved.
              </div>
              
              <div className="flex flex-wrap items-center gap-6 justify-center md:justify-end">
                <Link to="/info/about-us" className="hover:text-[#004ac6] dark:hover:text-[#adc6ff] transition-colors">Sitemap</Link>
                <Link to="/info/privacy-policy" className="hover:text-[#004ac6] dark:hover:text-[#adc6ff] transition-colors">Privacy Policy</Link>
                <Link to="/info/terms-and-conditions" className="hover:text-[#004ac6] dark:hover:text-[#adc6ff] transition-colors">Terms & Conditions</Link>
                
                {/* Language Selector */}
                <div className="relative flex items-center gap-1.5 cursor-pointer pl-4 border-l border-slate-200 dark:border-slate-800 hover:text-[#004ac6] dark:hover:text-[#adc6ff] transition-colors">
                  <Globe className="h-4 w-4" />
                  <span className="font-medium">English (US)</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>

          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
