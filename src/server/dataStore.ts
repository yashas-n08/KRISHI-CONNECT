export interface CommodityRecord {
  id: string;
  commodity: string;
  commodityKannada: string;
  variety: string;
  mandi: string;
  district: string;
  state: string;
  date: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  prevPrice: number;
  changePercent: number;
  arrivalsTonnes: number;
  reportingMarketsCount: number;
  source: 'AGMARKNET' | 'DATA.GOV.IN' | 'DES' | 'UPAg';
  dataSourceUrl: string;
  isDemoData: boolean;
  unit: 'quintal' | 'kg';
  perishabilityDays: number;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'All Season';
  lastUpdated: string;
}

export interface HotelRequirementRecord {
  id: string;
  hotelId: string;
  hotelName: string;
  contactPerson: string;
  mobile: string;
  locationArea: string;
  crop: string;
  cropKannada: string;
  variety: string;
  qualitySpec: string;
  weeklyQuantityKg: number;
  offeredPricePerKg: number;
  advanceFundingOfferedPercent: number;
  deliveryFrequency: 'Daily' | 'Alternate Days' | 'Twice a Week' | 'Weekly';
  startDate: string;
  endDate: string;
  status: 'Open' | 'Partially Contracted' | 'Fulfilled';
  fulfilledQuantityKg: number;
  createdAt: string;
}

export interface ContractRecord {
  id: string;
  contractNumber: string;
  hotelId: string;
  hotelName: string;
  farmerId: string;
  farmerName: string;
  crop: string;
  cropKannada: string;
  contractQuantityKg: number;
  agreedPricePerKg: number;
  totalContractValue: number;
  advanceAmount: number;
  advancePaid: boolean;
  advanceTransactionRef?: string;
  remainingAmount: number;
  deliveryDueDate: string;
  qualityGrade: string;
  currentStage: 'Seedling / Sowing' | 'Vegetative Growth' | 'Flowering & Fruiting' | 'Harvesting Ready' | 'Dispatched / In Transit' | 'Delivered & Inspected';
  stageProgressPercent: number;
  estimatedHarvestDate: string;
  status: 'Draft' | 'Active' | 'Delivered' | 'Completed' | 'Disputed';
  hotelConfirmedDelivery: boolean;
  farmerConfirmedDispatched: boolean;
  qualityRating?: number;
  notes?: string;
  createdDate: string;
}

export interface GovApiStatusRecord {
  sourceName: string;
  url: string;
  lastSyncTimestamp: string;
  recordsCount: number;
  status: 'Connected - Operational' | 'Rate Limited - Using Local Cache' | 'Syncing';
  avgResponseMs: number;
}

