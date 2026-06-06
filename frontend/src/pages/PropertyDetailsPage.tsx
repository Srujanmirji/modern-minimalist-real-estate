import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Star, Bed, Bath, Maximize, Landmark, ChevronRight, School, ShoppingBag, Eye, Calendar, Mail, Phone, Heart, Share2, Grid, X, Plus, Minus, Globe, Navigation } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleFavoriteThunk, fetchFavorites } from '../store/slices/favoritesSlice';
import { motion, AnimatePresence } from 'framer-motion';

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  // State
  const [property, setProperty] = useState<any | null>(null);
  const [nearbyAmenities, setNearbyAmenities] = useState<any | null>(null);
  const [similarProperties, setSimilarProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Interaction State
  const [floorPlanLevel, setFloorPlanLevel] = useState<'main' | 'lower'>('main');
  const [mapZoom, setMapZoom] = useState(1);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState("I'm interested in viewing this property.");
  
  // Lightbox Modal State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Redux Selectors
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);
  const isFavorite = property ? favoriteIds.includes(property.id) : false;

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data.property);
        setNearbyAmenities(response.data.nearbyAmenities);

        // Fetch similar properties
        const similarRes = await api.get(`/properties?type=${response.data.property.type}`);
        setSimilarProperties(
          similarRes.data.properties.filter((p: any) => p.id !== id).slice(0, 3)
        );

        // Log analytics trigger
        await api.get('/properties/recommendations');
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/booking/${property.id}`);
  };

  const handleToggleFavorite = () => {
    if (property) {
      dispatch(toggleFavoriteThunk(property));
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: property?.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Listing link copied to clipboard!');
    }
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

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(property.price);

  const estMortgage = Math.round((property.price * 0.8 * 0.065) / 12);

  const galleryImages = property.images && property.images.length > 0 
    ? property.images.map((img: any) => img.imageUrl)
    : [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=600',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600'
      ];

  return (
    <div className="max-w-container-max mx-auto px-gutter py-8 transition-colors pb-24 md:pb-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-stack-md text-on-surface-variant font-label-sm text-label-sm">
        <Link to="/properties" className="hover:text-primary transition-colors">Properties</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="hover:text-primary transition-colors truncate max-w-[120px]">{property.city}</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-on-background font-bold truncate max-w-[200px]">{property.title}</span>
      </nav>

      {/* Bento Collage Gallery */}
      <section className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-stack-sm h-[320px] md:h-[600px] mb-stack-lg rounded-xl overflow-hidden shadow-sm relative group">
        <div 
          onClick={() => { setLightboxOpen(true); setActivePhotoIdx(0); }} 
          className="md:col-span-2 md:row-span-2 relative cursor-pointer overflow-hidden"
        >
          <img
            src={galleryImages[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
          />
          <div className="absolute inset-0 bg-black/5 hover:bg-black/0 transition-colors"></div>
        </div>
        
        {galleryImages.slice(1, 5).map((img: string, idx: number) => (
          <div 
            key={idx} 
            onClick={() => { setLightboxOpen(true); setActivePhotoIdx(idx + 1); }} 
            className="hidden md:block relative cursor-pointer overflow-hidden"
          >
            <img
              src={img}
              alt={`Gallery View ${idx + 2}`}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
            />
            <div className="absolute inset-0 bg-black/5 hover:bg-black/0 transition-colors"></div>
            
            {idx === 3 && (
              <button className="absolute bottom-4 right-4 bg-white/95 text-slate-800 px-4 py-2 rounded-lg flex items-center gap-2 font-label-md text-label-md border border-white/40 shadow-lg font-bold hover:bg-white active:scale-95 transition-all">
                <Grid className="h-4 w-4" />
                View all photos
              </button>
            )}
          </div>
        ))}
      </section>

      {/* Main Details Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg items-start">
        {/* Left Specification details */}
        <div className="lg:col-span-2 space-y-stack-lg">
          {/* Header Block */}
          <div className="bg-surface-container-lowest p-stack-lg rounded-xl border border-outline-variant/30 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm inline-block mb-2 font-bold uppercase tracking-wider">
                  {property.type}
                </span>
                <h1 className="font-headline-lg text-headline-lg text-on-background mb-1">
                  {property.title}
                </h1>
                <p className="text-on-surface-variant font-body-md text-body-md flex items-center gap-1">
                  <MapPin className="h-4.5 w-4.5 text-outline" />
                  {property.address}, {property.location}
                </p>
              </div>
              <div className="text-left md:text-right">
                <div className="font-headline-lg text-headline-lg text-primary font-bold">
                  {formattedPrice}
                </div>
                {property.type !== 'Land' && (
                  <p className="text-on-surface-variant font-label-md text-label-md mt-1">
                    Est. Mortgage: ${estMortgage.toLocaleString()}/mo
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-outline-variant/20">
              <div className="flex flex-col">
                <span className="text-on-surface-variant font-label-sm text-label-sm mb-1">Bedrooms</span>
                <div className="flex items-center gap-2">
                  <Bed className="text-primary h-5 w-5" />
                  <span className="font-headline-md text-headline-md font-bold">
                    {property.bedrooms || '-'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-on-surface-variant font-label-sm text-label-sm mb-1">Bathrooms</span>
                <div className="flex items-center gap-2">
                  <Bath className="text-primary h-5 w-5" />
                  <span className="font-headline-md text-headline-md font-bold">
                    {property.bathrooms || '-'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-on-surface-variant font-label-sm text-label-sm mb-1">Living Area</span>
                <div className="flex items-center gap-2">
                  <Maximize className="text-primary h-5 w-5" />
                  <span className="font-headline-md text-headline-md font-bold">
                    {property.area.toLocaleString()}{' '}
                    <span className="font-label-sm text-label-sm font-normal">sqft</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-on-surface-variant font-label-sm text-label-sm mb-1">Lot Size</span>
                <div className="flex items-center gap-2">
                  <Landmark className="text-primary h-5 w-5" />
                  <span className="font-headline-md text-headline-md font-bold">
                    {property.type === 'Land' ? `${Math.round(property.area / 43560)} ac` : '0.4 ac'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <section className="space-y-4">
            <h2 className="font-headline-md text-headline-md text-on-background font-bold">About this home</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {property.description}
            </p>
          </section>

          {/* Amenities Grid */}
          <section className="space-y-6">
            <h2 className="font-headline-md text-headline-md text-on-background font-bold">Amenities & Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
              {property.amenities.map((amenity: string) => (
                <div key={amenity} className="flex items-center gap-3 py-3 border-b border-outline-variant/15 text-on-surface">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-body-md text-body-md">{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Floor Plan Tab selection with Framer Motion Layout shifting */}
          {property.type !== 'Land' && (
            <section className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline-md text-headline-md text-on-background font-bold">Floor Plan</h2>
                <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/20 relative">
                  {(['main', 'lower'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setFloorPlanLevel(level)}
                      className={`relative px-4 py-1.5 rounded-md text-label-md font-label-md font-bold z-10 transition-colors ${
                        floorPlanLevel === level ? 'text-on-surface' : 'text-on-surface-variant'
                      }`}
                    >
                      {level === 'main' ? 'Main Level' : 'Lower Level'}
                      {floorPlanLevel === level && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute inset-0 bg-surface-container-high rounded-md -z-10 border border-outline-variant/30"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={floorPlanLevel}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="bg-surface-container-low rounded-xl aspect-video flex items-center justify-center border border-outline-variant/30 relative overflow-hidden p-6"
                >
                  <img
                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal opacity-85 dark:brightness-90"
                    alt="XYZ Homes Floor plans schematic diagram"
                    src={
                      floorPlanLevel === 'main'
                        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuClIjMsq4Xm1EGVFQAbIqqlZrgtORAj36rQHfECWuttLcX_vMG8tCBKsHJQ8J1xo8nSB7lT8NPWW_zbqM5W788sjb3mOUA8d85BX3mlFkq33mEVuxS5fL6ggPp6-dewf1imM5dM96gdVQl2YQo0ep4E2QBT5kD8-wRe5UhNd58K-lQymqSD3EigAdWniwrbBbsXTXZHmr_9owc3PuLsRaHze-dXrapke2IkImZDA-6yxi1LgiNXqXpjLB_NBU8PFrnTKNiegsZ943g'
                        : 'https://images.unsplash.com/photo-1545464693-39499ad3447c?w=800'
                    }
                  />
                </motion.div>
              </AnimatePresence>
            </section>
          )}

          {/* Location Map */}
          <section className="space-y-6">
            <h2 className="font-headline-md text-headline-md text-on-background font-bold">Location Context</h2>
            <div className="relative w-full h-[350px] bg-slate-100 dark:bg-slate-900 overflow-hidden rounded-xl border border-outline-variant/30 select-none">
              <div 
                className="w-full h-full transition-transform duration-300 origin-center"
                style={{ transform: `scale(${mapZoom})` }}
              >
                <svg className="w-full h-full" viewBox="0 0 800 350" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Background Land */}
                  <rect width="800" height="350" className="fill-[#f1f5f9] dark:fill-[#0f172a]"/>
                  
                  {/* Water body / River */}
                  <path d="M 0,220 Q 200,280 400,200 T 800,290 L 800,350 L 0,350 Z" className="fill-[#cbd5e1] dark:fill-[#1e293b]"/>
                  
                  {/* Parks */}
                  <rect x="80" y="40" width="120" height="90" rx="10" className="fill-[#dcfce7] dark:fill-[#14532d] opacity-80"/>
                  <rect x="550" y="80" width="160" height="110" rx="15" className="fill-[#dcfce7] dark:fill-[#14532d] opacity-80"/>
                  
                  {/* Buildings */}
                  <rect x="200" y="100" width="30" height="20" rx="3" className="fill-[#e2e8f0] dark:fill-[#334155]"/>
                  <rect x="240" y="100" width="45" height="20" rx="3" className="fill-[#e2e8f0] dark:fill-[#334155]"/>
                  <rect x="210" y="130" width="35" height="20" rx="3" className="fill-[#e2e8f0] dark:fill-[#334155]"/>
                  <rect x="360" y="180" width="40" height="25" rx="3" className="fill-[#e2e8f0] dark:fill-[#334155]"/>
                  <rect x="410" y="180" width="30" height="25" rx="3" className="fill-[#e2e8f0] dark:fill-[#334155]"/>
                  <rect x="500" y="50" width="25" height="25" rx="3" className="fill-[#e2e8f0] dark:fill-[#334155]"/>
                  <rect x="530" y="50" width="35" height="25" rx="3" className="fill-[#e2e8f0] dark:fill-[#334155]"/>
                  
                  {/* Secondary Roads */}
                  <path d="M 0,80 L 800,80" className="stroke-white dark:stroke-[#334155]" strokeWidth="3"/>
                  <path d="M 0,160 L 800,160" className="stroke-white dark:stroke-[#334155]" strokeWidth="3"/>
                  <path d="M 0,270 L 800,270" className="stroke-white dark:stroke-[#334155]" strokeWidth="3"/>
                  <path d="M 150,0 L 150,350" className="stroke-white dark:stroke-[#334155]" strokeWidth="3"/>
                  <path d="M 320,0 L 320,350" className="stroke-white dark:stroke-[#334155]" strokeWidth="3"/>
                  <path d="M 480,0 L 480,350" className="stroke-white dark:stroke-[#334155]" strokeWidth="3"/>
                  <path d="M 640,0 L 640,350" className="stroke-white dark:stroke-[#334155]" strokeWidth="3"/>
                  
                  {/* Curved Organic Roads */}
                  <path d="M 100,0 Q 220,100 400,50 T 700,0" className="stroke-white dark:stroke-[#334155]" strokeWidth="2.5" fill="none"/>
                  <path d="M 0,220 Q 250,150 500,260 T 800,200" className="stroke-white dark:stroke-[#334155]" strokeWidth="2.5" fill="none"/>

                  {/* Main Highways */}
                  <path d="M -50,-50 L 850,400" className="stroke-[#cbd5e1] dark:stroke-[#475569]" strokeWidth="12"/>
                  <path d="M -50,-50 L 850,400" className="stroke-white dark:stroke-[#0f172a]" strokeWidth="8"/>
                  <path d="M 850,-50 L -50,400" className="stroke-white dark:stroke-[#334155]" strokeWidth="8"/>
                  <path d="M 850,-50 L -50,400" className="stroke-[#004ac6]/10 dark:stroke-[#38bdf8]/10" strokeWidth="4"/>
                </svg>
              </div>

              {/* Pulsing Pin Marker */}
              <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                <span className="absolute -top-1.5 flex h-10 w-10 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-primary/30 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <MapPin className="h-8 w-8 text-primary drop-shadow-md z-10 mt-1" />
                
                <div className="absolute bottom-9 bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-bold text-[10px] text-slate-800 dark:text-slate-100 tracking-tight uppercase">
                    {property.title}
                  </span>
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute right-4 bottom-4 flex flex-col gap-1.5 z-10">
                <button 
                  type="button"
                  onClick={() => setMapZoom(z => Math.min(z + 0.15, 1.6))}
                  className="w-9 h-9 bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-200 shadow hover:bg-slate-50 dark:hover:bg-slate-900 active:scale-95 transition-all"
                  title="Zoom In"
                >
                  <Plus className="h-4.5 w-4.5" />
                </button>
                <button 
                  type="button"
                  onClick={() => setMapZoom(z => Math.max(z - 0.15, 0.85))}
                  className="w-9 h-9 bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-200 shadow hover:bg-slate-50 dark:hover:bg-slate-900 active:scale-95 transition-all"
                  title="Zoom Out"
                >
                  <Minus className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Status Header Overlay */}
              <div className="absolute left-4 top-4 bg-white/95 dark:bg-[#131b2e]/95 backdrop-blur-md px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-full text-[9px] font-bold tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5 shadow-sm">
                <Globe className="h-3.5 w-3.5 text-primary" /> 
                <span className="uppercase">{property.city} MAP DISCOVERY</span>
              </div>

              {/* Compass navigation */}
              <button 
                type="button"
                onClick={() => setMapZoom(1)}
                className="absolute left-4 bottom-4 bg-white dark:bg-[#131b2e] p-2 border border-slate-200 dark:border-slate-800 rounded-full text-primary shadow hover:bg-slate-50 dark:hover:bg-slate-900 active:scale-95 transition-all"
                title="Reset View"
              >
                <Navigation className="h-4.5 w-4.5 rotate-45" />
              </button>
            </div>
            
            {nearbyAmenities && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-outline-variant/20">
                <div>
                  <h4 className="font-bold text-sm text-on-background mb-3 flex items-center gap-1">
                    <School className="h-4.5 w-4.5 text-primary" /> Schools Nearby
                  </h4>
                  <ul className="space-y-2 text-xs text-on-surface-variant">
                    {nearbyAmenities.schools.map((s: any) => (
                      <li key={s.name}>
                        <span className="font-bold text-on-surface">{s.name}</span> ({s.distance}) - Rating: {s.rating}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-on-background mb-3 flex items-center gap-1">
                    <Landmark className="h-4.5 w-4.5 text-primary" /> Medical Facilities
                  </h4>
                  <ul className="space-y-2 text-xs text-on-surface-variant">
                    {nearbyAmenities.hospitals.map((h: any) => (
                      <li key={h.name}>
                        <span className="font-bold text-on-surface">{h.name}</span> ({h.distance}) - Grade: {h.rating}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-on-background mb-3 flex items-center gap-1">
                    <ShoppingBag className="h-4.5 w-4.5 text-primary" /> Dining & Lifestyle
                  </h4>
                  <ul className="space-y-2 text-xs text-on-surface-variant">
                    {nearbyAmenities.restaurants.map((r: any) => (
                      <li key={r.name}>
                        <span className="font-bold text-on-surface">{r.name}</span> ({r.distance}) - Cuisine: {r.cuisine}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Sidebar sticky Scheduling Inquiry Form */}
        <aside className="lg:sticky lg:top-24 space-y-stack-md">
          <div className="bg-surface-container-lowest p-stack-lg rounded-xl border border-outline-variant/30 shadow-sm">
            <div className="flex items-center gap-4 mb-stack-md pb-stack-md border-b border-outline-variant/20">
              <img
                src={property.agent.avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'}
                alt={property.agent.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <div className="font-label-md text-label-md font-bold text-on-background">
                  {property.agent.name}
                </div>
                <div className="text-on-surface-variant font-label-sm text-label-sm font-semibold">
                  Platform Representative
                </div>
              </div>
            </div>

            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none font-body-md text-body-md text-on-background dark:bg-surface-container"
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none font-body-md text-body-md text-on-background dark:bg-surface-container"
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
                  Message
                </label>
                <textarea
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="I'm interested in..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none font-body-md text-body-md resize-none text-on-background dark:bg-surface-container"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-on-primary py-4 rounded-lg font-headline-md text-headline-md hover:opacity-95 transition-opacity shadow-lg shadow-primary/20 active:scale-[0.98] duration-200 font-bold"
              >
                Schedule Tour Appointment
              </button>
            </form>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-outline-variant/50 hover:bg-surface-container-low transition-colors font-label-md text-label-md font-bold"
            >
              <Share2 className="h-4.5 w-4.5" /> Share Listing
            </button>
          </div>
        </aside>
      </div>

      {/* Sticky Booking Bar for Mobile Devices */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-md border-t border-outline-variant/30 p-4 flex justify-between items-center md:hidden shadow-lg transition-colors">
        <div>
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Acquisition Rate</p>
          <p className="text-lg font-bold text-primary">{formattedPrice}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/booking/${property.id}`)}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md text-label-md font-bold active:scale-95 transition-all shadow-md"
          >
            Book Tour
          </button>
        </div>
      </div>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (
        <section className="mt-stack-lg pt-stack-lg border-t border-outline-variant/30">
          <h2 className="font-headline-lg text-headline-lg text-on-background mb-stack-md font-bold">
            Similar Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
            {similarProperties.map((p) => {
              const formattedPrice = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }).format(p.price);

              return (
                <Link
                  key={p.id}
                  to={`/properties/${p.id}`}
                  className="group cursor-pointer bg-white dark:bg-surface-container-lowest rounded-lg border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-md transition-all block"
                >
                  <div className="h-64 overflow-hidden">
                    <img
                      src={p.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <div className="font-headline-md text-headline-md mb-1 text-primary font-bold">
                      {formattedPrice}
                    </div>
                    {p.type !== 'Land' ? (
                      <div className="font-label-md text-label-md text-on-surface-variant mb-4 font-semibold">
                        {p.bedrooms} Bed • {p.bathrooms} Bath • {p.area.toLocaleString()} sqft
                      </div>
                    ) : (
                      <div className="font-label-md text-label-md text-on-surface-variant mb-4 font-semibold">
                        {Math.round(p.area / 43560)} Acres Land
                      </div>
                    )}
                    <div className="text-on-background font-body-md text-body-md font-bold truncate">
                      {p.title}
                    </div>
                    <div className="text-on-surface-variant font-label-sm text-label-sm italic truncate">
                      {p.location}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Full Screen Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-6">
            {/* Header */}
            <div className="flex justify-between items-center text-white z-10">
              <span className="font-label-md text-label-md font-bold">
                {activePhotoIdx + 1} / {galleryImages.length} • {property.title}
              </span>
              <button 
                onClick={() => setLightboxOpen(false)} 
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all active:scale-95"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Photo Center */}
            <div className="flex-1 flex items-center justify-center relative select-none">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activePhotoIdx}
                  src={galleryImages[activePhotoIdx]}
                  alt={`Lightbox View ${activePhotoIdx + 1}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="max-h-[75vh] max-w-[90vw] object-contain rounded shadow-2xl"
                />
              </AnimatePresence>
            </div>

            {/* Footer Navigation Thumbnails */}
            <div className="overflow-x-auto flex justify-center gap-3 py-4 z-10 scrollbar-none">
              {galleryImages.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`relative w-20 h-14 rounded overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activePhotoIdx === idx ? 'border-primary scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyDetailsPage;
