import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ChevronDown, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactPage: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [subject, setSubject] = useState('Property Acquisition');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !emailAddress || !message) return;
    
    // Simulate submission
    setFormSubmitted(true);
    setFullName('');
    setEmailAddress('');
    setMessage('');
    setSubject('Property Acquisition');
    
    // Reset submission notification after 6 seconds
    setTimeout(() => {
      setFormSubmitted(false);
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0b1326] transition-colors duration-300 py-16">
      <div className="max-w-container-max mx-auto px-gutter mt-8">
        
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl text-slate-850 dark:text-slate-100 tracking-tight leading-tight"
            style={{ fontFamily: "'Bodoni Moda', Georgia, serif" }}
          >
            Get in Touch with Our Concierge Team
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Whether you're looking to acquire a premium estate or have questions about our managed listings, our dedicated advisors are here to assist you.
          </p>
        </div>

        {/* Content Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#060e20] border border-slate-100 dark:border-slate-800/80 p-8 md:p-10 rounded-2xl shadow-sm space-y-6">
            <AnimatePresence mode="wait">
              {formSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 p-8 rounded-xl flex flex-col items-center text-center gap-4 py-12"
                >
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-green-800 dark:text-green-200 text-lg">Inquiry Received</h3>
                    <p className="text-sm text-green-700/80 dark:text-green-400/80 max-w-md">
                      Thank you for contacting XYZ Homes. One of our dedicated concierge advisors will review your request and get in touch within the next few hours.
                    </p>
                  </div>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Full Name & Email Address Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-slate-550/10 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-lg px-4 py-3 text-sm text-slate-850 dark:text-slate-150 placeholder:text-slate-450 focus:ring-1 focus:ring-[#004ac6] dark:focus:ring-[#adc6ff] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-slate-550/10 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-lg px-4 py-3 text-sm text-slate-850 dark:text-slate-150 placeholder:text-slate-450 focus:ring-1 focus:ring-[#004ac6] dark:focus:ring-[#adc6ff] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Subject Dropdown */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Subject
                    </label>
                    <div className="relative w-full">
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-slate-550/10 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-lg px-4 py-3 text-sm text-slate-850 dark:text-slate-150 focus:ring-1 focus:ring-[#004ac6] dark:focus:ring-[#adc6ff] focus:border-transparent outline-none transition-all appearance-none cursor-pointer pr-10"
                      >
                        <option className="text-slate-800 dark:text-slate-200" value="Property Acquisition">Property Acquisition</option>
                        <option className="text-slate-800 dark:text-slate-200" value="Rental Inquiry">Rental Inquiry</option>
                        <option className="text-slate-800 dark:text-slate-200" value="Listing Help">Listing Help</option>
                        <option className="text-slate-800 dark:text-slate-200" value="General Support">General Support</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Message Box */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can our advisors help you?"
                      className="w-full bg-slate-550/10 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/80 rounded-lg px-4 py-3 text-sm text-slate-850 dark:text-slate-150 placeholder:text-slate-450 focus:ring-1 focus:ring-[#004ac6] dark:focus:ring-[#adc6ff] focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#004ac6] hover:bg-blue-750 dark:bg-[#2563eb] dark:hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: HQ Contacts & Stylized Map Pin */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Headquarters Card */}
            <div className="bg-white dark:bg-[#060e20] border border-slate-100 dark:border-slate-800/80 p-8 rounded-2xl shadow-sm space-y-6">
              <h3 
                className="font-bold text-2xl text-[#004ac6] dark:text-[#adc6ff]"
                style={{ fontFamily: "'Bodoni Moda', Georgia, serif" }}
              >
                Headquarters
              </h3>
              
              <div className="space-y-4 pt-1">
                {/* Location */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-[#004ac6] dark:text-[#adc6ff] shrink-0 border border-slate-100/50 dark:border-slate-800/50">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <div className="text-sm text-slate-650 dark:text-slate-400 pt-1 leading-relaxed">
                    1284 Skyview Terrace,<br />
                    Beverly Hills, CA 90210
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-[#004ac6] dark:text-[#adc6ff] shrink-0 border border-slate-100/50 dark:border-slate-800/50">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <a 
                    href="tel:+13105550198"
                    className="text-sm text-slate-650 dark:text-slate-400 hover:text-[#004ac6] dark:hover:text-[#adc6ff] transition-colors pt-0.5"
                  >
                    +1 (310) 555-0198
                  </a>
                </div>

                {/* Email */}
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-[#004ac6] dark:text-[#adc6ff] shrink-0 border border-slate-100/50 dark:border-slate-800/50">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <a 
                    href="mailto:concierge@xyzhomes.com"
                    className="text-sm text-slate-655 dark:text-slate-400 hover:text-[#004ac6] dark:hover:text-[#adc6ff] transition-colors pt-0.5"
                  >
                    concierge@xyzhomes.com
                  </a>
                </div>

                {/* Working hours */}
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-[#004ac6] dark:text-[#adc6ff] shrink-0 border border-slate-100/50 dark:border-slate-800/50">
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-sm text-slate-655 dark:text-slate-400 pt-0.5">
                    Mon - Fri: 9:00 AM - 6:00 PM PST
                  </span>
                </div>
              </div>
            </div>

            {/* Stylized Mockup Map Card */}
            <div className="bg-slate-100 dark:bg-[#060e20] rounded-2xl border border-slate-200/60 dark:border-slate-800 flex flex-col items-center justify-center py-8 px-4 shadow-sm relative group overflow-hidden">
              {/* Mobile Phone Mockup */}
              <div className="w-[220px] aspect-[9/16] bg-slate-950 border-[10px] border-slate-800 dark:border-slate-850 rounded-[38px] shadow-2xl relative flex flex-col overflow-hidden ring-1 ring-slate-700/30">
                
                {/* Phone Speaker Notch & Status Bar */}
                <div className="h-7 bg-slate-900 border-b border-slate-800/60 flex justify-between items-center px-4 text-[9px] text-slate-400 font-mono tracking-tighter shrink-0 z-20 select-none relative">
                  <div className="flex items-center gap-1">
                    <span className="text-[7px]">←</span>
                    <span className="font-semibold text-slate-300">12:30</span>
                  </div>
                  {/* Speaker Notch */}
                  <div className="w-12 h-3 bg-slate-950 rounded-full absolute left-1/2 -translate-x-1/2 top-1.5 border border-slate-800/40"></div>
                  <div className="flex items-center gap-1">
                    <span>📶</span>
                    <span>🔋</span>
                  </div>
                </div>

                {/* Map Screen content */}
                <div className="flex-grow relative overflow-hidden bg-[#060e20]">
                  {/* Map SVG Grid Background */}
                  <div className="absolute inset-0 z-0 opacity-60">
                    <svg className="w-full h-full text-slate-700 bg-[#060e20]" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                      <defs>
                        <pattern id="grid-map" width="30" height="30" patternUnits="userSpaceOnUse">
                          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid-map)" />
                      {/* Diagonal Streets */}
                      <path d="M-50 150 L300 -50 M0 300 L300 50 M-20 50 L200 280" fill="none" stroke="currentColor" strokeWidth="3" className="opacity-30" />
                      <path d="M60 -30 L60 400 M180 -30 L180 400 M120 -30 L120 400" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-30" />
                      {/* Styled shoreline representing water */}
                      <path d="M 0 180 Q 90 170 170 200 T 300 180 L 300 350 L 0 350 Z" fill="currentColor" className="text-slate-800/40" />
                    </svg>
                  </div>

                  {/* Overlaid Pin Callout */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-2 w-full">
                    {/* Pin Icon in dark circle */}
                    <div className="w-10 h-10 bg-slate-900/90 text-white rounded-full flex items-center justify-center shadow-lg border border-slate-700 hover:scale-105 transition-transform duration-300">
                      <MapPin className="h-5 w-5 text-red-500 fill-current" />
                    </div>
                    {/* White Pill Banner (Always white background matching mockup) */}
                    <div className="bg-white text-slate-850 text-[9px] font-extrabold tracking-wider px-3 py-1.5 rounded-lg shadow-xl uppercase border border-slate-200/50 flex items-center gap-1.5 justify-center select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      XYZ Homes HQ
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactPage;
