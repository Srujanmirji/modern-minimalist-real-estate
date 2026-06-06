import React, { useEffect } from 'react';
import api from '../services/api';
import ComparisonTool from '../components/ComparisonTool';
import Calculators from '../components/Calculators';
import { Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleCompare, removeFromCompare } from '../store/slices/comparisonSlice';
import type { Property } from '../store/slices/propertiesSlice';
import { motion } from 'framer-motion';

const ComparisonPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const compareList = useAppSelector((state) => state.comparison.compareList);

  // If comparison list is empty on mount, load 3 default properties as a starter workspace demo
  useEffect(() => {
    if (compareList.length === 0) {
      const fetchDemoProperties = async () => {
        try {
          const response = await api.get('/properties');
          const demoProps = response.data.properties.slice(0, 3) as Property[];
          demoProps.forEach((p) => {
            dispatch(toggleCompare(p));
          });
        } catch (error) {
          console.error('Error fetching demo properties for compare page:', error);
        }
      };
      fetchDemoProperties();
    }
  }, [compareList.length, dispatch]);

  const handleRemoveProperty = (id: string) => {
    dispatch(removeFromCompare(id));
  };

  return (
    <div className="max-w-container-max mx-auto px-gutter py-8 space-y-12 transition-colors mt-4">
      {/* Header Info */}
      <div className="space-y-2">
        <h1 className="font-headline-xl text-headline-xl text-primary font-bold">Financial Workspace</h1>
        <p className="text-on-surface-variant font-body-lg">
          Evaluate purchase rates side-by-side, estimate monthly mortgage payments, and analyze rental ROI yields.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Side-by-side comparison table card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-8 bg-surface border border-outline-variant/30 rounded-xl p-6 shadow-sm space-y-6 dark:bg-surface-container-low"
        >
          <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-4">
            <Layers className="h-5 w-5 text-primary" />
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Property Comparison Matrix</h2>
          </div>

          {compareList.length === 0 ? (
            <div className="text-center py-12 text-outline text-sm">
              No properties selected for comparison. Go to{' '}
              <Link to="/properties" className="text-primary underline">
                Listings
              </Link>{' '}
              to select items.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-outline-variant/25">
                    <th className="py-3 pr-4 text-xs font-bold text-outline uppercase">Spec Sheet</th>
                    {compareList.map((p) => (
                      <th key={p.id} className="py-3 px-4 text-sm font-bold text-on-surface w-1/3">
                        <div className="flex justify-between items-center gap-2">
                          <span className="truncate max-w-[150px]" title={p.title}>{p.title}</span>
                          <button
                            onClick={() => handleRemoveProperty(p.id)}
                            className="text-xs text-error hover:underline font-bold shrink-0"
                          >
                            Remove
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-outline-variant/15 hover:bg-surface-container-low/30 transition-colors">
                    <td className="py-3 pr-4 text-sm font-semibold text-on-surface">Price</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-sm text-primary font-bold">
                        ${p.price.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-outline-variant/15 hover:bg-surface-container-low/30 transition-colors">
                    <td className="py-3 pr-4 text-sm font-semibold text-on-surface">Location</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-xs text-on-surface-variant italic truncate max-w-[120px]" title={p.location}>
                        {p.location}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-outline-variant/15 hover:bg-surface-container-low/30 transition-colors">
                    <td className="py-3 pr-4 text-sm font-semibold text-on-surface">Specs</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-sm text-on-surface-variant font-medium">
                        {p.bedrooms} Beds • {p.bathrooms} Baths
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-outline-variant/15 hover:bg-surface-container-low/30 transition-colors">
                    <td className="py-3 pr-4 text-sm font-semibold text-on-surface">Living Area</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-sm text-on-surface-variant font-medium">
                        {p.area.toLocaleString()} sqft
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-outline-variant/15 hover:bg-surface-container-low/30 transition-colors">
                    <td className="py-3 pr-4 text-sm font-semibold text-on-surface">Rental yield ROI</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-sm text-green-600 dark:text-green-400 font-bold">
                        {p.type === 'Land' ? 'N/A' : `${((65000 / p.price) * 100).toFixed(2)}%`}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Right Column: Dynamic sliders calculations */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:col-span-4"
        >
          <Calculators />
        </motion.div>
      </div>
    </div>
  );
};

export default ComparisonPage;