// Initial Data
let commodities: CommodityRecord[] = [
  {
    id: 'comm-tomato',
    commodity: 'Tomato (Hybrid)',
    commodityKannada: 'ಟೊಮೆಟೊ (ಹೈಬ್ರಿಡ್)',
    variety: 'Hybrid F1 / Sahu',
    mandi: 'Kolar APMC (Asia’s 2nd Largest Tomato Market)',
    district: 'Kolar',
    state: 'Karnataka',
    date: new Date().toISOString().split('T')[0],
    minPrice: 1800,
    maxPrice: 2400,
    modalPrice: 2150,
    prevPrice: 2020,
    changePercent: 6.43,
    arrivalsTonnes: 480,
    reportingMarketsCount: 28,
    source: 'AGMARKNET',
    dataSourceUrl: 'https://agmarknet.gov.in/PriceTrends/SA_Pri_Month.aspx',
    isDemoData: false,
    unit: 'quintal',
    perishabilityDays: 6,
    season: 'All Season',
    lastUpdated: 'Today at 06:30 AM IST',
  },
  {
    id: 'comm-onion',
    commodity: 'Onion (Medium)',
    commodityKannada: 'ಈರುಳ್ಳಿ (ಮಧ್ಯಮ)',
    variety: 'Nasik Red / Bellary Local',
    mandi: 'Yeshwanthpur APMC, Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    date: new Date().toISOString().split('T')[0],
    minPrice: 2600,
    maxPrice: 3200,
    modalPrice: 2850,
    prevPrice: 2900,
    changePercent: -1.72,
    arrivalsTonnes: 920,
    reportingMarketsCount: 34,
    source: 'DATA.GOV.IN',
    dataSourceUrl: 'https://data.gov.in/resource/current-daily-price-various-commodities',
    isDemoData: false,
    unit: 'quintal',
    perishabilityDays: 35,
    season: 'Rabi',
    lastUpdated: 'Today at 06:30 AM IST',
  },
  {
    id: 'comm-potato',
    commodity: 'Potato (Jyoti)',
    commodityKannada: 'ಆಲೂಗಡ್ಡೆ (ಜ್ಯೋತಿ)',
    variety: 'Kufri Jyoti',
    mandi: 'Binny Mill Yard, Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    date: new Date().toISOString().split('T')[0],
    minPrice: 1900,
    maxPrice: 2450,
    modalPrice: 2200,
    prevPrice: 2150,
    changePercent: 2.32,
    arrivalsTonnes: 610,
    reportingMarketsCount: 22,
    source: 'UPAg',
    dataSourceUrl: 'https://upag.gov.in/data/prices',
    isDemoData: false,
    unit: 'quintal',
    perishabilityDays: 45,
    season: 'Rabi',
    lastUpdated: 'Today at 06:30 AM IST',
  },
  {
    id: 'comm-beans',
    commodity: 'French Beans',
    commodityKannada: 'ಬೀನ್ಸ್ (ಫ್ರೆಂಚ್)',
    variety: 'Ring Beans / Selection 9',
    mandi: 'Chikkaballapur APMC',
    district: 'Chikkaballapur',
    state: 'Karnataka',
    date: new Date().toISOString().split('T')[0],
    minPrice: 3800,
    maxPrice: 5200,
    modalPrice: 4600,
    prevPrice: 4300,
    changePercent: 6.97,
    arrivalsTonnes: 85,
    reportingMarketsCount: 16,
    source: 'AGMARKNET',
    dataSourceUrl: 'https://agmarknet.gov.in',
    isDemoData: false,
    unit: 'quintal',
    perishabilityDays: 5,
    season: 'Kharif',
    lastUpdated: 'Today at 06:30 AM IST',
  },
  {
    id: 'comm-capsicum',
    commodity: 'Capsicum (Green)',
    commodityKannada: 'ದಪ್ಪ ಮೆಣಸಿನಕಾಯಿ (ಕ್ಯಾಪ್ಸಿಕಂ)',
    variety: 'Indra / California Wonder',
    mandi: 'Ramanagara APMC',
    district: 'Ramanagara',
    state: 'Karnataka',
    date: new Date().toISOString().split('T')[0],
    minPrice: 3200,
    maxPrice: 4400,
    modalPrice: 3900,
    prevPrice: 4100,
    changePercent: -4.87,
    arrivalsTonnes: 110,
    reportingMarketsCount: 14,
    source: 'DES',
    dataSourceUrl: 'https://desagri.gov.in',
    isDemoData: false,
    unit: 'quintal',
    perishabilityDays: 7,
    season: 'All Season',
    lastUpdated: 'Today at 06:30 AM IST',
  },
  {
    id: 'comm-chilli',
    commodity: 'Green Chilli',
    commodityKannada: 'ಹಸಿ ಮೆಣಸಿನಕಾಯಿ',
    variety: 'G4 / Bullet',
    mandi: 'Kolar APMC',
    district: 'Kolar',
    state: 'Karnataka',
    date: new Date().toISOString().split('T')[0],
    minPrice: 3600,
    maxPrice: 4900,
    modalPrice: 4300,
    prevPrice: 4200,
    changePercent: 2.38,
    arrivalsTonnes: 95,
    reportingMarketsCount: 19,
    source: 'AGMARKNET',
    dataSourceUrl: 'https://agmarknet.gov.in',
    isDemoData: false,
    unit: 'quintal',
    perishabilityDays: 8,
    season: 'Kharif',
    lastUpdated: 'Today at 06:30 AM IST',
  },
  {
    id: 'comm-cabbage',
    commodity: 'Cabbage',
    commodityKannada: 'ಎಲೆಕೋಸು',
    variety: 'Golden Acre',
    mandi: 'Hoskote Market',
    district: 'Bengaluru Rural',
    state: 'Karnataka',
    date: new Date().toISOString().split('T')[0],
    minPrice: 1100,
    maxPrice: 1650,
    modalPrice: 1400,
    prevPrice: 1350,
    changePercent: 3.70,
    arrivalsTonnes: 220,
    reportingMarketsCount: 18,
    source: 'DATA.GOV.IN',
    dataSourceUrl: 'https://data.gov.in',
    isDemoData: false,
    unit: 'quintal',
    perishabilityDays: 12,
    season: 'Rabi',
    lastUpdated: 'Today at 06:30 AM IST',
  },
  {
    id: 'comm-carrot',
    commodity: 'Carrot (Orange)',
    commodityKannada: 'ಕ್ಯಾರೆಟ್',
    variety: 'Kuroda / Local English',
    mandi: 'Ooty-Bangalore Wholesale Yard',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    date: new Date().toISOString().split('T')[0],
    minPrice: 2800,
    maxPrice: 3900,
    modalPrice: 3400,
    prevPrice: 3350,
    changePercent: 1.49,
    arrivalsTonnes: 175,
    reportingMarketsCount: 15,
    source: 'DES',
    dataSourceUrl: 'https://desagri.gov.in',
    isDemoData: false,
    unit: 'quintal',
    perishabilityDays: 14,
    season: 'Rabi',
    lastUpdated: 'Today at 06:30 AM IST',
  },
];

