import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Check, 
  HelpCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Building, 
  Home, 
  BookOpen, 
  TrendingUp, 
  Info, 
  ChevronRight, 
  ArrowRight, 
  DollarSign, 
  Clock, 
  User,
  CheckCircle
} from 'lucide-react';

const InfoPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setFormSubmitted(true);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  const renderContent = () => {
    switch (slug) {
      case 'about-us':
        return (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold text-[#004ac6] dark:text-[#adc6ff] uppercase tracking-widest">Our Vision</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Redefining Premium Property Management</h2>
              <p className="text-slate-500 dark:text-slate-400">XYZ Homes was founded with a clear value proposition: to bring transparency, luxury, and premium minimalist design to the real estate discovery process.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
              {[
                { title: 'Transparency First', desc: 'No hidden listing parameters, direct compliance checks, and clear agent credentials.', icon: ShieldCheck },
                { title: 'Premium Curation', desc: 'Every house, apartment, or commercial listing is filtered for exceptional architectural quality.', icon: Building },
                { title: 'Effortless Search', desc: 'Integrated geographical map-based queries, smart bento grid filters, and sticky inquiries.', icon: Home },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-white dark:bg-[#060e20] p-8 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-4">
                    <div className="w-12 h-12 rounded-full bg-[#eeefff] dark:bg-blue-950/40 flex items-center justify-center text-[#004ac6] dark:text-[#adc6ff]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="bg-[#eeefff]/30 dark:bg-blue-950/10 border border-blue-100/30 dark:border-blue-900/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
              <div className="space-y-4 flex-1">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">The Minimalist Real Estate Philosophy</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">We believe a home is more than just square footage. It is a sanctuary designed for focus, relaxation, and inspiration. Our team partners with architects and custom builders to showcase properties that prioritize clean lines, rich natural light, and spacious visual aesthetics.</p>
                <div className="flex gap-6 pt-2">
                  <div>
                    <h4 className="text-2xl font-bold text-[#004ac6] dark:text-[#adc6ff]">20K+</h4>
                    <span className="text-xs text-slate-400">Curated Listings</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-[#004ac6] dark:text-[#adc6ff]">98%</h4>
                    <span className="text-xs text-slate-400">Satisfied Clients</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full h-64 rounded-xl overflow-hidden shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600" 
                  alt="Modern Home" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold text-[#004ac6] dark:text-[#adc6ff] uppercase tracking-widest">Subscription Tiers</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Simple, Transparent Pricing</h2>
              <p className="text-slate-500 dark:text-slate-400">Choose the listing package that fits your real estate portfolio. No hidden commissions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
              {[
                { title: 'Starter', price: '$0', desc: 'For independent property owners looking to list a single residential space.', features: ['Up to 3 Active Listings', 'Standard Placement', 'Basic Inquiry Messaging', 'Email Support'], buttonText: 'Get Started', highlight: false },
                { title: 'Pro Agent', price: '$49', desc: 'For professional real estate agents managing multiple active properties.', features: ['Up to 15 Active Listings', 'Featured Showcase Badge', 'Priority Client Routing', 'Advanced Search Analytics', 'Virtual Tour Upload Support', 'Email & Chat Support'], buttonText: 'Start Free Trial', highlight: true },
                { title: 'Brokerage', price: '$149', desc: 'For real estate agencies and firms with extensive residential portfolios.', features: ['Unlimited Property Listings', 'Dedicated Platform Manager', 'Custom API Listing Sync', 'Verified Office Badge', 'Premium Ad Promotion Credits', '24/7 Telephone Support'], buttonText: 'Contact Sales', highlight: false },
              ].map((tier, idx) => (
                <div 
                  key={idx} 
                  className={`bg-white dark:bg-[#060e20] p-8 rounded-2xl border transition-all duration-300 relative ${
                    tier.highlight 
                      ? 'border-[#004ac6] dark:border-[#adc6ff] shadow-md ring-1 ring-[#004ac6] dark:ring-[#adc6ff]' 
                      : 'border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md'
                  }`}
                >
                  {tier.highlight && (
                    <span className="absolute top-0 right-8 -translate-y-1/2 bg-[#004ac6] dark:bg-primary text-white dark:text-on-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-slate-850 dark:text-slate-100">{tier.title}</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{tier.desc}</p>
                    <div className="flex items-baseline gap-1 py-2 border-b border-slate-50 dark:border-slate-850">
                      <span className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">{tier.price}</span>
                      <span className="text-xs text-slate-400 font-medium">/ month</span>
                    </div>
                    <ul className="space-y-3 pt-4">
                      {tier.features.map((feat) => (
                        <li key={feat} className="flex gap-3 items-center text-sm text-slate-600 dark:text-slate-400">
                          <Check className="h-4 w-4 text-[#004ac6] dark:text-[#adc6ff] shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => alert(`Redirecting to checkout for ${tier.title} tier.`)}
                      className={`w-full py-3 rounded-lg text-sm font-bold transition-all active:scale-95 text-center mt-6 ${
                        tier.highlight 
                          ? 'bg-[#004ac6] hover:bg-blue-750 text-white shadow-sm' 
                          : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900'
                      }`}
                    >
                      {tier.buttonText}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact-us':
        return (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold text-[#004ac6] dark:text-[#adc6ff] uppercase tracking-widest">Connect With Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Get in Touch</h2>
              <p className="text-slate-500 dark:text-slate-400">Have questions about listings or premium accounts? Our team is here to assist.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-6">
              {/* Contact Form card */}
              <div className="lg:col-span-7 bg-white dark:bg-[#060e20] border border-slate-100 dark:border-slate-800/80 p-8 rounded-2xl shadow-sm space-y-6">
                <h3 className="font-bold text-lg text-slate-850 dark:text-slate-100">Send us a Message</h3>
                {formSubmitted ? (
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 p-6 rounded-xl flex gap-4 items-center">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 shrink-0" />
                    <div>
                      <h4 className="font-bold text-green-800 dark:text-green-200 text-sm">Message Sent Successfully!</h4>
                      <p className="text-xs text-green-650 dark:text-green-400 mt-1">Our support managers will respond to your email within 24 hours.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Your Name</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-850 dark:text-slate-150 focus:ring-1 focus:ring-[#004ac6] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Email Address</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="w-full bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-850 dark:text-slate-150 focus:ring-1 focus:ring-[#004ac6] outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Message</label>
                      <textarea
                        rows={4}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Detail your request or listing inquiry here..."
                        className="w-full bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-850 dark:text-slate-150 focus:ring-1 focus:ring-[#004ac6] outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-[#004ac6] hover:bg-blue-750 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all active:scale-95 shadow-sm"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>

              {/* Office Details sidebar */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white dark:bg-[#060e20] border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider">Corporate Office</h3>
                  <div className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="h-5 w-5 text-[#004ac6] dark:text-[#adc6ff] shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-850 dark:text-slate-200">XYZ Homes Headquarters</p>
                      <p className="text-xs text-slate-400 mt-1">100 Pine Street, Floor 32</p>
                      <p className="text-xs text-slate-400">Seattle, WA 98101</p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-50 dark:border-slate-850 pt-4">
                    <Phone className="h-5 w-5 text-[#004ac6] dark:text-[#adc6ff] shrink-0" />
                    <span className="text-xs">+1 (800) 555-0199</span>
                  </div>
                  <div className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-50 dark:border-slate-850 pt-4">
                    <Mail className="h-5 w-5 text-[#004ac6] dark:text-[#adc6ff] shrink-0" />
                    <span className="text-xs">support@xyzhomes.com</span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-[#131b2e] border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-sm flex gap-4">
                  <HelpCircle className="h-6 w-6 text-[#004ac6] dark:text-[#adc6ff] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Help Center Portal</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">Search through our exhaustive listing guides and legal protocols inside our online database.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'careers':
        return (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold text-[#004ac6] dark:text-[#adc6ff] uppercase tracking-widest">Join Our Team</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Build the Future of Property Discovery</h2>
              <p className="text-slate-500 dark:text-slate-400">At XYZ Homes, we are merging premium design systems with geographical data engineering to reshape the real estate experience.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
              {[
                { title: 'Senior Frontend Engineer', dept: 'Tech / Product', loc: 'Seattle / Remote', desc: 'Lead visual alignment efforts across listings search, bento grid structures, and React optimization blocks.' },
                { title: 'Portfolio Listing Specialist', dept: 'Operations', loc: 'Beverly Hills, CA', desc: 'Partner with real estate managers to curate and inspect high-end villas and luxury architectural estates.' },
                { title: 'Client Relationship Lead', dept: 'Support', loc: 'Seattle, WA', desc: 'Direct tour scheduling pipelines and provide proactive legal/loan compliance support.' },
              ].map((role, idx) => (
                <div key={idx} className="bg-white dark:bg-[#060e20] p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 bg-[#eeefff] dark:bg-blue-950/40 text-[#004ac6] dark:text-[#adc6ff] text-[10px] font-bold uppercase rounded">
                        {role.dept}
                      </span>
                      <span className="text-[11px] text-slate-450 dark:text-slate-500 font-semibold">{role.loc}</span>
                    </div>
                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">{role.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{role.desc}</p>
                  </div>
                  <button 
                    onClick={() => alert(`Opening application sheet for ${role.title}.`)}
                    className="w-full py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-[#004ac6] dark:hover:bg-primary hover:text-white dark:hover:text-on-primary text-slate-600 dark:text-slate-350 rounded-lg text-xs font-bold transition-all active:scale-95 text-center flex items-center justify-center gap-1"
                  >
                    Apply Now <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'how-it-works':
        return (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold text-[#004ac6] dark:text-[#adc6ff] uppercase tracking-widest">Platform Walkthrough</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Simple Three-Step Real Estate</h2>
              <p className="text-slate-500 dark:text-slate-400">Discover how XYZ Homes simplifies property discovery and listings management for everyone.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
              {[
                { step: '01', title: 'Curate & Search', desc: 'Browse through our premium categories (Villas, Apartments, Commercial) or search on our geographical map. Apply smart bento filters for pricing and key amenities.' },
                { step: '02', title: 'Schedule Tours', desc: 'Connect with a certified listing manager by requesting a virtual or physical tour directly. Check agent ratings and compliance tags instantly.' },
                { step: '03', title: 'Close with Trust', desc: 'Access our mortgage loan guides and legal templates to secure property deeds. Every closing is supported by platform compliance checks.' },
              ].map((step, idx) => (
                <div key={idx} className="bg-white dark:bg-[#060e20] p-8 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-4 relative overflow-hidden">
                  <span className="absolute right-6 top-4 font-headline-xl text-6xl text-slate-100 dark:text-slate-900/60 font-black tracking-tighter select-none pointer-events-none">
                    {step.step}
                  </span>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 pt-4">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'home-loan-guide':
        return (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold text-[#004ac6] dark:text-[#adc6ff] uppercase tracking-widest">Financing Resource</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Home Loan & Mortgage Guide</h2>
              <p className="text-slate-500 dark:text-slate-400">Everything you need to know about securing financing and mortgage terms in 2026.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
              <div className="lg:col-span-8 bg-white dark:bg-[#060e20] border border-slate-100 dark:border-slate-800/80 p-8 rounded-2xl shadow-sm space-y-6">
                <h3 className="font-bold text-lg text-slate-850 dark:text-slate-100">Mortgage Checklist</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Before applying for a home loan, ensure you have gathered the necessary documents to expedite underwriting:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Recent W-2 forms and tax filings (past 2 years)',
                    'Consolidated bank accounts statements (past 3 months)',
                    'Employment verification letters & paystubs',
                    'Credit score summary reports (preferred >720)',
                    'Identifications (Drivers License or Passport)',
                    'Asset verification logs (stocks/savings certificates)',
                  ].map((check, idx) => (
                    <div key={idx} className="flex gap-3 items-center text-sm text-slate-600 dark:text-slate-400">
                      <Check className="h-4 w-4 text-[#004ac6] dark:text-[#adc6ff] shrink-0" />
                      <span>{check}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-slate-50 dark:bg-[#131b2e] p-6 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-4">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider">Interest Rate Trends</h3>
                <p className="text-xs text-slate-450 dark:text-slate-500 leading-relaxed">Average 30-year fixed rates are hovering around 5.8% for premium buyers. We recommend locking rates early during property inspections.</p>
                <div className="space-y-2 pt-2 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-400">30-Yr Fixed Rate</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">5.82%</span>
                  </div>
                  <div className="flex justify-between font-medium border-t border-slate-200/50 dark:border-slate-800/50 pt-2">
                    <span className="text-slate-400">15-Yr Fixed Rate</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">5.15%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'legal-guide':
        return (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold text-[#004ac6] dark:text-[#adc6ff] uppercase tracking-widest">Compliance Protocol</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Real Estate Legal Compliance Guide</h2>
              <p className="text-slate-500 dark:text-slate-400">Essential legal steps to verify deed titles, register properties, and check local real estate regulations.</p>
            </div>

            <div className="bg-white dark:bg-[#060e20] border border-slate-100 dark:border-slate-800/80 p-8 rounded-2xl shadow-sm space-y-6">
              <h3 className="font-bold text-lg text-slate-850 dark:text-slate-100">Key Legal Stages</h3>
              
              <div className="space-y-6">
                {[
                  { title: 'Deed Title Search', desc: 'Always perform a comprehensive deed query to confirm there are no outstanding liens, tax claims, or ownership disputes affecting the listing. Our platform flags verified titles with a Shield Badge.' },
                  { title: 'Purchase Agreement Review', desc: 'Draw up a clear Purchase & Sale Agreement detailing downpayment escrows, inspection contingencies, and final close deadlines. Do not skip home appraisals.' },
                  { title: 'County Closing & Registry', desc: 'Once funds are transferred, submit the signed deeds to local county administrators for property registration. This locks ownership status legally.' },
                ].map((stage, idx) => (
                  <div key={idx} className="flex gap-4 items-start border-l-2 border-slate-100 dark:border-slate-850 pl-5">
                    <div>
                      <h4 className="font-bold text-base text-slate-800 dark:text-slate-100">{stage.title}</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">{stage.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold text-[#004ac6] dark:text-[#adc6ff] uppercase tracking-widest">Platform Articles</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">XYZ Homes Blog</h2>
              <p className="text-slate-500 dark:text-slate-400">Discover architectural guidelines, design ideas, and property investment insights.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
              {[
                { title: 'Minimalist Architecture in 2026', read: '5 min read', desc: 'Exploring structural trends, raw materials, and the use of natural light in high-end luxury residences.', img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=300' },
                { title: 'Property Negotiation Strategies', read: '7 min read', desc: 'A guide for home buyers on how to approach initial bids and closing costs in high-demand markets.', img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300' },
                { title: 'How Map Search Speeds Discovery', read: '4 min read', desc: 'Understanding geographic listing aggregations and search filtering optimizations for land buyers.', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300' },
              ].map((post, idx) => (
                <div key={idx} className="bg-white dark:bg-[#060e20] rounded-2xl border border-slate-100 dark:border-slate-800/80 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="h-44 overflow-hidden relative">
                    <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
                    <span className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 px-2 py-0.5 rounded text-[10px] font-bold text-[#004ac6] dark:text-[#adc6ff]">
                      {post.read}
                    </span>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">{post.title}</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">{post.desc}</p>
                    <button 
                      onClick={() => alert(`Opening full article: "${post.title}".`)}
                      className="text-xs font-bold text-[#004ac6] dark:text-[#adc6ff] hover:underline flex items-center gap-1 pt-2"
                    >
                      Read Article <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'market-trends':
        return (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold text-[#004ac6] dark:text-[#adc6ff] uppercase tracking-widest">Market Insights</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Housing Market Analysis 2026</h2>
              <p className="text-slate-500 dark:text-slate-400">Track structural changes, pricing statistics, and housing supply levels in top regions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
              {[
                { title: 'Average Housing Price', val: '+5.4%', trend: 'Upwards', desc: 'Home values continue a stable appreciation pattern driven by limited inventory in high-density areas.' },
                { title: 'Available Inventory', val: '-12%', trend: 'Declining', desc: 'Active properties for sale have dipped since Q4, leading to competitive bidding on premium villas.' },
                { title: 'Loan Approval Speed', val: '14 Days', trend: 'Average', desc: 'Modern automated underwriting continues to expedite pre-approvals for verified credit profiles.' },
              ].map((trend, idx) => (
                <div key={idx} className="bg-white dark:bg-[#060e20] p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-3">
                  <h3 className="font-bold text-sm text-slate-400 dark:text-slate-500 uppercase tracking-wider">{trend.title}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-[#004ac6] dark:text-[#adc6ff]">{trend.val}</span>
                    <span className="text-xs text-green-650 dark:text-green-400 font-bold uppercase tracking-wider">{trend.trend}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-50 dark:border-slate-850">{trend.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'property-tips':
        return (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold text-[#004ac6] dark:text-[#adc6ff] uppercase tracking-widest">Buyer Advice</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Buying & Renting Checklist</h2>
              <p className="text-slate-500 dark:text-slate-400">Pro tips on negotiating properties, identifying visual defects, and selecting neighborhoods.</p>
            </div>

            <div className="bg-white dark:bg-[#060e20] border border-slate-100 dark:border-slate-800/80 p-8 rounded-2xl shadow-sm space-y-6">
              <h3 className="font-bold text-lg text-slate-850 dark:text-slate-100">Inspection Checkpoints</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">When doing physical site walkthroughs, always verify these crucial checkpoints:</p>

              <div className="space-y-4">
                {[
                  { title: 'Foundation Integrity', desc: 'Check basement walls and structural joints for horizontal hairline cracks or damp smells indicating water seepage.' },
                  { title: 'Electrical & Plumbing Capacity', desc: 'Verify the primary amp ratings, test outlets, and run water lines to check water pressure and water heater integrity.' },
                  { title: 'Neighborhood Transit & Noise', desc: 'Visit the property at different hours (e.g., commute hours and weekends) to understand traffic patterns and noise levels.' },
                ].map((tip, idx) => (
                  <div key={idx} className="flex gap-4 items-start pl-4 border-l-2 border-[#004ac6] dark:border-[#adc6ff]">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{tip.title}</h4>
                      <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 leading-relaxed">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'privacy-policy':
      case 'terms-and-conditions':
        return (
          <div className="bg-white dark:bg-[#060e20] border border-slate-100 dark:border-slate-800/80 p-8 md:p-12 rounded-2xl shadow-sm space-y-8 max-w-4xl mx-auto">
            <div className="space-y-2 border-b border-slate-50 dark:border-slate-850 pb-6">
              <span className="text-xs font-bold text-[#004ac6] dark:text-[#adc6ff] uppercase tracking-widest">Platform Agreement</span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 capitalize">
                {slug.replace(/-/g, ' ')}
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">Last updated: June 6, 2026</p>
            </div>

            <div className="space-y-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <p className="font-semibold text-slate-850 dark:text-slate-200">1. Agreement Overview</p>
              <p>Welcome to XYZ Homes. By using our platform, accessing geographical listing filters, or submitting tour inquiries, you agree to comply with our listing protocols, verified credentials policies, and structural verification conditions. If you do not accept these policies, do not use the platform.</p>
              
              <p className="font-semibold text-slate-850 dark:text-slate-200">2. Listings & Data Accuracy</p>
              <p>Property listings, prices, floor plans, and amenities displayed on XYZ Homes are uploaded by platform administrators and verified agents. While we strive to run comprehensive title compliance checks, we advise all buyers to perform independent title searches and professional site inspections.</p>
              
              <p className="font-semibold text-slate-850 dark:text-slate-200">3. Inquiry Submission & Privacy</p>
              <p>When you request a walk-through appointment or input your contact email, we collect your credentials to link you directly with the listing manager. We do not sell user details to third-party ad networks, and all database interactions are protected under platform security escrows.</p>

              <p className="font-semibold text-slate-850 dark:text-slate-200">4. Modifications</p>
              <p>We reserve the right to modify these operational terms at any point. Continued use of XYZ Homes following upgrades implies acceptance of the adjusted legal policies.</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-20 space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Page Not Found</h2>
            <p className="text-slate-500">The page you are looking for does not exist.</p>
            <Link to="/" className="inline-block px-6 py-2.5 bg-[#004ac6] text-white font-bold rounded-lg text-sm transition-all hover:bg-blue-750">
              Back to Home
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] dark:bg-[#0b1326] transition-colors duration-300 py-16">
      <div className="max-w-container-max mx-auto px-gutter">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-8 max-w-4xl mx-auto">
          <Link to="/" className="hover:text-[#004ac6] dark:hover:text-[#adc6ff] transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="capitalize font-semibold text-slate-650 dark:text-slate-350">{slug?.replace(/-/g, ' ')}</span>
        </div>

        {/* Dynamic Section Content */}
        <main className="max-w-5xl mx-auto">
          {renderContent()}
        </main>

      </div>
    </div>
  );
};

export default InfoPage;
