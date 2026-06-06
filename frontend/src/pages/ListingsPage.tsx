import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchProperties,
  setSearch,
  setMinPrice,
  setMaxPrice,
  toggleType,
  toggleAmenity,
  setSortBy,
  setPage,
  resetFilters,
  setUrlFilters,
} from '../store/slices/propertiesSlice';
import { toggleCompare, removeFromCompare, setIsOpen } from '../store/slices/comparisonSlice';
import PropertyCard from '../components/PropertyCard';
import ComparisonTool from '../components/ComparisonTool';
import { Search, SlidersHorizontal, RefreshCw, Layers, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ListingsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux Selectors
  const { properties, loading, totalCount, totalPages, currentPage, filters } = useAppSelector(
    (state) => state.properties
  );
  const { compareList, isOpen: comparisonOpen } = useAppSelector((state) => state.comparison);

  // Mobile Filter Drawer Local State
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Parse filters from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlSearch = params.get('search') || '';
    const urlType = params.get('type');
    const urlMax = params.get('maxPrice') || '';
    const urlStatus = params.get('status') || '';

    dispatch(
      setUrlFilters({
        search: urlSearch,
        selectedTypes: urlType ? [urlType] : [],
        maxPrice: urlMax,
        status: urlStatus,
      })
    );
  }, [location.search, dispatch]);

  // Fetch properties when filters or pagination changes
  useEffect(() => {
    dispatch(fetchProperties());
  }, [
    filters.search,
    filters.minPrice,
    filters.maxPrice,
    filters.selectedTypes,
    filters.sortBy,
    filters.status,
    currentPage,
    dispatch,
  ]);

  const handleResetFilters = () => {
    dispatch(resetFilters());
    navigate('/properties');
  };

  const handleTypeToggle = (type: string) => {
    dispatch(toggleType(type));
  };

  const handleAmenityToggle = (amenity: string) => {
    dispatch(toggleAmenity(amenity));
  };

  const handleCompareToggle = (p: any) => {
    const exists = compareList.find((item) => item.id === p.id);
    if (!exists && compareList.length >= 3) {
      alert('You can compare a maximum of 3 properties side-by-side.');
      return;
    }
    dispatch(toggleCompare(p));
  };

  const filterContent = (
    <div className="space-y-stack-lg">
      {/* Price Range */}
      <section className="border-b border-outline-variant/20 pb-6">
        <h3 className="font-label-md text-label-md text-on-background mb-4 uppercase tracking-wider font-bold">
          Price Range
        </h3>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-[10px] text-outline block mb-1 font-bold">MIN</label>
            <input
              type="number"
              placeholder="$0"
              value={filters.minPrice}
              onChange={(e) => dispatch(setMinPrice(e.target.value))}
              className="w-full px-3 py-2 bg-surface border border-outline-variant/50 rounded-md text-sm text-on-background focus:border-primary focus:ring-0 dark:bg-surface-container"
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] text-outline block mb-1 font-bold">MAX</label>
            <input
              type="number"
              placeholder="Any"
              value={filters.maxPrice}
              onChange={(e) => dispatch(setMaxPrice(e.target.value))}
              className="w-full px-3 py-2 bg-surface border border-outline-variant/50 rounded-md text-sm text-on-background focus:border-primary focus:ring-0 dark:bg-surface-container"
            />
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="border-b border-outline-variant/20 pb-6">
        <h3 className="font-label-md text-label-md text-on-background mb-4 uppercase tracking-wider font-bold">
          Property Type
        </h3>
        <div className="space-y-2.5">
          {['House', 'Apartment', 'Villa', 'Land'].map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.selectedTypes.includes(type)}
                onChange={() => handleTypeToggle(type)}
                className="rounded border-outline-variant/60 text-primary focus:ring-primary h-4.5 w-4.5 dark:bg-surface-container"
              />
              <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">
                {type}s
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Amenities */}
      <section className="border-b border-outline-variant/20 pb-6">
        <h3 className="font-label-md text-label-md text-on-background mb-4 uppercase tracking-wider font-bold">
          Amenities
        </h3>
        <div className="space-y-2.5">
          {[
            'Zero-edge Infinity Pool',
            '6-Car Gallery Garage',
            '12-Seat Dolby Atmos Cinema',
            'Wellness Center & Dry Sauna',
          ].map((amenity) => (
            <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.selectedAmenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="rounded border-outline-variant/60 text-primary focus:ring-primary h-4.5 w-4.5 dark:bg-surface-container"
              />
              <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors truncate max-w-[180px]">
                {amenity}
              </span>
            </label>
          ))}
        </div>
      </section>

      <button
        onClick={handleResetFilters}
        className="w-full py-3 bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md rounded-lg transition-colors flex items-center justify-center gap-1.5 font-bold"
      >
        <RefreshCw className="h-4 w-4" />
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="max-w-container-max mx-auto px-gutter py-8 transition-colors mt-4 relative">
      {/* Search Header Row */}
      <div className="mb-stack-lg flex flex-col md:flex-row md:items-end justify-between gap-stack-md">
        <div>
          <h1 className="font-headline-xl text-headline-xl mb-2">Find your next home</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Explore premium properties listed across the country.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center justify-center gap-1.5 px-4 py-2.5 bg-surface-container border border-outline-variant/60 rounded-lg text-primary font-label-md text-label-md active:scale-95 transition-all font-bold"
          >
            <SlidersHorizontal className="h-4.5 w-4.5" />
            Filters
          </button>
          
          <div className="relative flex-grow md:w-80 group pointer-events-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors h-4 w-4" />
            <input
              type="text"
              placeholder="City, neighborhood, or zip"
              value={filters.search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body-md text-body-md text-on-background placeholder:text-outline"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            {filterContent}
          </div>
        </aside>

        {/* Listings content grid */}
        <div className="flex-grow space-y-stack-lg">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant">
              Showing {properties.length} of {totalCount} properties
            </span>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline font-label-md text-label-md text-outline">
                Sort by:
              </span>
              <select
                value={filters.sortBy}
                onChange={(e) => dispatch(setSortBy(e.target.value))}
                className="bg-transparent border-none font-label-md text-label-md text-primary focus:ring-0 cursor-pointer font-bold py-1 pl-0 pr-8"
              >
                <option className="text-slate-800" value="Newest Listings">Newest Listings</option>
                <option className="text-slate-800" value="Price: Low to High">Price: Low to High</option>
                <option className="text-slate-800" value="Price: High to Low">Price: High to Low</option>
                <option className="text-slate-800" value="Square Footage">Square Footage</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse bg-surface-container-low h-96 rounded-lg border border-outline-variant/30"
                />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20 bg-surface rounded-xl border border-outline-variant/20">
              <p className="text-on-surface-variant font-body-lg text-body-lg">
                No properties match your current filter settings.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-bold"
              >
                Clear Search criteria
              </button>
            </div>
          ) : (
            <motion.div 
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08
                  }
                }
              }}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {properties.map((p) => {
                const isCompared = !!compareList.find((item) => item.id === p.id);
                return (
                  <motion.div 
                    key={p.id} 
                    variants={{
                      hidden: { y: 20, opacity: 0 },
                      show: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }
                    }}
                    className="relative group/card"
                  >
                    <PropertyCard property={p} />
                    {/* Add to compare quick check overlay */}
                    <button
                      onClick={() => handleCompareToggle(p)}
                      className={`absolute bottom-[80px] right-4 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md z-30 transition-all border ${
                        isCompared
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50 dark:bg-surface-container-high dark:text-on-background dark:border-outline-variant/50'
                      }`}
                    >
                      {isCompared ? 'Comparing' : '+ Compare'}
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => dispatch(setPage(Math.max(currentPage - 1, 1)))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-full border border-outline-variant/40 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                &larr;
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => dispatch(setPage(idx + 1))}
                  className={`w-10 h-10 rounded-full font-label-md text-label-md ${
                    currentPage === idx + 1
                      ? 'bg-primary text-on-primary font-bold'
                      : 'border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low transition-colors'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => dispatch(setPage(Math.min(currentPage + 1, totalPages)))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-full border border-outline-variant/40 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                &rarr;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating comparison alert bar */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 right-6 z-40 bg-surface border border-outline-variant/30 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border-l-4 border-l-primary"
          >
            <span className="font-label-md text-label-md text-on-surface">
              {compareList.length} Property Selected for comparison
            </span>
            <button
              onClick={() => dispatch(setIsOpen(true))}
              className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md font-bold flex items-center gap-1 hover:opacity-90 active:scale-95 transition-all"
            >
              <Layers className="h-4 w-4" />
              Compare
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Overlay Matrix */}
      {comparisonOpen && (
        <ComparisonTool
          properties={compareList}
          onRemove={(id) => dispatch(removeFromCompare(id))}
          onClose={() => dispatch(setIsOpen(false))}
        />
      )}

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-start">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="absolute inset-0 bg-black"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 bg-surface p-6 shadow-2xl overflow-y-auto flex flex-col justify-between border-r border-outline-variant/30 h-full"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-headline-md text-headline-md text-on-background font-bold">Filters</h2>
                  <button onClick={() => setMobileFiltersOpen(false)} className="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {filterContent}
              </div>
              
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full mt-8 py-3 bg-primary text-on-primary font-label-md text-label-md rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all"
              >
                Apply Filters
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ListingsPage;