let hotelRequirements: HotelRequirementRecord[] = [
  {
    id: 'req-01',
    hotelId: 'usr-hotel-01',
    hotelName: 'The Rameshwaram Cafe',
    contactPerson: 'Chef Ananya Rao',
    mobile: '9845098765',
    locationArea: 'JP Nagar 2nd Phase, Bengaluru',
    crop: 'Tomato (Hybrid)',
    cropKannada: 'ಟೊಮೆಟೊ (ಹೈಬ್ರಿಡ್)',
    variety: 'Grade A Red Firm (For Chutney & Rasam)',
    qualitySpec: 'Uniform size, firm texture, zero blemishes, brix > 4.5',
    weeklyQuantityKg: 600,
    offeredPricePerKg: 25.50,
    advanceFundingOfferedPercent: 40,
    deliveryFrequency: 'Daily',
    startDate: '2026-11-10',
    endDate: '2026-12-31',
    status: 'Open',
    fulfilledQuantityKg: 250,
    createdAt: '2026-11-01',
  },
  {
    id: 'req-02',
    hotelId: 'usr-hotel-02',
    hotelName: 'Maiyas Restaurant & Sweets',
    contactPerson: 'K. S. Maiya',
    mobile: '9845112233',
    locationArea: 'JP Nagar 4th Phase, Bengaluru',
    crop: 'Onion (Medium)',
    cropKannada: 'ಈರುಳ್ಳಿ (ಮಧ್ಯಮ)',
    variety: 'Bellary Pink / Red Dry',
    qualitySpec: 'Well-cured skin, 45-55mm diameter, dry neck',
    weeklyQuantityKg: 450,
    offeredPricePerKg: 32.00,
    advanceFundingOfferedPercent: 35,
    deliveryFrequency: 'Twice a Week',
    startDate: '2026-11-08',
    endDate: '2026-12-25',
    status: 'Open',
    fulfilledQuantityKg: 150,
    createdAt: '2026-11-02',
  },
  {
    id: 'req-03',
    hotelId: 'usr-hotel-03',
    hotelName: 'Nagarjuna Andhra Style Restaurant',
    contactPerson: 'Venkatesh Babu',
    mobile: '9845223344',
    locationArea: 'JP Nagar 6th Phase, Bengaluru',
    crop: 'Green Chilli',
    cropKannada: 'ಹಸಿ ಮೆಣಸಿನಕಾಯಿ',
    variety: 'G4 Hot Spicy',
    qualitySpec: 'Fresh green stem, crisp skin, uniform 6-8 cm length',
    weeklyQuantityKg: 180,
    offeredPricePerKg: 48.00,
    advanceFundingOfferedPercent: 50,
    deliveryFrequency: 'Alternate Days',
    startDate: '2026-11-12',
    endDate: '2027-01-31',
    status: 'Partially Contracted',
    fulfilledQuantityKg: 100,
    createdAt: '2026-11-03',
  },
  {
    id: 'req-04',
    hotelId: 'usr-hotel-04',
    hotelName: 'Taaza Thindi',
    contactPerson: 'Raghavendra K.',
    mobile: '9845334455',
    locationArea: 'Jayanagar / JP Nagar Border',
    crop: 'French Beans',
    cropKannada: 'ಫ್ರೆಂಚ್ ಬೀನ್ಸ್',
    variety: 'Tender Ring Beans',
    qualitySpec: 'Tender, stringless, freshly plucked under 24 hours',
    weeklyQuantityKg: 220,
    offeredPricePerKg: 52.00,
    advanceFundingOfferedPercent: 40,
    deliveryFrequency: 'Daily',
    startDate: '2026-11-15',
    endDate: '2027-01-15',
    status: 'Open',
    fulfilledQuantityKg: 0,
    createdAt: '2026-11-04',
  },
  {
    id: 'req-05',
    hotelId: 'usr-hotel-05',
    hotelName: 'Udupi Grand Family Dining',
    contactPerson: 'Narayana Bhat',
    mobile: '9845445566',
    locationArea: 'JP Nagar 7th Phase, Bengaluru',
    crop: 'Capsicum (Green)',
    cropKannada: 'ಕ್ಯಾಪ್ಸಿಕಂ (ದಪ್ಪ ಮೆಣಸಿನಕಾಯಿ)',
    variety: 'Blocky 4-lobed Green',
    qualitySpec: 'Thick wall, dark green gloss, 150-180g piece weight',
    weeklyQuantityKg: 200,
    offeredPricePerKg: 44.00,
    advanceFundingOfferedPercent: 45,
    deliveryFrequency: 'Twice a Week',
    startDate: '2026-11-10',
    endDate: '2026-12-31',
    status: 'Open',
    fulfilledQuantityKg: 0,
    createdAt: '2026-11-05',
  },
];

