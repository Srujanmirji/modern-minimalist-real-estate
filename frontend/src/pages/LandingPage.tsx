import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { Search, MapPin, Home, DollarSign, Star, ChevronRight, ShieldCheck, TrendingUp, Building, Building2, Briefcase, ChevronDown } from 'lucide-react';
import { useAppDispatch } from '../store';
import { setUrlFilters } from '../store/slices/propertiesSlice';
import type { Property } from '../store/slices/propertiesSlice';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any } }
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [displayProperties, setDisplayProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('Property Type');
  const [maxPrice, setMaxPrice] = useState('');

  // Custom dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const response = await api.get('/properties');
        const allProps = response.data.properties as Property[];
        
        // Target specific mockup properties
        const targetTitles = ['azure heights', 'oasis villa', 'willow creek'];
        const filtered = allProps.filter(p => 
          targetTitles.some(title => p.title.toLowerCase().includes(title))
        );
        
        // Exact order sorting: Azure Heights, The Oasis Villa, Willow Creek
        const sorted: Property[] = [];
        const azure = filtered.find(p => p.title.toLowerCase().includes('azure heights'));
        const oasis = filtered.find(p => p.title.toLowerCase().includes('oasis villa'));
        const willow = filtered.find(p => p.title.toLowerCase().includes('willow creek'));
        
        if (azure) sorted.push(azure);
        if (oasis) sorted.push(oasis);
        if (willow) sorted.push(willow);
        
        // Fallback to fill up to 3 cards if something is missing
        allProps.forEach(p => {
          if (sorted.length < 3 && !sorted.some(s => s.id === p.id)) {
            sorted.push(p);
          }
        });

        setDisplayProperties(sorted.slice(0, 3));
      } catch (error) {
        console.error('Error loading homepage properties:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProperties();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchLocation) query.append('search', searchLocation);
    if (searchType && searchType !== 'Property Type') query.append('type', searchType);
    if (maxPrice) query.append('maxPrice', maxPrice);

    dispatch(
      setUrlFilters({
        search: searchLocation,
        selectedTypes: searchType !== 'Property Type' ? [searchType] : [],
        maxPrice: maxPrice,
      })
    );

    navigate(`/properties?${query.toString()}`);
  };

  return (
    <div className="space-y-0 transition-colors overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[800px] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover brightness-[95%] dark:brightness-[50%]"
            alt="XYZ Homes Masterpiece"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5AZjY7thVj3gZVgr5W2XVTnxS1uRqLhLlQF4QUkSoRtKORpcfRFPLLsPckYD7EFqpioZ9g55t-p5wywXqQ6QKT9PqlMcXHB6s5bIzebBnVLJeFZq9TNzHQxD0t_nIXEV3fl7KW1kdwwMfa5O043yyGvYj_IRVLgg8Ni3ox9zk_FC2SnCeiaqAVhOp4E3b0STJkQXlR8B8t277hw4UYchG-GFs6fPSO-KLQZtdIfAOUZ-VClAtUB7sPxDzs2CA2CpvT6U846Tmyq0"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-background/10 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-container-max mx-auto px-gutter w-full mt-12">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl text-left"
          >
            <h1 className="font-headline-xl text-headline-xl mb-stack-md text-on-background">
              Find the Perfect Place to Call Home
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg leading-relaxed">
              Discover curated listings of exceptional residences, from minimalist urban lofts to sprawling coastal villas.
            </p>

            {/* Advanced Search Form bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-2 rounded-2xl md:rounded-full shadow-2xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row items-stretch md:items-center gap-2 max-w-4xl w-full pointer-events-auto mt-6"
            >
              <div className="flex-[1.1] min-w-[130px] px-4 py-3 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <MapPin className="text-slate-400 h-5 w-5 shrink-0" />
                <input
                  type="text"
                  placeholder="Location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 focus:border-transparent font-body-md text-body-md text-slate-800 dark:text-slate-100 placeholder:text-slate-400 p-0 outline-none focus:outline-none"
                />
              </div>
              <div ref={dropdownRef} className="flex-[1.3] min-w-[170px] px-4 py-3 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex items-center gap-2 relative">
                <Home className="text-slate-400 h-5 w-5 shrink-0" />
                <div className="relative w-full flex items-center font-body-md text-body-md">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full text-left bg-transparent border-none text-slate-850 dark:text-slate-100 p-0 cursor-pointer flex items-center justify-between outline-none pr-4 font-medium transition-colors hover:text-[#004ac6] dark:hover:text-[#adc6ff]"
                  >
                    <span>{searchType}</span>
                    <ChevronDown className={`text-slate-400 h-4 w-4 transition-transform duration-200 shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.12, ease: 'easeOut' }}
                        className="absolute top-full left-0 mt-5 w-full min-w-[185px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-50 overflow-hidden"
                      >
                        {[
                          'Property Type',
                          'Apartment',
                          'Villa',
                          'House',
                          'Commercial'
                        ].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setSearchType(option);
                              setDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors block ${
                              searchType === option
                                ? 'bg-primary/10 text-primary font-bold dark:bg-primary/20 dark:text-[#adc6ff]'
                                : 'text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-[#004ac6] dark:hover:text-[#adc6ff]'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="flex-[1.1] min-w-[135px] px-4 py-3 flex items-center gap-2">
                <DollarSign className="text-slate-400 h-5 w-5 shrink-0" />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 focus:border-transparent font-body-md text-body-md text-slate-800 dark:text-slate-100 placeholder:text-slate-400 p-0 outline-none focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-[#004ac6] dark:bg-primary text-white dark:text-on-primary px-8 py-3.5 rounded-xl md:rounded-full font-label-md text-label-md font-bold transition-all hover:bg-blue-700 dark:hover:bg-blue-300 active:scale-95 whitespace-nowrap flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Categories Bento row */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="py-stack-lg bg-surface transition-colors border-b border-outline-variant/10"
      >
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex flex-wrap justify-center gap-stack-md md:gap-stack-lg">
            {[
              { label: 'Apartment', icon: Building, val: 'Apartment' },
              { label: 'Villa', icon: Home, val: 'Villa' },
              { label: 'House', icon: Home, val: 'House' },
              { label: 'Commercial', icon: Building2, val: 'Commercial' },
            ].map((cat) => (
              <Link
                key={cat.label}
                to={`/properties?type=${cat.val}`}
                className="group flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-full bg-[#eeefff] dark:bg-blue-950/40 flex items-center justify-center text-[#004ac6] dark:text-[#adc6ff] group-hover:bg-[#004ac6] dark:group-hover:bg-primary group-hover:text-white dark:group-hover:text-on-primary transition-all duration-300 shadow-sm border border-blue-100/50 dark:border-slate-800/50 hover:scale-105">
                  <cat.icon className="h-6 w-6" />
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Properties grid */}
      <motion.section 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={containerVariants}
        className="py-stack-lg bg-background transition-colors"
      >
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex justify-between items-end mb-stack-lg">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-background font-bold tracking-tight">
                Featured Properties
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Handpicked residences of exceptional quality.
              </p>
            </div>
            <Link
              to="/properties"
              className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline font-bold"
            >
              View All Listings <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse bg-surface-container-low h-[400px] rounded-lg"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayProperties.map((p) => (
                <motion.div key={p.id} variants={itemVariants}>
                  <PropertyCard property={p} showFavoriteButton={false} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <section className="py-stack-lg bg-surface-container-lowest transition-colors border-t border-b border-outline-variant/10">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <h2 className="font-headline-lg text-headline-lg text-on-background font-bold tracking-tight">
                Why Choose XYZ Homes
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                We redefine the real estate experience through transparency, cutting-edge technology, and a dedication to finding your ideal living space.
              </p>

              <div className="space-y-6 pt-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary border border-primary/20">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-on-background text-[18px] font-bold">
                      Verified Listings
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1 leading-relaxed">
                      Every property on our platform undergoes a rigorous vetting process for your peace of mind.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary border border-primary/20">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-on-background text-[18px] font-bold">
                      Expert Guidance
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1 leading-relaxed">
                      Our team of experienced agents provides personalized support from search to settlement.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary border border-primary/20">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-on-background text-[18px] font-bold">
                      Market Insights
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1 leading-relaxed">
                      Access real-time data and trends to make informed decisions about your property investments.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] group"
            >
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="XYZ Homes Corporate Client handshake"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFr-zgCDuThdoeyVGpkHzCByr3IO5Htl-JaTM6ciY_bUXbnILGBSA3ZsRYMnaJRmdLPo4Rgi7X-sUHSJ4eZhZ1GtVAdWDWJpnfLMpZN5LTH_9CwWnnnd23tomvjdTYZ_gM2ggh3_sPfyWUguAU1fgLVtSlgfQg7KuDjPrzabxIdX8IZuzeFH_jSTixg_sL_Fya1zU53_cxPCM08TH-qWLB3_Qf2Cd6zf4EPIU6I2Ovsu1tER7325dm6PcetfGWqcSZQDT7cJdeOr4"
              />
              <div className="absolute bottom-8 left-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl max-w-[220px]">
                <p className="font-headline-lg text-headline-lg text-[#004ac6] dark:text-[#adc6ff] font-bold text-3xl">98%</p>
                <p className="font-label-md text-label-md text-slate-600 dark:text-slate-400 font-medium mt-1 leading-snug">
                  Customer Satisfaction
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Customer Reviews testimonials */}
      <motion.section 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={containerVariants}
        className="py-stack-lg bg-background transition-colors"
      >
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-stack-lg max-w-xl mx-auto">
            <h2 className="font-headline-lg text-headline-lg text-on-background font-bold tracking-tight">
              What Our Clients Say
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Join thousands of happy homeowners who found their perfect place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Jenkins',
                role: 'Home Buyer',
                quote: 'The process was incredibly smooth. XYZ Homes provided us with options we didn\'t even know were on the market. Highly recommended!',
                avatarClass: 'bg-[#eeefff] text-[#004ac6] dark:bg-blue-950/40 dark:text-[#adc6ff]'
              },
              {
                name: 'Michael Chen',
                role: 'Property Owner',
                quote: 'As a seller, I appreciated the transparent communication and the premium presentation of my property. We closed faster than expected.',
                avatarClass: 'bg-[#004ac6] text-white dark:bg-primary dark:text-on-primary'
              },
              {
                name: 'David Thorne',
                role: 'Urban Renter',
                quote: 'Minimalist, efficient, and extremely helpful. The search tools are leagues ahead of other platforms. Found my dream apartment in a week.',
                avatarClass: 'bg-[#c2410c] text-white dark:bg-orange-950/40 dark:text-orange-350'
              },
            ].map((rev) => (
              <motion.div
                key={rev.name}
                variants={itemVariants}
                className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 shadow-sm transition-standard hover:-translate-y-1 hover:shadow-md cursor-pointer"
              >
                <div className="flex text-amber-500 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current text-orange-500" />
                  ))}
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 italic leading-relaxed">
                  "{rev.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${rev.avatarClass}`}>
                    {rev.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-background font-bold">
                      {rev.name}
                    </p>
                    <p className="font-label-sm text-label-sm text-outline font-semibold">
                      {rev.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call To Action banner */}
      <motion.section 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-stack-lg bg-[#004ac6] dark:bg-surface-container-low text-white dark:text-on-surface text-center transition-colors border-t border-outline-variant/10"
      >
        <div className="max-w-3xl mx-auto px-gutter">
          <h2 className="font-headline-lg text-headline-lg text-white dark:text-on-surface mb-stack-md font-bold">
            Ready to start your journey?
          </h2>
          <p className="font-body-lg text-body-lg text-white/90 dark:text-on-surface-variant mb-stack-lg opacity-90 leading-relaxed">
            Our expert agents are standing by to help you find your next home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/properties"
              className="bg-white dark:bg-primary text-[#004ac6] dark:text-on-primary font-semibold px-8 py-3.5 rounded-full hover:bg-slate-50 dark:hover:bg-blue-300 transition-all active:scale-95 shadow-md"
            >
              Browse Listings
            </Link>
            <Link
              to="/contact-us"
              className="bg-transparent border border-white/40 dark:border-slate-700 text-white dark:text-slate-350 font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 dark:hover:bg-slate-800 transition-all active:scale-95"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;
