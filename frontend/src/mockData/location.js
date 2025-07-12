// Mock data for Nigerian locations
export const mockLocations = [
  { id: 1, name: 'Lagos', state: 'Lagos State', type: 'city' },
  { id: 2, name: 'Abuja', state: 'FCT', type: 'city' },
  { id: 3, name: 'Kano', state: 'Kano State', type: 'city' },
  { id: 4, name: 'Port Harcourt', state: 'Rivers State', type: 'city' },
  { id: 5, name: 'Ibadan', state: 'Oyo State', type: 'city' },
  { id: 6, name: 'Kaduna', state: 'Kaduna State', type: 'city' },
  { id: 7, name: 'Onitsha', state: 'Anambra State', type: 'city' },
  { id: 8, name: 'Aba', state: 'Abia State', type: 'city' },
  { id: 9, name: 'Enugu', state: 'Enugu State', type: 'city' },
  { id: 10, name: 'Ilorin', state: 'Kwara State', type: 'city' }
];

// Mock signal strength data
export const mockSignalData = {
  'Lagos': { mtn: 95, airtel: 90, glo: 85, '9mobile': 80 },
  'Abuja': { mtn: 93, airtel: 88, glo: 82, '9mobile': 78 },
  'Kano': { mtn: 88, airtel: 85, glo: 80, '9mobile': 75 },
  'Port Harcourt': { mtn: 90, airtel: 86, glo: 83, '9mobile': 79 },
  'Ibadan': { mtn: 87, airtel: 84, glo: 81, '9mobile': 76 },
  'Kaduna': { mtn: 86, airtel: 82, glo: 78, '9mobile': 74 },
  'Onitsha': { mtn: 89, airtel: 85, glo: 82, '9mobile': 77 },
  'Aba': { mtn: 85, airtel: 81, glo: 79, '9mobile': 73 },
  'Enugu': { mtn: 88, airtel: 84, glo: 80, '9mobile': 76 },
  'Ilorin': { mtn: 84, airtel: 80, glo: 77, '9mobile': 72 }
};

export const networks = [
  { id: 'all', name: 'All Networks', color: 'bg-blue-500' },
  { id: 'mtn', name: 'MTN', color: 'bg-yellow-500' },
  { id: 'airtel', name: 'Airtel', color: 'bg-red-500' },
  { id: 'glo', name: 'Glo', color: 'bg-green-500' },
  { id: '9mobile', name: '9mobile', color: 'bg-emerald-500' }
];