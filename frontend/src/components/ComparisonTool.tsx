import React from 'react';
import { X, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ComparisonProperty {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  amenities: string[];
  images: Array<{ imageUrl: string }>;
}

interface ComparisonToolProps {
  properties: ComparisonProperty[];
  onRemove: (id: string) => void;
  onClose: () => void;
}

const ComparisonTool: React.FC<ComparisonToolProps> = ({ properties, onRemove, onClose }) => {
  if (properties.length === 0) return null;

  // Gather all unique amenities across compared properties to compile a clean checklist matrix
  const allAmenities = Array.from(
    new Set(properties.reduce<string[]>((acc, p) => [...acc, ...p.amenities], []))
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 overflow-y-auto p-gutter transition-all duration-300">
      <div className="max-w-container-max mx-auto bg-surface border border-outline-variant/30 rounded-2xl shadow-2xl p-6 md:p-8 mt-10 mb-10 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-outline-variant/20 pb-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary">Compare Properties</h2>
            <p className="text-on-surface-variant text-sm mt-1">
              Evaluating {properties.length} homes side-by-side
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 border border-outline-variant/30 rounded-full hover:bg-surface-container-low transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Matrix Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-outline-variant/20">
                <th className="py-4 pr-4 text-sm font-semibold text-on-surface-variant w-1/4">
                  Specification
                </th>
                {properties.map((p) => (
                  <th key={p.id} className="py-4 px-4 w-1/4 align-top relative">
                    <button
                      onClick={() => onRemove(p.id)}
                      className="absolute top-2 right-2 text-outline hover:text-error transition-colors"
                      title="Remove comparison"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="space-y-2">
                      <div className="h-32 rounded-lg overflow-hidden bg-surface-container mb-2">
                        <img
                          src={p.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-bold text-sm text-on-surface truncate pr-6">
                        {p.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant italic truncate">
                        {p.location}
                      </p>
                    </div>
                  </th>
                ))}
                {/* Pad columns to match 4 columns layout for standard desktop */}
                {properties.length < 3 &&
                  Array.from({ length: 3 - properties.length }).map((_, idx) => (
                    <th key={idx} className="py-4 px-4 w-1/4 text-center align-middle border-dashed border border-outline-variant/20 rounded-xl bg-surface-container-low/30">
                      <span className="text-xs text-outline">Add property to compare</span>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {/* Row: Price */}
              <tr className="border-b border-outline-variant/10 hover:bg-surface-container-low/20 transition-colors">
                <td className="py-4 pr-4 font-semibold text-sm text-on-surface">Price</td>
                {properties.map((p) => (
                  <td key={p.id} className="py-4 px-4 font-bold text-primary text-sm">
                    {formatPrice(p.price)}
                  </td>
                ))}
                {properties.length < 3 && <td colSpan={3 - properties.length} />}
              </tr>

              {/* Row: Type */}
              <tr className="border-b border-outline-variant/10 hover:bg-surface-container-low/20 transition-colors">
                <td className="py-4 pr-4 font-semibold text-sm text-on-surface">Type</td>
                {properties.map((p) => (
                  <td key={p.id} className="py-4 px-4 text-sm text-on-surface-variant">
                    {p.type}
                  </td>
                ))}
                {properties.length < 3 && <td colSpan={3 - properties.length} />}
              </tr>

              {/* Row: Beds/Baths */}
              <tr className="border-b border-outline-variant/10 hover:bg-surface-container-low/20 transition-colors">
                <td className="py-4 pr-4 font-semibold text-sm text-on-surface">Beds & Baths</td>
                {properties.map((p) => (
                  <td key={p.id} className="py-4 px-4 text-sm text-on-surface-variant">
                    {p.bedrooms} Beds • {p.bathrooms} Baths
                  </td>
                ))}
                {properties.length < 3 && <td colSpan={3 - properties.length} />}
              </tr>

              {/* Row: Area */}
              <tr className="border-b border-outline-variant/10 hover:bg-surface-container-low/20 transition-colors">
                <td className="py-4 pr-4 font-semibold text-sm text-on-surface">Size</td>
                {properties.map((p) => (
                  <td key={p.id} className="py-4 px-4 text-sm text-on-surface-variant font-medium">
                    {p.area.toLocaleString()} sqft
                  </td>
                ))}
                {properties.length < 3 && <td colSpan={3 - properties.length} />}
              </tr>

              {/* Row: Cap Rate Est */}
              <tr className="border-b border-outline-variant/10 hover:bg-surface-container-low/20 transition-colors">
                <td className="py-4 pr-4 font-semibold text-sm text-on-surface">Est. ROI Cap Rate</td>
                {properties.map((p) => (
                  <td key={p.id} className="py-4 px-4 text-sm font-semibold text-green-600 dark:text-green-400">
                    {p.type === 'Land' ? 'N/A' : `${((65000 / p.price) * 100).toFixed(2)}%`}
                  </td>
                ))}
                {properties.length < 3 && <td colSpan={3 - properties.length} />}
              </tr>

              {/* Header: Amenities checklist */}
              <tr>
                <td colSpan={4} className="py-4 font-bold text-xs uppercase tracking-wider text-outline border-b border-outline-variant/20 pt-8">
                  Amenities Matrix
                </td>
              </tr>

              {allAmenities.map((amenity) => (
                <tr key={amenity} className="border-b border-outline-variant/10 hover:bg-surface-container-low/20 transition-colors">
                  <td className="py-3 pr-4 text-sm text-on-surface-variant">{amenity}</td>
                  {properties.map((p) => {
                    const hasAmenity = p.amenities.includes(amenity);
                    return (
                      <td key={p.id} className="py-3 px-4">
                        {hasAmenity ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-outline opacity-40" />
                        )}
                      </td>
                    );
                  })}
                  {properties.length < 3 && <td colSpan={3 - properties.length} />}
                </tr>
              ))}

              {/* Row: Link trigger */}
              <tr>
                <td className="py-6" />
                {properties.map((p) => (
                  <td key={p.id} className="py-6 px-4">
                    <Link
                      to={`/properties/${p.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline group"
                    >
                      View Property
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </td>
                ))}
                {properties.length < 3 && <td colSpan={3 - properties.length} />}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTool;
