export type UserRole = 'farmer' | 'hotel' | 'admin';

export type Language = 'en' | 'kn';

export interface UserProfile {
  id: string;
  name: string;
  mobile: string;
  role: UserRole;
  location: string;
  state: string;
  district: string;
  landSizeAcres?: number;
  hotelName?: string;
  avatar?: string;
  isVerified?: boolean;
}

export interface CommodityMarketData {
  id: string;
  commodity: string;
  commodityKannada: string;
  variety: string;
  mandi: string;
  district: string;
  state: string;
  date: string;
  minPrice: number;     // ₹/quintal
  maxPrice: number;     // ₹/quintal
  modalPrice: number;   // ₹/quintal
  prevPrice: number;    // ₹/quintal
  changePercent: number;
  arrivalsTonnes: number;
  reportingMarketsCount: number;
  source: 'AGMARKNET' | 'DATA.GOV.IN' | 'DES' | 'UPAg';
  dataSourceUrl: string;
  isDemoData?: boolean;
  unit: 'quintal' | 'kg';
  perishabilityDays: number;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'All Season';
}

export interface PricePredictionDay {
  dayIndex: number; // 1 to 7
  date: string;
  dayName: string;
  dayNameKn: string;
  predictedModalPrice: number; // ₹/quintal
  minExpectedPrice: number;
  maxExpectedPrice: number;
  changePercent: number;
  confidenceScore: number; // 0 - 100%
  influencingFactors: {
    name: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }[];
}

export interface ModelPerformance {
  modelName: 'SARIMA' | 'XGBoost' | 'LSTM' | 'Weighted Ensemble';
  mae: number;
  rmse: number;
  mape: number; // %
  weight: number;
  status: 'active' | 'evaluating';
}

export interface CropRecommendation {
  cropId: string;
  cropName: string;
  cropNameKannada: string;
  variety: string;
  currentModalPrice: number;       // ₹/quintal
  expectedHarvestPrice: number;    // ₹/quintal
  durationDays: number;            // days from sowing to harvest
  estimatedCostPerAcre: number;    // ₹
  estimatedYieldPerAcre: number;   // quintals
  expectedGrossRevenue: number;    // ₹ per acre
  expectedNetProfit: number;       // ₹ per acre
  profitMarginPercent: number;
  bestCaseProfit: number;
  worstCaseProfit: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  waterRequirement: 'Low' | 'Medium' | 'High';
  localHotelDemandScore: number;   // 1-100
  keyFactors: string[];
  harvestWindow: string;
}

export interface MandiComparisonItem {
  id: string;
  mandiName: string;
  mandiNameKn: string;
  district: string;
  distanceKm: number;
  modalPricePerQuintal: number;
  minPricePerQuintal: number;
  maxPricePerQuintal: number;
  arrivalTonnes: number;
  sevenDayPredictedTrend: 'rising' | 'stable' | 'falling';
  sevenDayPredictedModalPrice: number;
  transportCostPerQuintal: number; // calculated based on distance
  loadingAndMandiFeePerQuintal: number;
  netRealizedPricePerQuintal: number;
  netRealizedPricePerKg: number;
  isRecommended: boolean;
  latitude: number;
  longitude: number;
}

export interface SellingAdvisorInput {
  crop: string;
  quantityQuintals: number;
  qualityGrade: 'Grade A (Export/Premium)' | 'Grade B (Standard)' | 'Grade C (Fair)';
  harvestDate: string;
  storageAvailable: boolean;
  coldStorageAvailable: boolean;
}

export interface SellingAdvisorResult {
  decision: 'SELL NOW' | 'HOLD FOR 2 DAYS' | 'HOLD FOR 5 DAYS' | 'SELL AT ANOTHER MANDI' | 'SELL TO A REGISTERED HOTEL';
  decisionKannada: string;
  currentSellingValue: number;
  expectedFutureSellingValue: number;
  storageAndSpoilageCost: number;
  netFinancialImpact: number;
  riskAssessment: 'Low Risk' | 'Medium Risk' | 'High Risk';
  spoilagePercentageExpected: number;
  reasoning: string[];
  targetVenue: string;
}

export interface HotelRequirement {
  id: string;
  hotelId: string;
  hotelName: string;
  contactPerson: string;
  mobile: string;
  locationArea: string; // e.g. JP Nagar, Bengaluru
  crop: string;
  cropKannada: string;
  variety: string;
  qualitySpec: string;
  weeklyQuantityKg: number;
  offeredPricePerKg: number; // ₹/kg
  advanceFundingOfferedPercent: number; // e.g. 40%
  deliveryFrequency: 'Daily' | 'Alternate Days' | 'Twice a Week' | 'Weekly';
  startDate: string;
  endDate: string;
  status: 'Open' | 'Partially Contracted' | 'Fulfilled';
  fulfilledQuantityKg: number;
}

export interface FarmingContract {
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

export interface GovernmentApiSyncStatus {
  sourceName: string;
  url: string;
  lastSyncTimestamp: string;
  recordsCount: number;
  status: 'Connected - Operational' | 'Rate Limited - Using Local Cache' | 'Syncing';
  avgResponseMs: number;
}

export type IndianVoiceLanguage = 'kn' | 'hi' | 'en' | 'te' | 'ta' | 'ml' | 'mr' | 'pa';

export interface AgroVoiceMessage {
  id: string;
  sender: 'farmer' | 'agrovoice';
  text: string;
  timestamp: string;
  language: IndianVoiceLanguage;
  targetView?: string;
  audioPlayed?: boolean;
  category?: 'price' | 'mandi' | 'advisory' | 'weather' | 'navigation' | 'general';
}

export type VoiceAssistantStatus =
  | 'idle'
  | 'listening'
  | 'understanding'
  | 'searching'
  | 'speaking'
  | 'ready';