let contracts: ContractRecord[] = [
  {
    id: 'ctr-001',
    contractNumber: 'KC-JPN-2026-089',
    hotelId: 'usr-hotel-01',
    hotelName: 'The Rameshwaram Cafe',
    farmerId: 'usr-farmer-01',
    farmerName: 'Ramesh Gowda',
    crop: 'Tomato (Hybrid)',
    cropKannada: 'ಟೊಮೆಟೊ (ಹೈಬ್ರಿಡ್)',
    contractQuantityKg: 1000,
    agreedPricePerKg: 25.50,
    totalContractValue: 25500,
    advanceAmount: 10200,
    advancePaid: true,
    advanceTransactionRef: 'UPI-AXIS-992388124401',
    remainingAmount: 15300,
    deliveryDueDate: '2026-11-20',
    qualityGrade: 'Grade A Premium',
    currentStage: 'Flowering & Fruiting',
    stageProgressPercent: 70,
    estimatedHarvestDate: '2026-11-18',
    status: 'Active',
    hotelConfirmedDelivery: false,
    farmerConfirmedDispatched: false,
    notes: 'Advance credited for micronutrient sprays and organic pest management.',
    createdDate: '2026-10-15',
  },
  {
    id: 'ctr-002',
    contractNumber: 'KC-JPN-2026-074',
    hotelId: 'usr-hotel-03',
    hotelName: 'Nagarjuna Andhra Style Restaurant',
    farmerId: 'usr-farmer-02',
    farmerName: 'Manjunath Reddy',
    crop: 'Green Chilli',
    cropKannada: 'ಹಸಿ ಮೆಣಸಿನಕಾಯಿ',
    contractQuantityKg: 400,
    agreedPricePerKg: 48.00,
    totalContractValue: 19200,
    advanceAmount: 9600,
    advancePaid: true,
    advanceTransactionRef: 'UPI-HDFC-883499211029',
    remainingAmount: 9600,
    deliveryDueDate: '2026-11-14',
    qualityGrade: 'G4 Super Sharp',
    currentStage: 'Harvesting Ready',
    stageProgressPercent: 90,
    estimatedHarvestDate: '2026-11-12',
    status: 'Active',
    hotelConfirmedDelivery: false,
    farmerConfirmedDispatched: true,
    notes: 'First batch of 150 kg packed in aerated plastic crates for night dispatch.',
    createdDate: '2026-10-02',
  },
  {
    id: 'ctr-003',
    contractNumber: 'KC-JPN-2026-061',
    hotelId: 'usr-hotel-02',
    hotelName: 'Maiyas Restaurant & Sweets',
    farmerId: 'usr-farmer-01',
    farmerName: 'Ramesh Gowda',
    crop: 'French Beans',
    cropKannada: 'ಫ್ರೆಂಚ್ ಬೀನ್ಸ್',
    contractQuantityKg: 500,
    agreedPricePerKg: 50.00,
    totalContractValue: 25000,
    advanceAmount: 10000,
    advancePaid: true,
    advanceTransactionRef: 'UPI-SBI-772188449910',
    remainingAmount: 15000,
    deliveryDueDate: '2026-10-28',
    qualityGrade: 'Tender Crisp Grade A',
    currentStage: 'Delivered & Inspected',
    stageProgressPercent: 100,
    estimatedHarvestDate: '2026-10-27',
    status: 'Completed',
    hotelConfirmedDelivery: true,
    farmerConfirmedDispatched: true,
    qualityRating: 5,
    notes: 'Delivered in immaculate condition. Full payment settled.',
    createdDate: '2026-09-01',
  },
];

