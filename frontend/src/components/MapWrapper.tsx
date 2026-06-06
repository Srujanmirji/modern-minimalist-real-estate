import React, { useState } from 'react';
import { Plus, Minus, Layers, Navigation, Landmark, Heart, Star, School, ShieldAlert, Coffee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export interface MapProperty {
  id: string;
  title: string;
  price: number;
  latitude: number;
  longitude: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: Array<{ imageUrl: string }>;
}

interface MapWrapperProps {
  properties: MapProperty[];
  selectedProperty: MapProperty | null;
  onSelectProperty: (property: MapProperty) => void;
}

const MapWrapper: React.FC<MapWrapperProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
}) => {
  const [zoomLevel, setZoomLevel] = useState(13);
  const [nearbyFilter, setNearbyFilter] = useState<'none' | 'schools' | 'hospitals' | 'food'>('none');
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');
  const [directionsStatus, setDirectionsStatus] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
    return `$${Math.round(price / 1000).toLocaleString()}K`;
  };

  const calculateDirections = (p: MapProperty) => {
    setDirectionsStatus(`Calculating route to ${p.title} from current location...`);
    setTimeout(() => {
      setDirectionsStatus(
        `Optimized Route Found! 12 mins via Beverly Drive (4.2 miles). Traffic: Light.`
      );
    }, 1200);
  };

  // Map image baselines
  const streetsMapUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWxHrxJ0LzR5hvn8All2eiTY8GaOj11b91kzIAvFYJEJO6t4ekX106vG9aDgWRz2QioACu1ZWnwvuOHaXVn1rdErSLM8KfCI76bBvkZK1GR-dkvkrUm5nhs7h2Gkbq_-ZTed_9T1KSD9g7ILJDW9YBr61cCS7_wzFmynqJpO3o_Z9H3xVkPoAKCeLj-35bQ_LPBt3drCcW15L9SnZcn3Zo-gi54Vv6Zuac1Z5uA6pISZWo2Zqqck1e3dwgT40GxjPpsrhIayI-vvc';
  const satelliteMapUrl = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600'; // High resolution abstract grid

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden shadow-inner border border-outline-variant/30 bg-surface-dim">
      {/* Map Graphic Canvas */}
      <img
        src={mapType === 'streets' ? streetsMapUrl : satelliteMapUrl}
        alt="Interactive Map Grid"
        className={`w-full h-full object-cover transition-all duration-500 ${
          mapType === 'streets' ? 'grayscale-[20%] opacity-90' : 'brightness-[60%]'
        }`}
        style={{ transform: `scale(${1 + (zoomLevel - 13) * 0.05})` }}
      />

      {/* Floating search pins */}
      {properties.map((p, index) => {
        // Map latitude/longitude to clean absolute percentage values on screen to mock physical positions
        const mapX = 20 + (Math.abs(p.longitude) % 1) * 60;
        const mapY = 15 + (Math.abs(p.latitude) % 1) * 70;

        const isSelected = selectedProperty?.id === p.id;

        return (
          <div
            key={p.id}
            onClick={() => onSelectProperty(p)}
            className="absolute z-20 transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto group"
            style={{ left: `${mapX}%`, top: `${mapY}%` }}
          >
            <div
              className={`px-3 py-1.5 border shadow-lg rounded transition-all flex items-center gap-1 ${
                isSelected
                  ? 'bg-primary text-on-primary border-primary scale-110'
                  : 'bg-surface-container-lowest text-on-surface border-outline-variant/60 group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary'
              }`}
            >
              <Landmark className="h-3.5 w-3.5" />
              <span className="font-map-price-tag text-map-price-tag">{formatPrice(p.price)}</span>
            </div>
            {/* Small pointer triangle */}
            <div
              className={`w-2 h-2 rotate-45 mx-auto -mt-1 border-r border-b ${
                isSelected ? 'bg-primary border-primary' : 'bg-surface-container-lowest border-outline-variant/60 group-hover:bg-primary group-hover:border-primary'
              }`}
            />
          </div>
        );
      })}

      {/* Mock Nearby Amenity Icons */}
      {nearbyFilter !== 'none' && (
        <>
          <div className="absolute top-[40%] left-[30%] z-10 flex items-center gap-1 bg-white/95 text-slate-800 px-2 py-1 rounded-full shadow-md text-xs font-semibold backdrop-blur-sm">
            {nearbyFilter === 'schools' && (
              <>
                <School className="h-3.5 w-3.5 text-blue-600" />
                <span>Beverly Hills High (9/10)</span>
              </>
            )}
            {nearbyFilter === 'hospitals' && (
              <>
                <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
                <span>Cedars-Sinai ER (A+)</span>
              </>
            )}
            {nearbyFilter === 'food' && (
              <>
                <Coffee className="h-3.5 w-3.5 text-amber-600" />
                <span>Spago Grill</span>
              </>
            )}
          </div>
          <div className="absolute top-[25%] left-[60%] z-10 flex items-center gap-1 bg-white/95 text-slate-800 px-2 py-1 rounded-full shadow-md text-xs font-semibold backdrop-blur-sm">
            {nearbyFilter === 'schools' && (
              <>
                <School className="h-3.5 w-3.5 text-blue-600" />
                <span>Oak Elementary (0.8 mi)</span>
              </>
            )}
            {nearbyFilter === 'hospitals' && (
              <>
                <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
                <span>UCLA Urgent Care</span>
              </>
            )}
            {nearbyFilter === 'food' && (
              <>
                <Coffee className="h-3.5 w-3.5 text-amber-600" />
                <span>The Ivy Bistro</span>
              </>
            )}
          </div>
        </>
      )}

      {/* Map Control Dashboard */}
      <div className="absolute right-gutter bottom-12 flex flex-col gap-2 z-20">
        <button
          onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
          className="w-12 h-12 bg-surface-container-lowest border border-outline-variant/30 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors shadow-lg active:scale-95"
          title="Zoom In"
        >
          <Plus className="h-5 w-5" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(z - 1, 10))}
          className="w-12 h-12 bg-surface-container-lowest border border-outline-variant/30 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors shadow-lg active:scale-95"
          title="Zoom Out"
        >
          <Minus className="h-5 w-5" />
        </button>
        <button
          onClick={() => setMapType((t) => (t === 'streets' ? 'satellite' : 'streets'))}
          className="w-12 h-12 bg-surface-container-lowest border border-outline-variant/30 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors shadow-lg mt-4 active:scale-95"
          title="Map Layers"
        >
          <Layers className="h-5 w-5" />
        </button>
      </div>

      {/* Map Amenities Overlay Filter */}
      <div className="absolute left-gutter top-4 flex gap-2 z-20 pointer-events-auto">
        <button
          onClick={() => setNearbyFilter((f) => (f === 'schools' ? 'none' : 'schools'))}
          className={`px-4 py-1.5 border rounded-full font-label-md text-xs transition-colors backdrop-blur-md shadow-sm ${
            nearbyFilter === 'schools'
              ? 'bg-primary text-on-primary border-primary'
              : 'bg-surface-container-lowest/80 text-on-surface border-outline-variant/20 hover:bg-surface-container-low'
          }`}
        >
          NEARBY SCHOOLS
        </button>
        <button
          onClick={() => setNearbyFilter((f) => (f === 'hospitals' ? 'none' : 'hospitals'))}
          className={`px-4 py-1.5 border rounded-full font-label-md text-xs transition-colors backdrop-blur-md shadow-sm ${
            nearbyFilter === 'hospitals'
              ? 'bg-primary text-on-primary border-primary'
              : 'bg-surface-container-lowest/80 text-on-surface border-outline-variant/20 hover:bg-surface-container-low'
          }`}
        >
          HOSPITALS
        </button>
        <button
          onClick={() => setNearbyFilter((f) => (f === 'food' ? 'none' : 'food'))}
          className={`px-4 py-1.5 border rounded-full font-label-md text-xs transition-colors backdrop-blur-md shadow-sm ${
            nearbyFilter === 'food'
              ? 'bg-primary text-on-primary border-primary'
              : 'bg-surface-container-lowest/80 text-on-surface border-outline-variant/20 hover:bg-surface-container-low'
          }`}
        >
          RESTAURANTS
        </button>
      </div>

      {/* Selected Property Preview Popup (Bottom Left) */}
      {selectedProperty && (
        <div className="absolute left-gutter bottom-4 max-w-sm w-[calc(100%-48px)] bg-surface/95 border border-outline-variant/30 rounded-xl shadow-2xl p-4 z-20 backdrop-blur-md transition-all duration-300">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-container">
              <img
                src={selectedProperty.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'}
                alt={selectedProperty.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow min-w-0">
              <h4 className="font-bold text-sm text-on-surface truncate">
                {selectedProperty.title}
              </h4>
              <p className="text-primary font-bold text-sm mt-0.5">
                ${selectedProperty.price.toLocaleString()}
              </p>
              <p className="text-xs text-on-surface-variant italic truncate mt-1 flex items-center gap-0.5">
                <Navigation className="h-3 w-3 inline" /> {selectedProperty.location}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-4 pt-3 border-t border-outline-variant/20">
            <button
              onClick={() => calculateDirections(selectedProperty)}
              className="flex-grow flex items-center justify-center gap-1 px-3 py-1.5 bg-primary text-on-primary text-xs font-bold rounded hover:opacity-90 transition-opacity"
            >
              <Navigation className="h-3.5 w-3.5" />
              Get Directions
            </button>
            <Link
              to={`/properties/${selectedProperty.id}`}
              className="px-3 py-1.5 bg-surface-container-high border border-outline-variant/20 text-on-surface text-xs font-bold rounded hover:bg-surface-container-highest transition-colors text-center"
            >
              Details
            </Link>
          </div>

          {/* Directions Status Notification banner */}
          {directionsStatus && (
            <div className="mt-3 p-2 bg-primary-container/10 border border-primary/20 text-primary rounded text-[11px] font-semibold">
              {directionsStatus}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapWrapper;
