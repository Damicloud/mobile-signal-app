import React, { useState, useEffect } from 'react';
import { Search, Signal, X, MapPin, Wifi } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { mockSignalData, networks } from '../mockData/location';

const SignalStrengthApp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  
  // New state for API integration
  const [lagosLocations, setLagosLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Lagos locations from your API
  useEffect(() => {
    const fetchLagosLocations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('https://mobilesignalbackends.vercel.app/api/locations');
        
        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Convert API response to the format expected by the component
          const formattedLocations = data.locations.map((location, index) => ({
            id: index + 1,
            name: location,
            state: 'Lagos State' // All are Lagos locations
          }));
          setLagosLocations(formattedLocations);
        } else {
          setError('Failed to load locations');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error('Error fetching Lagos locations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLagosLocations();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLocations([]);
      setShowDropdown(false);
      setNotFound(false);
      return;
    }

    // Filter using Lagos locations from API instead of mockLocations
    const filtered = lagosLocations.filter(location =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.state.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredLocations(filtered);
    setShowDropdown(filtered.length > 0);
    setNotFound(filtered.length === 0);
  }, [searchTerm, lagosLocations]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSearchTerm(location.name);
    setShowDropdown(false);
    setNotFound(false);
  };

  const handleSearch = () => {
    if (selectedLocation) {
      setShowModal(true);
    } else if (searchTerm.trim() !== '') {
      setNotFound(true);
    }
  };

  const getSignalStrength = (location, network) => {
    const data = mockSignalData[location.name];
    if (!data) return 0;
    
    if (network === 'all') {
      return Math.round((data.mtn + data.airtel + data.glo + data['9mobile']) / 4);
    }
    
    return data[network] || 0;
  };

  const getSignalColor = (strength) => {
    if (strength >= 90) return 'text-green-600';
    if (strength >= 75) return 'text-yellow-600';
    if (strength >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSignalBars = (strength) => {
    const bars = Math.ceil(strength / 25);
    return Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className={`w-1 ${i < bars ? 'bg-current' : 'bg-gray-300'} rounded-sm`}
        style={{ height: `${(i + 1) * 6}px` }}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Signal className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Network Signal Finder
          </h1>
          <p className="text-gray-600">
            Check mobile network strength across Lagos
          </p>
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading Lagos locations...</p>
            </div>
          </div>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50 mb-6">
            <X className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">
              {error}. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="space-y-4">
            {/* Location Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Location
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter Lagos area name..."
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
              
              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredLocations.map((location) => (
                    <div
                      key={location.id}
                      onClick={() => handleLocationSelect(location)}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">{location.name}</div>
                          <div className="text-sm text-gray-500">{location.state}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Network Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Network
              </label>
              <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {networks.map((network) => (
                    <SelectItem key={network.id} value={network.id}>
                      {network.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              disabled={!selectedLocation || loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Check Signal Strength
            </Button>

            {/* Not Found Message */}
            {notFound && (
              <Alert className="border-red-200 bg-red-50">
                <X className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-700">
                  Location not found. Please try a different Lagos area.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Quick Access */}
        {!loading && lagosLocations.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Lagos Areas</h3>
            <div className="grid grid-cols-2 gap-3">
              {lagosLocations.slice(0, 6).map((location) => (
                <Button
                  key={location.id}
                  onClick={() => handleLocationSelect(location)}
                  variant="outline"
                  className="h-auto p-3 text-left justify-start border-gray-200 hover:bg-gray-50"
                >
                  <div>
                    <div className="font-medium text-gray-900">{location.name}</div>
                    <div className="text-sm text-gray-500">{location.state}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedLocation?.name}
            </DialogTitle>
            <p className="text-gray-600">{selectedLocation?.state}</p>
          </DialogHeader>

          {/* Signal Strength Display */}
          <div className="space-y-4">
            {selectedLocation && selectedNetwork === 'all' ? (
              networks.slice(1).map((network) => {
                const strength = getSignalStrength(selectedLocation, network.id);
                return (
                  <div key={network.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${network.color} mr-3`} />
                        <span className="font-medium text-gray-900">{network.name}</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${getSignalColor(strength)}`}>
                        <div className="flex items-end space-x-1">
                          {getSignalBars(strength)}
                        </div>
                        <span className="font-bold">{strength}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${network.color}`}
                        style={{ width: `${strength}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : selectedLocation ? (
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <Wifi className={`h-12 w-12 ${getSignalColor(getSignalStrength(selectedLocation, selectedNetwork))}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {networks.find(n => n.id === selectedNetwork)?.name} Signal
                  </h3>
                  <div className={`text-4xl font-bold mb-2 ${getSignalColor(getSignalStrength(selectedLocation, selectedNetwork))}`}>
                    {getSignalStrength(selectedLocation, selectedNetwork)}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${networks.find(n => n.id === selectedNetwork)?.color}`}
                      style={{ width: `${getSignalStrength(selectedLocation, selectedNetwork)}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <p className="text-sm text-gray-600 text-center">
                <span className="font-medium">Last updated:</span> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignalStrengthApp;