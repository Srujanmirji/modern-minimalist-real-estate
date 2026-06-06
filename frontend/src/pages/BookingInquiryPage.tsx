import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Calendar as CalendarIcon, Clock, ChevronLeft, MessageSquare, Phone, BadgeAlert, Bolt, FileText } from 'lucide-react';
import { useAppDispatch } from '../store';
import { createBookingThunk } from '../store/slices/bookingsSlice';
import { motion, AnimatePresence } from 'framer-motion';

const BookingInquiryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const [property, setProperty] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [selectedDay, setSelectedDay] = useState<number | null>(6);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [timeSlot, setTimeSlot] = useState('Afternoon (12:00 PM - 4:00 PM)');
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data.property);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property for booking:', error);
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      // Guest tour booking success simulation
      setBookingSuccess(true);
      return;
    }

    const dateString = `2026-06-${selectedDay?.toString().padStart(2, '0')}`;
    
    dispatch(createBookingThunk({
      propertyId: id || '',
      date: dateString,
      time: timeSlot,
      notes,
    }))
      .unwrap()
      .then(() => {
        setBookingSuccess(true);
      })
      .catch((err) => {
        console.error('Error scheduling tour:', err);
        alert(err || 'Could not schedule tour. Please try again.');
      });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-primary">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <p className="text-on-surface-variant font-body-lg">Property not found.</p>
        <Link to="/properties" className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold">
          Back to Listings
        </Link>
      </div>
    );
  }

  const mainImageUrl = property.images && property.images.length > 0
    ? property.images[0].imageUrl
    : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800';

  return (
    <div className="max-w-container-max mx-auto px-gutter py-8 transition-colors mt-4">
      <AnimatePresence mode="wait">
        {bookingSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="max-w-xl mx-auto text-center py-20 px-6 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl space-y-6 dark:bg-surface-container-low"
          >
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-background font-bold">
              Walkthrough Tour Requested!
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto leading-relaxed">
              Your private walkthrough viewing request for <span className="font-bold text-on-surface">{property.title}</span> has been logged. Our senior representative will contact you shortly to confirm details.
            </p>
            <div className="pt-4 flex gap-4 justify-center">
              {user && (
                <Link
                  to="/dashboard"
                  className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-opacity"
                >
                  Go to Dashboard
                </Link>
              )}
              <Link
                to="/properties"
                className="bg-surface-container-high text-on-surface px-6 py-2.5 rounded-lg font-label-md text-label-md font-bold hover:bg-surface-container-highest transition-colors dark:bg-surface-container-highest dark:text-on-background"
              >
                Continue Browsing
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-margin-desktop mt-stack-lg"
          >
            {/* Left Column: Context property details preview */}
            <div className="lg:col-span-5 flex flex-col gap-stack-lg">
              <div className="space-y-stack-md">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full border border-outline-variant/10 font-semibold text-xs">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Verified Property</span>
                </div>
                <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">
                  {property.title}
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md leading-relaxed">
                  Experience the pinnacle of modern living. Schedule your private walkthrough of this architectural masterpiece in the heart of the hills.
                </p>
              </div>

              <div className="relative rounded-xl overflow-hidden shadow-lg aspect-video group">
                <img
                  src={mainImageUrl}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-stack-md left-stack-md text-white">
                  <p className="text-xs opacity-90 font-medium">Viewing Address</p>
                  <p className="font-headline-md text-headline-md font-bold">{property.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-stack-md">
                <a 
                  href={`mailto:${property.agent?.email || 'agent@xyzhomes.com'}`}
                  className="flex items-center justify-center gap-2 p-stack-md bg-white dark:bg-surface-container-lowest border border-outline-variant/30 rounded-lg shadow-sm hover:shadow-md transition-all active:translate-y-0.5"
                >
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    Message Agent
                  </span>
                </a>
                <a 
                  href="tel:+15550199"
                  className="flex items-center justify-center gap-2 p-stack-md bg-white dark:bg-surface-container-lowest border border-outline-variant/30 rounded-lg shadow-sm hover:shadow-md transition-all active:translate-y-0.5"
                >
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    Call Now
                  </span>
                </a>
              </div>
            </div>

            {/* Right Column: Tour scheduler calendar and inputs */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-surface-container-low rounded-xl shadow-sm border border-outline-variant/30 p-stack-lg sticky top-24">
                <div className="flex items-center justify-between mb-stack-lg border-b border-outline-variant/20 pb-4">
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                    Schedule a Visit
                  </h2>
                  <span className="text-primary font-headline-md text-headline-md font-bold">
                    ${(property.price / 1000000).toFixed(1)}M
                  </span>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-stack-lg">
                  {/* Calendar picker grid */}
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-stack-sm font-semibold">
                      Select Preferred Date (June 2026)
                    </label>
                    <div className="grid grid-cols-7 gap-2 border border-outline-variant/20 p-4 rounded-xl bg-surface-container-low/30">
                      {/* Headers */}
                      {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                        <div key={day} className="text-center font-label-sm text-label-sm text-outline pb-2 font-bold">
                          {day}
                        </div>
                      ))}

                      {/* Preceding blank spaces */}
                      <div className="aspect-square flex items-center justify-center text-outline opacity-30 text-sm">28</div>
                      <div className="aspect-square flex items-center justify-center text-outline opacity-30 text-sm">29</div>
                      <div className="aspect-square flex items-center justify-center text-outline opacity-30 text-sm">30</div>

                      {/* Active Days */}
                      {Array.from({ length: 11 }).map((_, idx) => {
                        const dayNumber = idx + 1;
                        const isSelected = selectedDay === dayNumber;
                        return (
                          <div
                            key={dayNumber}
                            onClick={() => setSelectedDay(dayNumber)}
                            className="relative aspect-square flex items-center justify-center font-body-md text-body-md rounded-md cursor-pointer transition-all select-none"
                          >
                            <span className={`z-10 font-semibold ${isSelected ? 'text-on-primary font-bold' : 'text-on-surface'}`}>
                              {dayNumber}
                            </span>
                            {isSelected && (
                              <motion.div
                                layoutId="selectedCalendarDay"
                                className="absolute inset-0 bg-primary rounded-md shadow-md"
                                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                              />
                            )}
                          </div>
                        );
                      })}
                      <div className="aspect-square flex items-center justify-center text-outline opacity-30 text-sm">12</div>
                      <div className="aspect-square flex items-center justify-center text-outline opacity-30 text-sm">13</div>
                      <div className="aspect-square flex items-center justify-center text-outline opacity-30 text-sm">14</div>
                    </div>
                  </div>

                  {/* Form Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                    <div className="space-y-stack-sm">
                      <label className="block font-label-md text-label-md text-on-surface-variant font-semibold">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-white dark:bg-surface-container border border-outline-variant rounded-lg px-stack-md py-stack-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-background"
                      />
                    </div>
                    <div className="space-y-stack-sm">
                      <label className="block font-label-md text-label-md text-on-surface-variant font-semibold">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-white dark:bg-surface-container border border-outline-variant rounded-lg px-stack-md py-stack-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-stack-sm">
                    <label className="block font-label-md text-label-md text-on-surface-variant font-semibold">
                      Preferred Time Slot
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full bg-white dark:bg-surface-container border border-outline-variant rounded-lg px-stack-md py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-background cursor-pointer"
                    >
                      <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                      <option value="Afternoon (12:00 PM - 4:00 PM)">Afternoon (12:00 PM - 4:00 PM)</option>
                      <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
                    </select>
                  </div>

                  <div className="space-y-stack-sm">
                    <label className="block font-label-md text-label-md text-on-surface-variant font-semibold">
                      Special Inquiries or Requests
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="E.g., details on parking facilities, school districting..."
                      rows={4}
                      className="w-full bg-white dark:bg-surface-container border border-outline-variant rounded-lg px-stack-md py-stack-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-background resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-primary text-on-primary rounded-lg font-headline-md text-headline-md shadow-md hover:opacity-90 active:scale-[0.98] transition-all font-bold"
                  >
                    Confirm Viewing Request
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bento FAQ features banner */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-stack-lg">
        <div className="bg-surface-container-low p-stack-lg rounded-xl border border-outline-variant/20 space-y-2">
          <Bolt className="h-6 w-6 text-primary" />
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
            Instant Approval
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Get a mortgage pre-approval in under 24 hours with our partner lending network.
          </p>
        </div>
        <div className="bg-surface-container-low p-stack-lg rounded-xl border border-outline-variant/20 space-y-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
            Private Tour
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            All viewings are strictly 1-on-1 with a senior property advisor for complete privacy.
          </p>
        </div>
        <div className="bg-surface-container-low p-stack-lg rounded-xl border border-outline-variant/20 space-y-2">
          <FileText className="h-6 w-6 text-primary" />
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
            Transparent History
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Receive a full digital property disclosure package before your scheduled visit.
          </p>
        </div>
      </section>
    </div>
  );
};

export default BookingInquiryPage;