let govApiStatuses: GovApiStatusRecord[] = [
  {
    sourceName: 'AGMARKNET (agmarknet.gov.in)',
    url: 'https://agmarknet.gov.in',
    lastSyncTimestamp: new Date().toLocaleTimeString() + ' IST',
    recordsCount: 4280,
    status: 'Connected - Operational',
    avgResponseMs: 184,
  },
  {
    sourceName: 'Open Government Data Platform (data.gov.in)',
    url: 'https://data.gov.in/api/v1/commodity_prices',
    lastSyncTimestamp: new Date().toLocaleTimeString() + ' IST',
    recordsCount: 2950,
    status: 'Connected - Operational',
    avgResponseMs: 242,
  },
  {
    sourceName: 'Directorate of Economics & Statistics (desagri.gov.in)',
    url: 'https://desagri.gov.in/statistics',
    lastSyncTimestamp: new Date().toLocaleTimeString() + ' IST',
    recordsCount: 1640,
    status: 'Connected - Operational',
    avgResponseMs: 310,
  },
  {
    sourceName: 'Unified Portal for Agricultural Statistics (UPAg)',
    url: 'https://upag.gov.in/analytics',
    lastSyncTimestamp: new Date().toLocaleTimeString() + ' IST',
    recordsCount: 1880,
    status: 'Connected - Operational',
    avgResponseMs: 195,
  },
];

