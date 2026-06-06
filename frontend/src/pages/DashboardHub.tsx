import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  LayoutDashboard, 
  Building, 
  PlusCircle, 
  Users, 
  Settings, 
  Search, 
  Bell, 
  Info, 
  FileText, 
  CheckSquare, 
  Image as ImageIcon, 
  UploadCloud, 
  Compass, 
  ChevronDown, 
  Check, 
  Trash2, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  DollarSign, 
  LogOut,
  AlertCircle,
  Plus,
  Radio
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchNotifications } from '../store/slices/notificationsSlice';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    }
  }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' as any } }
};

const DashboardHub: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'add' | 'users' | 'settings'>('add');
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State for Add New Listing
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [propertyType, setPropertyType] = useState('Residential'); // Residential matches mockup select
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [bedrooms, setBedrooms] = useState('4');
  const [bathrooms, setBathrooms] = useState('3');
  const [area, setArea] = useState('3200');
  
  // Amenities Checkboxes
  const [selectedAmenities, setSelectedAmenities] = useState({
    Pool: false,
    Gym: false,
    Parking: false,
    Garden: false,
    Security: false,
    AirCon: false,
    SmartHome: false,
    SeaView: false,
  });

  // Media upload simulation
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=300', // Fireplace
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300', // Kitchen island
  ]);
  const [imagesInputUrl, setImagesInputUrl] = useState('');

  const notificationsList = useAppSelector((state) => state.notifications.notificationsList);
  const unreadCount = useAppSelector((state) => state.notifications.unreadCount);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/dashboard');
      setData(response.data);
      dispatch(fetchNotifications());
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleBookingAction = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/bookings/${id}`, { status: newStatus });
      fetchDashboard();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handleApproveProperty = async (id: string) => {
    try {
      await api.patch(`/properties/${id}/approve`, { status: 'FOR_SALE' });
      fetchDashboard();
    } catch (error) {
      console.error('Error approving property:', error);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this property listing?')) return;
    try {
      await api.delete(`/properties/${id}`);
      fetchDashboard();
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleToggleAmenity = (name: keyof typeof selectedAmenities) => {
    setSelectedAmenities(prev => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSimulateUpload = (type: 'images' | 'floorplans') => {
    const url = prompt(`Enter image URL to simulate upload (or leave blank to prefill Unsplash demo):`);
    if (url === null) return;
    
    const demoUrl = url || (type === 'images' 
      ? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'
      : 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600');
      
    setUploadedImages(prev => [...prev, demoUrl]);
  };

  const handlePublishListing = async (statusOverride?: 'FOR_SALE' | 'PENDING_APPROVAL') => {
    if (!title || !price || !address) {
      alert('Please fill out the Property Title, Price, and Location Address.');
      return;
    }

    try {
      // Gather active checkboxes
      const amenitiesList: string[] = [];
      Object.entries(selectedAmenities).forEach(([key, val]) => {
        if (val) {
          // Format names to match database amenities
          if (key === 'AirCon') amenitiesList.push('Air Conditioning');
          else if (key === 'SmartHome') amenitiesList.push('Smart Home System');
          else if (key === 'SeaView') amenitiesList.push('Ocean View');
          else amenitiesList.push(key);
        }
      });

      // Map "Residential" PropertyType select to database property types
      const mappedType = propertyType === 'Residential' ? 'House' : propertyType;

      await api.post('/properties', {
        title,
        description: description || `Stunning ${propertyType} listing situated in premium neighborhood.`,
        price: Number(price),
        location: address,
        address,
        city: city || 'Los Angeles',
        state: 'CA',
        country: 'USA',
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        area: Number(area),
        type: mappedType,
        amenities: amenitiesList,
        images: uploadedImages,
      });

      // Clear Form
      setTitle('');
      setDescription('');
      setPrice('');
      setAddress('');
      setCity('');
      setSelectedAmenities({
        Pool: false,
        Gym: false,
        Parking: false,
        Garden: false,
        Security: false,
        AirCon: false,
        SmartHome: false,
        SeaView: false,
      });
      alert('Listing published successfully! It is now active on the platform.');
      fetchDashboard();
      setActiveTab('overview');
    } catch (error) {
      console.error('Error creating property:', error);
      alert('Failed to publish listing. Please check input parameters.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-primary">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <p className="text-on-surface-variant">Could not retrieve portal metrics.</p>
        <button onClick={fetchDashboard} className="px-4 py-2 bg-primary text-on-primary rounded">Retry</button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#faf8ff] dark:bg-[#0b1326] transition-colors duration-300">
      
      {/* LEFT SIDEBAR PANEL */}
      <aside className="w-64 bg-white dark:bg-[#060e20] border-r border-slate-100 dark:border-slate-800 flex flex-col justify-between shrink-0 p-6 z-10">
        <div className="space-y-8">
          {/* Logo */}
          <Link to="/" className="block">
            <span className="font-display-lg text-2xl font-bold text-[#004ac6] dark:text-[#adc6ff] tracking-tight">
              XYZ Homes
            </span>
          </Link>

          {/* Menu Navigation Links */}
          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'properties', label: 'Manage Properties', icon: Building },
              { id: 'add', label: 'Add New Listing', icon: PlusCircle },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg font-body-md text-body-md text-left transition-all ${
                    isSelected
                      ? 'bg-[#eeefff] dark:bg-blue-950/40 text-[#004ac6] dark:text-[#adc6ff] font-bold shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${isSelected ? 'text-[#004ac6] dark:text-[#adc6ff]' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile section */}
        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-850">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'}
              alt={user?.name || 'Admin User'}
              className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <div className="min-w-0">
              <p className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                {user?.role === 'ADMIN' ? 'Platform Manager' : 'Premium Agent'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => alert('Upgrade options: Please contact platform administrators at systems@xyzhomes.com.')}
              className="flex-grow py-2 bg-[#004ac6] hover:bg-blue-750 text-white rounded-lg text-xs font-bold transition-all active:scale-95 text-center shadow-sm"
            >
              Upgrade Plan
            </button>
            <button
              onClick={logout}
              title="Log Out"
              className="p-2 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 hover:text-error rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT DISPLAY PANEL */}
      <div className="flex-grow flex flex-col min-w-0 overflow-y-auto">
        
        {/* HEADER TOP BAR */}
        <header className="h-20 bg-white dark:bg-[#060e20] border-b border-slate-100 dark:border-slate-800 px-8 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 capitalize">
            {activeTab === 'add' ? 'Add New Listing' : activeTab === 'overview' ? 'Overview' : activeTab === 'properties' ? 'Manage Properties' : activeTab === 'users' ? 'User Management' : 'Settings'}
          </h2>

          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full bg-[#f3f4f6] dark:bg-[#131b2e] border border-transparent rounded-full py-2 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-250 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#004ac6] focus:bg-white transition-all"
              />
              <Search className="absolute left-3.5 top-2.5 text-slate-400 h-4 w-4 pointer-events-none" />
            </div>

            {/* Notifications Bell */}
            <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 transition-colors">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white" />
              )}
            </button>
          </div>
        </header>

        {/* DYNAMIC VIEWPORT BODY */}
        <main className="flex-grow p-8">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: ADD NEW LISTING FORM */}
            {activeTab === 'add' && (
              <motion.div
                key="add"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Left Form cards */}
                <div className="lg:col-span-8 space-y-8">
                  
                  {/* Basic Information */}
                  <div className="bg-white dark:bg-[#060e20] border border-slate-100 dark:border-slate-800/80 p-8 rounded-2xl shadow-sm space-y-6">
                    <h3 className="font-bold text-lg text-slate-850 dark:text-slate-100 flex items-center gap-3">
                      <FileText className="h-5 w-5 text-[#004ac6] dark:text-[#adc6ff]" />
                      Basic Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                          Property Title
                        </label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Modern Minimalist Villa in Beverly Hills"
                          className="w-full bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-800 dark:text-slate-150 focus:ring-1 focus:ring-[#004ac6] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-800 dark:text-slate-150 focus:ring-1 focus:ring-[#004ac6] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                          Property Type
                        </label>
                        <div className="relative">
                          <select
                            value={propertyType}
                            onChange={(e) => setPropertyType(e.target.value)}
                            className="w-full bg-white dark:bg-[#131b2e] bg-none border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-800 dark:text-slate-150 focus:ring-1 focus:ring-[#004ac6] outline-none cursor-pointer appearance-none pr-6"
                            style={{ backgroundImage: 'none' }}
                          >
                            <option value="Residential">Residential</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Villa">Villa</option>
                            <option value="House">House</option>
                            <option value="Commercial">Commercial</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-3.5 text-slate-400 h-4 w-4 pointer-events-none" />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                          Location Address
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Street, City, State, ZIP"
                            className="w-full bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-4 py-3 text-sm text-slate-800 dark:text-slate-150 focus:ring-1 focus:ring-[#004ac6] outline-none"
                          />
                          <MapPin className="absolute left-3.5 top-3.5 text-slate-400 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features & Amenities */}
                  <div className="bg-white dark:bg-[#060e20] border border-slate-100 dark:border-slate-800/80 p-8 rounded-2xl shadow-sm space-y-6">
                    <h3 className="font-bold text-lg text-slate-850 dark:text-slate-100 flex items-center gap-3">
                      <CheckSquare className="h-5 w-5 text-[#004ac6] dark:text-[#adc6ff]" />
                      Features & Amenities
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.keys(selectedAmenities).map((key) => {
                        const isChecked = selectedAmenities[key as keyof typeof selectedAmenities];
                        // Render standard labels
                        const labelText = key === 'AirCon' ? 'Air Con' : key === 'SmartHome' ? 'Smart Home' : key === 'SeaView' ? 'Sea View' : key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleToggleAmenity(key as any)}
                            className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                              isChecked
                                ? 'border-[#004ac6] bg-[#eeefff]/20 dark:border-[#adc6ff] dark:bg-blue-950/20 text-[#004ac6] dark:text-[#adc6ff] font-bold'
                                : 'border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="rounded text-[#004ac6] focus:ring-[#004ac6] h-4 w-4 border-slate-300 pointer-events-none"
                            />
                            <span className="text-sm font-medium">{labelText}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Property Media */}
                  <div className="bg-white dark:bg-[#060e20] border border-slate-100 dark:border-slate-800/80 p-8 rounded-2xl shadow-sm space-y-6">
                    <h3 className="font-bold text-lg text-slate-850 dark:text-slate-100 flex items-center gap-3">
                      <ImageIcon className="h-5 w-5 text-[#004ac6] dark:text-[#adc6ff]" />
                      Property Media
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Slot 1: High-Res Images */}
                      <div
                        onClick={() => handleSimulateUpload('images')}
                        className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-[#004ac6] dark:hover:border-[#adc6ff] rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer transition-colors"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#eeefff] dark:bg-blue-950/50 flex items-center justify-center text-[#004ac6] dark:text-[#adc6ff] mb-3">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-200">High-Res Images</span>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[200px]">
                          Drop your photos here or click to browse. Max 20MB.
                        </p>
                      </div>

                      {/* Slot 2: Floor Plans */}
                      <div
                        onClick={() => handleSimulateUpload('floorplans')}
                        className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-[#004ac6] dark:hover:border-[#adc6ff] rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer transition-colors"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#eeefff] dark:bg-blue-950/50 flex items-center justify-center text-[#004ac6] dark:text-[#adc6ff] mb-3">
                          <Compass className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Floor Plans</span>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[200px]">
                          PDF or High-res PNG/JPG for property layouts.
                        </p>
                      </div>
                    </div>

                    {/* Thumbnail Row */}
                    <div className="flex flex-wrap gap-4 pt-4">
                      {uploadedImages.map((url, idx) => (
                        <div key={idx} className="relative w-24 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                          <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleSimulateUpload('images')}
                        className="w-24 h-20 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-500 transition-colors"
                      >
                        <Plus className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Right side stats sidebar */}
                <div className="lg:col-span-4 space-y-8">
                  
                  {/* Listing Status */}
                  <div className="bg-white dark:bg-[#060e20] border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-6">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                      Listing Status
                    </h3>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 dark:text-slate-500 font-medium">Visibility</span>
                        <span className="px-2.5 py-0.5 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase rounded">
                          DRAFT
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-t border-slate-50 dark:border-slate-850 pt-3">
                        <span className="text-slate-400 dark:text-slate-500 font-medium">Created By</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Current Admin</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-t border-slate-50 dark:border-slate-850 pt-3">
                        <span className="text-slate-400 dark:text-slate-500 font-medium">Last Saved</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Not yet saved</span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-850">
                      <button
                        type="button"
                        onClick={() => handlePublishListing()}
                        className="w-full py-3 bg-[#004ac6] dark:bg-primary text-white dark:text-on-primary font-bold rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-blue-750 dark:hover:bg-blue-300 transition-all active:scale-95 shadow-sm"
                      >
                        <Radio className="h-4 w-4" />
                        Publish Listing
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          alert('Draft saved locally.');
                          fetchDashboard();
                        }}
                        className="w-full py-3 border border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-350 font-bold rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                      >
                        Save as Draft
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setTitle('');
                          setDescription('');
                          setPrice('');
                          setAddress('');
                        }}
                        className="w-full py-3 border border-slate-200 dark:border-slate-850 text-red-500 hover:text-red-700 font-bold rounded-lg text-sm hover:bg-red-50/20 dark:hover:bg-red-950/20 transition-colors"
                      >
                        Discard Changes
                      </button>
                    </div>
                  </div>

                  {/* Pro Tip Card */}
                  <div className="bg-[#eeefff]/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/30 p-5 rounded-2xl flex gap-3.5">
                    <Info className="h-5 w-5 text-[#004ac6] dark:text-[#adc6ff] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#004ac6] dark:text-[#adc6ff] text-xs uppercase tracking-wider block">Pro Tip</span>
                      <p className="text-[#004ac6] dark:text-[#adc6ff] text-xs font-medium mt-1 leading-relaxed">
                        High-res images increase engagement by 40%. Ensure your property has at least 5 clear shots.
                      </p>
                    </div>
                  </div>

                  {/* Live Preview Card */}
                  <div className="bg-white dark:bg-[#060e20] border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
                    <div className="relative h-44 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400"
                        alt="Live Preview"
                        className="w-full h-full object-cover brightness-95"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-[#004ac6] dark:text-[#adc6ff] px-3.5 py-1.5 text-[10px] font-bold uppercase rounded-full border border-slate-200/50 dark:border-slate-800/50 tracking-wider shadow-sm">
                          LIVE PREVIEW
                        </span>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      {/* Loading Placeholders */}
                      <div className="h-4 bg-slate-100 dark:bg-slate-900 rounded-full w-[80%] animate-pulse" />
                      <div className="h-3 bg-slate-100 dark:bg-slate-900 rounded-full w-[50%] animate-pulse" />
                      <div className="flex gap-2 pt-2">
                        <div className="h-6 bg-slate-100 dark:bg-slate-900 rounded-full w-16 animate-pulse" />
                        <div className="h-6 bg-slate-100 dark:bg-slate-900 rounded-full w-16 animate-pulse" />
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* TAB 2: OVERVIEW STATS & APPROVALS */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-[#060e20] border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">Total Users</span>
                      <h3 className="font-headline-xl text-3xl text-slate-800 dark:text-slate-100 mt-2 font-bold">{data.stats.totalUsers}</h3>
                    </div>
                    <Users className="h-8 w-8 text-slate-300" />
                  </div>
                  <div className="bg-white dark:bg-[#060e20] border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">Active Listings</span>
                      <h3 className="font-headline-xl text-3xl text-slate-800 dark:text-slate-100 mt-2 font-bold">{data.stats.totalProperties}</h3>
                    </div>
                    <Building className="h-8 w-8 text-slate-300" />
                  </div>
                  <div className="bg-white dark:bg-[#060e20] border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">Pending Approvals</span>
                      <h3 className="font-headline-xl text-3xl text-[#004ac6] dark:text-[#adc6ff] mt-2 font-bold">{data.stats.pendingApprovals}</h3>
                    </div>
                    <Info className="h-8 w-8 text-[#004ac6] dark:text-[#adc6ff]" />
                  </div>
                  <div className="bg-white dark:bg-[#060e20] border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">Active Bookings</span>
                      <h3 className="font-headline-xl text-3xl text-slate-800 dark:text-slate-100 mt-2 font-bold">{data.stats.activeBookings}</h3>
                    </div>
                    <Calendar className="h-8 w-8 text-slate-300" />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Pending Approvals Queue */}
                  <div className="lg:col-span-8 bg-white dark:bg-[#060e20] p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-4 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100">Properties Pending Platform Approval</h3>
                    
                    {data.pendingProperties.length === 0 ? (
                      <p className="text-slate-400 text-sm italic py-4">All property listings are currently active.</p>
                    ) : (
                      <div className="space-y-4">
                        {data.pendingProperties.map((p: any) => (
                          <div key={p.id} className="flex gap-4 p-4 bg-slate-50 dark:bg-[#131b2e] rounded-xl border border-slate-100 dark:border-slate-850 items-center justify-between">
                            <div className="flex gap-4 items-center min-w-0">
                              <img
                                src={p.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'}
                                alt={p.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div className="min-w-0">
                                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">{p.title}</h4>
                                <p className="text-xs text-slate-400 dark:text-slate-500 italic truncate">{p.location}</p>
                                <p className="text-xs text-[#004ac6] dark:text-[#adc6ff] font-bold mt-1">${p.price.toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveProperty(p.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all active:scale-95"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleDeleteProperty(p.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all active:scale-95"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick System Config panel */}
                  <div className="lg:col-span-4 bg-white dark:bg-[#060e20] p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-6 shadow-sm">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider">System Config</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-850 pb-3">
                        <span className="text-slate-400 dark:text-slate-500">Default Commission</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{data.platformSettings?.commissionRate || '5.0%'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-850 pb-3">
                        <span className="text-slate-400 dark:text-slate-500">Auto Approve Listings</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">Disabled</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 dark:text-slate-500">Portal Status</span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">ONLINE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: MANAGE PROPERTIES */}
            {activeTab === 'properties' && (
              <motion.div
                key="properties"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-[#060e20] p-8 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100">All Platform Listings</h3>
                
                {data.properties.length === 0 ? (
                  <p className="text-slate-400 text-sm italic py-4">No listings currently saved on database.</p>
                ) : (
                  <div className="space-y-4">
                    {data.properties.map((p: any) => (
                      <div key={p.id} className="flex gap-4 p-4 bg-slate-50 dark:bg-[#131b2e] rounded-xl border border-slate-100 dark:border-slate-850 items-center justify-between">
                        <div className="flex gap-4 items-center min-w-0">
                          <img
                            src={p.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'}
                            alt={p.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">{p.title}</h4>
                            <p className="text-xs text-slate-400 dark:text-slate-500 italic truncate">{p.location}</p>
                            <span className="inline-block mt-2 px-2.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">
                              Active
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteProperty(p.id)}
                          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50/20 rounded-full transition-all active:scale-95"
                          title="Remove Listing"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 4: USER MANAGEMENT */}
            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-[#060e20] p-8 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100">User Management</h3>

                <div className="space-y-4">
                  {[
                    { name: 'Sarah Connor', email: 'admin@xyzhomes.com', role: 'ADMIN', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100' },
                    { name: 'Julian Vance', email: 'agent@xyzhomes.com', role: 'AGENT', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100' },
                    { name: 'Marcus Richardson', email: 'marcus@xyzhomes.com', role: 'AGENT', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
                    { name: 'John Doe', email: 'user@xyzhomes.com', role: 'USER', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
                  ].map((u) => (
                    <div key={u.email} className="flex gap-4 p-4 bg-slate-50 dark:bg-[#131b2e] rounded-xl border border-slate-100 dark:border-slate-850 items-center justify-between">
                      <div className="flex gap-4 items-center min-w-0">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">{u.name}</h4>
                          <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{u.email}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'ADMIN' ? 'bg-[#eeefff] text-[#004ac6] dark:bg-blue-950/40 dark:text-[#adc6ff]' : u.role === 'AGENT' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB 5: SYSTEM CONFIG SETTINGS */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-[#060e20] p-8 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-6 shadow-sm max-w-2xl"
              >
                <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100">Portal Configuration</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                      Default Commission Rate (%)
                    </label>
                    <input
                      type="text"
                      defaultValue="5.0%"
                      className="w-full bg-[#f3f4f6] dark:bg-[#131b2e] border border-transparent rounded-lg px-4 py-3 text-sm text-slate-800 dark:text-slate-150 focus:ring-1 focus:ring-[#004ac6] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                      Platform Access Mode
                    </label>
                    <select
                      defaultValue="public"
                      className="w-full bg-[#f3f4f6] dark:bg-[#131b2e] border border-transparent rounded-lg px-4 py-3 text-sm text-slate-800 dark:text-slate-150 focus:ring-1 focus:ring-[#004ac6] outline-none cursor-pointer"
                    >
                      <option value="public">Public Listings Only</option>
                      <option value="private">Invite Only Listing Mode</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#131b2e] rounded-xl border border-slate-100 dark:border-slate-850">
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Auto-Approve Listings</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Allow agent listings to bypass platform approval queues.</p>
                    </div>
                    <input type="checkbox" defaultChecked={false} className="rounded text-[#004ac6] focus:ring-[#004ac6] h-5 w-5" />
                  </div>

                  <button
                    onClick={() => alert('Platform configurations updated.')}
                    className="px-6 py-2.5 bg-[#004ac6] hover:bg-blue-750 text-white rounded-lg text-sm font-bold transition-all active:scale-95"
                  >
                    Save Config
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* FOOTER */}
        <footer className="mt-auto bg-white dark:bg-[#060e20] border-t border-slate-100 dark:border-slate-800/80 px-8 py-5 shrink-0 flex justify-between items-center text-xs">
          <div className="text-slate-400 dark:text-slate-500">
            <span className="font-bold text-[#004ac6] dark:text-[#adc6ff] mr-2">XYZ Homes</span>
            © 2024 XYZ Homes Admin Portal. All rights reserved.
          </div>
          <div className="flex gap-6 text-slate-450 dark:text-slate-500 font-medium">
            <a href="#" className="hover:text-[#004ac6] dark:hover:text-[#adc6ff] transition-colors">Support</a>
            <a href="#" className="hover:text-[#004ac6] dark:hover:text-[#adc6ff] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#004ac6] dark:hover:text-[#adc6ff] transition-colors">Security</a>
            <a href="#" className="hover:text-[#004ac6] dark:hover:text-[#adc6ff] transition-colors">Privacy Policy</a>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default DashboardHub;
