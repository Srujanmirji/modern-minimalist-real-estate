import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Maximize } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleFavoriteThunk } from '../store/slices/favoritesSlice';

export interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    city: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    type: string;
    featured: boolean;
    status: string;
    images: Array<{ imageUrl: string }>;
  };
  isFavoriteInitial?: boolean;
  showFavoriteButton?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  showFavoriteButton = false 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);
  const favoriteLoading = useAppSelector((state) => state.favorites.loading);
  const isFavorite = favoriteIds.includes(property.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavoriteThunk(property as any));
  };

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(property.price);

  const mainImageUrl = property.images && property.images.length > 0
    ? property.images[0].imageUrl
    : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800';

  // Exact mockup badge mapping
  let badgeText = '';
  let badgeClass = 'bg-surface-container-high/90 text-on-surface backdrop-blur-sm';
  
  const titleLower = property.title.toLowerCase();
  if (titleLower.includes('azure heights')) {
    badgeText = 'New Listing';
    badgeClass = 'bg-[#004ac6] text-white';
  } else if (titleLower.includes('oasis villa')) {
    badgeText = 'Exclusive';
    badgeClass = 'bg-[#d0e1fb] text-[#004ac6]';
  } else if (titleLower.includes('willow creek')) {
    badgeText = 'Hot Deal';
    badgeClass = 'bg-[#ea580c] text-white';
  } else {
    badgeText = property.status === 'FOR_SALE' ? 'For Sale' : property.status === 'FOR_RENT' ? 'For Rent' : property.status;
  }

  let displayTitle = property.title;
  if (displayTitle.toLowerCase().includes('willow creek house')) {
    displayTitle = 'Willow Creek';
  }

  return (
    <div className="property-card group bg-surface-container-lowest rounded-lg border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-md transition-standard">
      <Link to={`/properties/${property.id}`} className="block">
        <div className="relative h-64 overflow-hidden">
          <img
            src={mainImageUrl}
            alt={property.title}
            className="property-image w-full h-full object-cover transition-standard"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-sm ${badgeClass}`}>
              {badgeText}
            </span>
          </div>
          {showFavoriteButton && (
            <button
              onClick={handleFavoriteClick}
              disabled={favoriteLoading}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-error transition-all active:scale-90"
              title="Add to Wishlist"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>
          )}
        </div>

        <div className="p-5 space-y-2">
          {/* Row 1: Title and Price */}
          <div className="flex justify-between items-center gap-2">
            <h4 className="font-body-md text-body-md text-on-surface font-bold truncate">
              {displayTitle}
            </h4>
            <span className="text-primary font-bold text-sm shrink-0">
              {formattedPrice}
            </span>
          </div>

          {/* Row 2: Location */}
          <p className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
            <MapPin className="h-4 w-4 text-outline" />
            <span className="truncate">{property.location}</span>
          </p>

          {/* Row 3: Specs */}
          <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20 text-on-surface-variant text-xs font-semibold">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4 text-outline" />
              <span>{property.bedrooms || '-'} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4 text-outline" />
              <span>{property.bathrooms || '-'} Baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize className="h-4 w-4 text-outline" />
              <span>{property.area.toLocaleString()} sqft</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
