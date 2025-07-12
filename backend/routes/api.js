const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Load locations data
const loadLocationsData = () => {
  try {
    const dataPath = path.join(__dirname, '../data/locations.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading locations data:', error);
    return {};
  }
};

// Get all available locations
router.get('/locations', (req, res) => {
  try {
    const locationsData = loadLocationsData();
    const locations = Object.keys(locationsData);
    
    res.json({
      success: true,
      count: locations.length,
      locations: locations,
      message: 'All available Lagos locations retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving locations',
      error: error.message
    });
  }
});

// Get signal strength for a specific location (all networks)
router.get('/signal/:location', (req, res) => {
  try {
    const location = req.params.location;
    const locationsData = loadLocationsData();
    
    // Case-insensitive search
    const locationKey = Object.keys(locationsData).find(
      key => key.toLowerCase() === location.toLowerCase()
    );
    
    if (!locationKey) {
      return res.status(404).json({
        success: false,
        message: `No data found for location: ${location}`,
        suggestion: 'Please check available locations using /api/locations'
      });
    }
    
    const signalData = locationsData[locationKey];
    
    res.json({
      success: true,
      location: locationKey,
      signals: signalData,
      message: `Signal strength data for ${locationKey} retrieved successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving signal data',
      error: error.message
    });
  }
});

// Get signal strength for a specific network in a location
router.get('/signal/:location/:network', (req, res) => {
  try {
    const location = req.params.location;
    const network = req.params.network;
    const locationsData = loadLocationsData();
    
    // Case-insensitive search for location
    const locationKey = Object.keys(locationsData).find(
      key => key.toLowerCase() === location.toLowerCase()
    );
    
    if (!locationKey) {
      return res.status(404).json({
        success: false,
        message: `No data found for location: ${location}`,
        suggestion: 'Please check available locations using /api/locations'
      });
    }
    
    const signalData = locationsData[locationKey];
    
    // Case-insensitive search for network
    const networkKey = Object.keys(signalData).find(
      key => key.toLowerCase() === network.toLowerCase()
    );
    
    if (!networkKey) {
      return res.status(404).json({
        success: false,
        message: `No data found for network: ${network} in ${locationKey}`,
        availableNetworks: Object.keys(signalData),
        suggestion: 'Available networks: MTN, Airtel, Glo, 9mobile'
      });
    }
    
    res.json({
      success: true,
      location: locationKey,
      network: networkKey,
      strength: signalData[networkKey],
      message: `${networkKey} signal strength in ${locationKey} retrieved successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving network signal data',
      error: error.message
    });
  }
});

// Search locations (bonus endpoint)
router.get('/search/:query', (req, res) => {
  try {
    const query = req.params.query.toLowerCase();
    const locationsData = loadLocationsData();
    
    const matchingLocations = Object.keys(locationsData).filter(location =>
      location.toLowerCase().includes(query)
    );
    
    if (matchingLocations.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No locations found matching: ${query}`,
        suggestion: 'Try a different search term'
      });
    }
    
    const results = matchingLocations.map(location => ({
      location: location,
      signals: locationsData[location]
    }));
    
    res.json({
      success: true,
      query: query,
      count: matchingLocations.length,
      results: results,
      message: `Found ${matchingLocations.length} location(s) matching your search`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching locations',
      error: error.message
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  const locationsData = loadLocationsData();
  const locationCount = Object.keys(locationsData).length;
  
  res.json({
    success: true,
    message: 'Mobile Signal API is healthy!',
    status: 'online',
    timestamp: new Date().toISOString(),
    data: {
      totalLocations: locationCount,
      networks: ['MTN', 'Airtel', 'Glo', '9mobile'],
      endpoints: {
        locations: '/api/locations',
        signal: '/api/signal/:location',
        network: '/api/signal/:location/:network',
        search: '/api/search/:query'
      }
    }
  });
});

module.exports = router;