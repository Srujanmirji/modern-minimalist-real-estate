import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MapWrapper from '../components/MapWrapper';
import { Search, MapPin, Grid, Compass, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MapSearchPage: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);

  // Search Filter inputs
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('Land'); // Default to land holdings matching bento map specs

  useEffect(() => {
    const fetchMapProperties = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append('search', searchQuery);
        if (propertyType) queryParams.append('type', propertyType);

        const response = await api.get(`/properties?${queryParams.toString()}`);
        setProperties(response.data.properties);

        // Pre-select first property if available
        if (response.data.properties.length > 0) {
          setSelectedProperty(response.data.properties[0]);
        } else {
          setSelectedProperty(null);
        }
      } catch (error) {
        console.error('Error fetching map properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMapProperties();
  }, [searchQuery, propertyType]);

  return (
    <div className="h-[calc(100vh-80px)] w-full flex relative overflow-hidden bg-surface-dim transition-colors">
      {/* Left Sidebar: properties list summary */}
      <aside className="w-80 md:w-96 bg-surface border-r border-outline-variant/30 flex flex-col h-full z-10 relative shadow-lg">
        {/* Search controls */}
        <div className="p-4 border-b border-outline-variant/20 space-y-3">
          <Link
            to="/properties"
            className="flex items-center gap-1 text-xs font-semibold text-outline hover:text-primary"
          >
            <ChevronLeft className="h-4.5 w-4.5" /> Back to Grid View
          </Link>
          <div className="relative pointer-events-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline h-4 w-4" />
            <input
              type="text"
              placeholder="Search region, zoning, acres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant/50 rounded-lg text-sm text-on-background placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPropertyType('Land')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                propertyType === 'Land'
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface border-outline-variant/30 text-on-surface hover:bg-surface-container-low'
              }`}
            >
              LAND HECTARES
            </button>
            <button
              onClick={() => setPropertyType('Villa')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                propertyType === 'Villa'
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface border-outline-variant/30 text-on-surface hover:bg-surface-container-low'
              }`}
            >
              VILLAS / HOMES
            </button>
          </div>
        </div>

        {/* Listings Result Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse h-28 bg-surface-container-low rounded-lg border border-outline-variant/20"
              />
            ))
          ) : properties.length === 0 ? (
            <div className="text-center py-12 text-outline text-sm">
              No matching properties found on map.
            </div>
          ) : (
            properties.map((p) => {
              const isSelected = selectedProperty?.id === p.id;
              const formattedPrice = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }).format(p.price);

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProperty(p)}
                  className={`flex gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-surface-container-high border-primary'
                      : 'bg-surface-container-lowest border-outline-variant/20 hover:bg-surface-container-low'
                  }`}
                >
                  <div className="w-20 h-20 rounded-md overflow-hidden bg-surface-container shrink-0">
                    <img
                      src={p.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <h4 className="font-bold text-sm text-on-surface truncate">{p.title}</h4>
                    <p className="text-primary font-bold text-xs mt-0.5">{formattedPrice}</p>
                    <p className="text-[11px] text-on-surface-variant italic truncate mt-1 flex items-center gap-0.5">
                      <MapPin className="h-3 w-3 inline text-outline" /> {p.location}
                    </p>
                    {p.type === 'Land' ? (
                      <p className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded inline-block mt-2 font-bold uppercase tracking-wider">
                        {Math.round(p.area / 43560)} Acres
                      </p>
                    ) : (
                      <p className="text-[10px] text-outline mt-2">
                        {p.bedrooms} Beds • {p.bathrooms} Baths
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Right side Map wrapper (takes all remaining space) */}
      <div className="flex-grow h-full relative pointer-events-auto">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-dim text-outline">
            Loading Map overlays...
          </div>
        ) : (
          <MapWrapper
            properties={properties}
            selectedProperty={selectedProperty}
            onSelectProperty={(p) => setSelectedProperty(p)}
          />
        )}
      </div>
    </div>
  );
};

export default MapSearchPage;