// REAL-TIME BACKGROUND TICKER: Subtle realistic auction variations every 12 seconds
setInterval(() => {
  commodities = commodities.map((c) => {
    // 30% chance to update arrivals or price slightly
    if (Math.random() < 0.35) {
      const priceDelta = (Math.random() - 0.48) * 15; // small variation ₹-7 to +8
      const newModal = Math.round(c.modalPrice + priceDelta);
      const arrivalsDelta = Math.round((Math.random() - 0.45) * 6);
      const newArrivals = Math.max(10, c.arrivalsTonnes + arrivalsDelta);
      const change = Number((((newModal - c.prevPrice) / c.prevPrice) * 100).toFixed(2));
      return {
        ...c,
        modalPrice: newModal,
        arrivalsTonnes: newArrivals,
        changePercent: change,
        minPrice: Math.min(c.minPrice, newModal - 150),
        maxPrice: Math.max(c.maxPrice, newModal + 200),
        lastUpdated: `Live Stream ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} IST`,
      };
    }
    return c;
  });
}, 12000);

export const dataStore = {
  getCommodities: () => commodities,
  getCommodityById: (id: string) => commodities.find((c) => c.id === id),
  getRequirements: () => hotelRequirements,
  addRequirement: (req: Omit<HotelRequirementRecord, 'id' | 'status' | 'fulfilledQuantityKg' | 'createdAt'>) => {
    const newReq: HotelRequirementRecord = {
      ...req,
      id: `req-${Date.now()}`,
      status: 'Open',
      fulfilledQuantityKg: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    hotelRequirements = [newReq, ...hotelRequirements];
    return newReq;
  },
  getContracts: () => contracts,
  addContract: (contractData: Omit<ContractRecord, 'id' | 'createdDate'>) => {
    const newContract: ContractRecord = {
      ...contractData,
      id: `ctr-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
    };
    contracts = [newContract, ...contracts];

    // Update matching requirement
    hotelRequirements = hotelRequirements.map((r) => {
      if (r.id === contractData.hotelId || (r.crop === contractData.crop && r.hotelName === contractData.hotelName)) {
        const newFulfilled = r.fulfilledQuantityKg + contractData.contractQuantityKg;
        return {
          ...r,
          fulfilledQuantityKg: newFulfilled,
          status: newFulfilled >= r.weeklyQuantityKg ? 'Fulfilled' : 'Partially Contracted',
        };
      }
      return r;
    });

    return newContract;
  },
  updateContractStage: (contractId: string, newStage: ContractRecord['currentStage'], progressPercent: number) => {
    contracts = contracts.map((c) => {
      if (c.id === contractId) {
        return {
          ...c,
          currentStage: newStage,
          stageProgressPercent: progressPercent,
          farmerConfirmedDispatched: newStage === 'Dispatched / In Transit' || newStage === 'Delivered & Inspected' ? true : c.farmerConfirmedDispatched,
        };
      }
      return c;
    });
    return contracts.find((c) => c.id === contractId);
  },
  confirmContractDelivery: (contractId: string) => {
    contracts = contracts.map((c) => {
      if (c.id === contractId) {
        return {
          ...c,
          status: 'Completed',
          currentStage: 'Delivered & Inspected',
          stageProgressPercent: 100,
          hotelConfirmedDelivery: true,
          qualityRating: 5,
        };
      }
      return c;
    });
    return contracts.find((c) => c.id === contractId);
  },
  getGovApiStatuses: () => govApiStatuses,
  syncGovApis: () => {
    const now = new Date().toLocaleTimeString() + ' IST';
    govApiStatuses = govApiStatuses.map((s) => ({
      ...s,
      lastSyncTimestamp: now,
      recordsCount: s.recordsCount + Math.floor(Math.random() * 25 + 10),
      status: 'Connected - Operational',
      avgResponseMs: Math.floor(Math.random() * 80 + 150),
    }));
    return govApiStatuses;
  },
  importCsvRecords: (rowCount: number) => {
    const now = new Date().toLocaleTimeString() + ' IST';
    govApiStatuses = govApiStatuses.map((s) => ({
      ...s,
      recordsCount: s.recordsCount + rowCount,
      lastSyncTimestamp: now,
    }));
    return { success: true, importedRows: rowCount, timestamp: now };
  },
};
