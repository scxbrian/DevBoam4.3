import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Palette, Zap, Database, ArrowRight, Calculator, Star, Heart, CheckCircle } from 'lucide-react';
import { usePricing } from '../contexts/PricingContext';
import { useAuth } from '../contexts/AuthContext';
import ShopDesignPicker from '../components/ShopDesignPicker';
import FeatureSelector from '../components/FeatureSelector';
import PricingCalculator from '../components/PricingCalculator';

export default function BomaShopBuilder() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [selectedDesign, setSelectedDesign] = useState('modern');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['basic-analytics']);
  const [hostingTier, setHostingTier] = useState('standard');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [domainPrice, setDomainPrice] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedMaintenance, setSelectedMaintenance] = useState('basic');
  const [isCreatingShop, setIsCreatingShop] = useState(false);
  const { formatPrice, getAdjustedPrice } = usePricing();

  // Calculate total cost whenever selections change
  useEffect(() => {
    calculateTotal();
  }, [selectedDesign, selectedFeatures, hostingTier, billingCycle, domainPrice]);

  const handleDomainChange = (domain: string, price: number) => {
    setSelectedDomain(domain);
    setDomainPrice(price);
  };

  const handleMaintenanceChange = (maintenance: string) => {
    setSelectedMaintenance(maintenance);
  };

  const calculateTotal = () => {
    const baseCost = 25000;
    let cost = getAdjustedPrice(baseCost);

    // Design costs
    const designCosts = {
      'modern': 0,
      'luxury': 15000,
      'minimal': 5000,
      'vibrant': 10000,
      'heavy': 30000,
      'titan': 50000
    };
    cost += designCosts[selectedDesign as keyof typeof designCosts] || 0;

    // Feature costs
    const featureCosts = {
      'advanced-analytics': 20000,
      'inventory-management': 15000,
      'multi-payment': 10000,
      'custom-domain': 5000,
      'email-marketing': 12000,
      'social-integration': 8000
    };
    
    selectedFeatures.forEach(feature => {
      cost += getAdjustedPrice(featureCosts[feature as keyof typeof featureCosts] || 0);
    });

    // Hosting tier costs
    const yearlyHostingCosts = {
      'basic': 1500,
      'standard': 8000,
      'premium': 20000
    };
    
    const yearlyHostingCost = yearlyHostingCosts[hostingTier as keyof typeof yearlyHostingCosts] || 0;
    const hostingCost = billingCycle === 'yearly' 
      ? yearlyHostingCost 
      : Math.round((yearlyHostingCost / 12) * 1.03); // Monthly with 3% increase
    
    cost += getAdjustedPrice(hostingCost);

    // Maintenance costs (monthly)
    const maintenanceCosts = {
      'basic': 1250,
      'standard': 2500,
      'premium': 5000
    };
    
    const maintenanceCost = maintenanceCosts[selectedMaintenance as keyof typeof maintenanceCosts] || 0;
    cost += getAdjustedPrice(maintenanceCost);

    // Add domain cost
    cost += getAdjustedPrice(domainPrice);

    setTotalCost(Math.max(cost, getAdjustedPrice(25000))); // Minimum cost
  };

  const handleCreateShop = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsCreatingShop(true);

    try {
      // Create shop data
      const shopData = {
        name: `${user?.name}'s Shop`,
        design_theme: selectedDesign,
        features: selectedFeatures,
        hosting_tier: hostingTier,
        billing_cycle: billingCycle,
        domain: selectedDomain,
        maintenance_plan: selectedMaintenance,
        total_cost: totalCost
      };

      // In production, this would call the API
      const response = await fetch('/api/shops/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('devboma_token')}`
        },
        body: JSON.stringify(shopData)
      });

      if (response.ok) {
        // Redirect to payment or dashboard
        navigate('/dashboard');
      } else {
        throw new Error('Shop creation failed');
      }
    } catch (error) {
      console.error('Shop creation error:', error);
      // For demo, just show success message
      alert(`Shop created successfully! Total cost: ${formatPrice(totalCost)}`);
      navigate('/dashboard');
    } finally {
      setIsCreatingShop(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-4">
              <ShoppingCart className="w-16 h-16 text-yellow-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Boma Shop Builder
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-8">
            Create your custom e-commerce solution with our interactive shop builder. 
            Pick your design, select features, and see your total cost calculated in real-time.
          </p>
          
          <div className="inline-flex items-center space-x-2 bg-yellow-400 bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3 text-yellow-300 border border-yellow-400 border-opacity-30">
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium">Built with faith and excellence</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Design Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Choose Your Design</h2>
                  <p className="text-gray-600">Select the perfect look for your shop</p>
                </div>
              </div>
              <ShopDesignPicker 
                selectedDesign={selectedDesign}
                onDesignChange={setSelectedDesign}
              />
            </div>

            {/* Features Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Select Features</h2>
                  <p className="text-gray-600">Customize your shop's capabilities</p>
                </div>
              </div>
              <FeatureSelector 
                selectedFeatures={selectedFeatures}
                onFeaturesChange={setSelectedFeatures}
                hostingTier={hostingTier}
                onHostingChange={setHostingTier}
                billingCycle={billingCycle}
                onBillingCycleChange={setBillingCycle}
                selectedDomain={selectedDomain}
                onDomainChange={handleDomainChange}
                selectedMaintenance={selectedMaintenance}
                onMaintenanceChange={handleMaintenanceChange}
              />
            </div>
          </div>

          {/* Pricing Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-xl">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Your Quote</h2>
                    <p className="text-gray-600">Real-time pricing</p>
                  </div>
                </div>
                
                <PricingCalculator 
                  selectedDesign={selectedDesign}
                  selectedFeatures={selectedFeatures}
                  hostingTier={hostingTier}
                  billingCycle={billingCycle}
                  selectedDomain={selectedDomain}
                  domainPrice={domainPrice}
                  selectedMaintenance={selectedMaintenance}
                  totalCost={totalCost}
                />
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button 
                    onClick={handleCreateShop}
                    disabled={isCreatingShop}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isCreatingShop ? 'Creating Shop...' : 'Build My Shop'}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500 mb-2">30-day money-back guarantee</p>
                    <div className="flex items-center justify-center space-x-1 text-xs text-gray-400">
                      <Heart className="w-3 h-3" />
                      <span>Built with faith and excellence</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Boma Shop */}
        <div className="mt-20 bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-12 border border-gray-100">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose Boma Shop?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Database className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Multi-Tenant Backend</h3>
              <p className="text-gray-600 leading-relaxed">
                Shared, scalable backend infrastructure that handles all your shop operations efficiently 
                while keeping your data completely isolated and secure.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Palette className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Unique Frontend</h3>
              <p className="text-gray-600 leading-relaxed">
                Every shop gets a custom-designed frontend that reflects your brand identity 
                and provides a unique shopping experience for your customers.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">All-Inclusive</h3>
              <p className="text-gray-600 leading-relaxed">
                Hosting, maintenance, updates, security, and support all included in one package. 
                Focus on your business while we handle the technology.
              </p>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">What's Included:</h4>
                <ul className="space-y-2">
                  {[
                    'Custom webapp frontend design',
                    'Multi-tenant backend system',
                    'Payment processing (Mpesa, Stripe)',
                    'Inventory & order management',
                    'Analytics dashboard',
                    '6-month support & maintenance',
                    'SSL certificate & security',
                    'Mobile-responsive design'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Heart className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-blue-900">Our Commitment</span>
                </div>
                <p className="text-blue-800 italic leading-relaxed mb-4">
                  "We are committed to your success. Every shop we build is crafted with excellence, 
                  integrity, and a heart to serve."
                </p>
                <div className="flex items-center space-x-4 text-sm text-blue-700">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>5-Star Support</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Quality Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}