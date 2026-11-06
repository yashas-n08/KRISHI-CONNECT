import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  COMMODITIES_MARKET_DATA,
  COMMUNITY_ANALYTICS_DATA,
  CROP_RECOMMENDATIONS_DATABASE,
  DEMO_USERS,
  FARMING_CONTRACTS_DATA,
  GOV_API_STATUS_DATA,
  HISTORICAL_PRICES,
  HOTEL_REQUIREMENTS_DATA,
  MANDI_COMPARISON_DATA,
  MODEL_PERFORMANCE_METRICS,
  SEVEN_DAY_FORECASTS,
} from './src/data/mockData.ts';
import {
  CommodityMarketData,
  CropRecommendation,
  FarmingContract,
  GovernmentApiSyncStatus,
  HotelRequirement,
  MandiComparisonItem,
  PricePredictionDay,
} from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required by guidelines
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey && geminiApiKey !== 'MY_GEMINI_API_KEY' && !geminiApiKey.includes('YOUR_') && geminiApiKey.trim().length > 10) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ==========================================
// IN-MEMORY REAL-TIME BACKEND DATABASE STORE
// ==========================================
let commoditiesStore: CommodityMarketData[] = JSON.parse(JSON.stringify(COMMODITIES_MARKET_DATA));
let contractsStore: FarmingContract[] = JSON.parse(JSON.stringify(FARMING_CONTRACTS_DATA));
let hotelReqsStore: HotelRequirement[] = JSON.parse(JSON.stringify(HOTEL_REQUIREMENTS_DATA));
let govStatusStore: GovernmentApiSyncStatus[] = JSON.parse(JSON.stringify(GOV_API_STATUS_DATA));
let liveWeatherStore = {
  location: 'Kolar & Bengaluru Rural Agro-Zone',
  temperature: 28,
  condition: 'Sunny with moderate breeze',
  humidity: 58,
  windKmH: 14,
  rainProbability48h: 0,
  advisory: 'Optimal window for tomato, beans, and chilli harvesting and open field drying.',
  updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

// Connected SSE clients for real-time broadcasts
const sseClients: Response[] = [];

function broadcastEvent(type: string, data: any) {
  const payload = `data: ${JSON.stringify({ type, data, timestamp: new Date().toISOString() })}\n\n`;
  for (let i = sseClients.length - 1; i >= 0; i--) {
    try {
      sseClients[i].write(payload);
    } catch {
      sseClients.splice(i, 1);
    }
  }
}

// Background Real-Time Market Ticker: gently simulates live mandi arrival fluctuations every 20 seconds
setInterval(() => {
  const randomIndex = Math.floor(Math.random() * commoditiesStore.length);
  const target = commoditiesStore[randomIndex];
  if (!target) return;

  const priceDeltaPercent = (Math.random() * 3 - 1.4) / 100; // -1.4% to +1.6%
  const oldPrice = target.modalPrice;
  const newPrice = Math.round(oldPrice * (1 + priceDeltaPercent));
  const arrivalDelta = Math.round((Math.random() * 20 - 9));

  target.prevPrice = oldPrice;
  target.modalPrice = newPrice;
  target.minPrice = Math.round(newPrice * 0.88);
  target.maxPrice = Math.round(newPrice * 1.14);
  target.changePercent = Number((((newPrice - target.prevPrice) / target.prevPrice) * 100).toFixed(2));
  target.arrivalsTonnes = Math.max(10, target.arrivalsTonnes + arrivalDelta);
  target.date = new Date().toISOString().split('T')[0];

  broadcastEvent('PRICE_TICK', {
    commodityId: target.id,
    commodity: target.commodity,
    modalPrice: target.modalPrice,
    changePercent: target.changePercent,
    arrivalsTonnes: target.arrivalsTonnes,
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });
}, 20000);

// ==========================================
// REST API ROUTES
// ==========================================

// 1. Server-Sent Events (SSE) for Real-Time Updates
app.get('/api/events', (req: Request, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'Krishi Connect Real-Time Stream Connected' })}\n\n`);
  sseClients.push(res);

  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
  });
});

// 2. Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    mode: isProd ? 'production' : 'development',
    geminiActive: !!ai,
    realtimeSubscribers: sseClients.length,
    timestamp: new Date().toISOString(),
  });
});

// 3. Commodities & Live Agmarknet Prices
app.get('/api/commodities', (_req: Request, res: Response) => {
  res.json({
    commodities: commoditiesStore,
    totalCount: commoditiesStore.length,
    lastSync: govStatusStore[0].lastSyncTimestamp,
  });
});

app.get('/api/commodities/:id', (req: Request, res: Response) => {
  const comm = commoditiesStore.find((c) => c.id === req.params.id);
  if (!comm) {
    res.status(404).json({ error: 'Commodity not found' });
    return;
  }
  res.json(comm);
});

// Trigger live price refresh
app.post('/api/commodities/tick', (_req: Request, res: Response) => {
  commoditiesStore = commoditiesStore.map((c) => {
    const delta = (Math.random() * 4 - 1.8) / 100;
    const newPrice = Math.round(c.modalPrice * (1 + delta));
    return {
      ...c,
      prevPrice: c.modalPrice,
      modalPrice: newPrice,
      changePercent: Number((((newPrice - c.modalPrice) / c.modalPrice) * 100).toFixed(2)),
      arrivalsTonnes: Math.max(20, c.arrivalsTonnes + Math.floor(Math.random() * 30 - 15)),
      date: new Date().toISOString().split('T')[0],
    };
  });

  broadcastEvent('FULL_COMMODITY_REFRESH', { commodities: commoditiesStore });
  res.json({ success: true, count: commoditiesStore.length });
});

// 4. 7-Day Price Forecast API
app.get('/api/commodities/:id/forecast', (req: Request, res: Response) => {
  const comm = commoditiesStore.find((c) => c.id === req.params.id) || commoditiesStore[0];
  const historical = HISTORICAL_PRICES[comm.commodity] || HISTORICAL_PRICES['Tomato (Hybrid)'];

  const existingForecast = SEVEN_DAY_FORECASTS[comm.commodity];
  if (existingForecast) {
    res.json({
      commodity: comm.commodity,
      modalPrice: comm.modalPrice,
      historical,
      forecast: existingForecast,
      models: MODEL_PERFORMANCE_METRICS,
    });
    return;
  }

  // Dynamic forecasting algorithmic generation
  const forecast: PricePredictionDay[] = [];
  const basePrice = comm.modalPrice;
  const isRising = comm.changePercent >= 0;
  const dayNamesEn = ['Tomorrow (Fri)', 'Day 2 (Sat)', 'Day 3 (Sun)', 'Day 4 (Mon)', 'Day 5 (Tue)', 'Day 6 (Wed)', 'Day 7 (Thu)'];
  const dayNamesKn = ['ನಾಳೆ (ಶುಕ್ರ)', 'ದಿನ ೨ (ಶನಿ)', 'ದಿನ ೩ (ಭಾನು)', 'ದಿನ ೪ (ಸೋಮ)', 'ದಿನ ೫ (ಮಂಗಳ)', 'ದಿನ ೬ (ಬುಧ)', 'ದಿನ ೭ (ಗುರು)'];

  let curPrice = basePrice;
  for (let i = 1; i <= 7; i++) {
    const dailyChange = (Math.sin(i * 1.2) * 0.015) + (isRising ? 0.012 : -0.009);
    curPrice = Math.round(curPrice * (1 + dailyChange));
    const span = Math.round(curPrice * 0.05);

    forecast.push({
      dayIndex: i,
      date: `Nov ${String(5 + i).padStart(2, '0')}`,
      dayName: dayNamesEn[i - 1],
      dayNameKn: dayNamesKn[i - 1],
      predictedModalPrice: curPrice,
      minExpectedPrice: curPrice - span,
      maxExpectedPrice: curPrice + span,
      changePercent: Number((((curPrice - basePrice) / basePrice) * 100).toFixed(2)),
      confidenceScore: Math.max(78, Math.round(95 - (i * 2.1))),
      influencingFactors: [
        {
          name: i % 2 === 0 ? 'Weekly Retail Demand Cycle' : 'Mandi Inflow Fluctuation',
          impact: isRising ? 'positive' : 'negative',
          description: `Modeled via SARIMA seasonal lag + APMC arrival elasticity coefficient for ${comm.district}.`,
        },
      ],
    });
  }

  res.json({
    commodity: comm.commodity,
    modalPrice: comm.modalPrice,
    historical,
    forecast,
    models: MODEL_PERFORMANCE_METRICS,
  });
});

// 5. Smart Mandi Comparison API
app.get('/api/mandis', (_req: Request, res: Response) => {
  res.json({ mandis: MANDI_COMPARISON_DATA });
});

app.post('/api/mandis/compare', (req: Request, res: Response) => {
  const { quantityQuintals = 20, vehicleType = 'Mini Truck (15-25 quintals)' } = req.body;
  let perKmRate = 18;
  if (vehicleType.includes('Auto')) perKmRate = 12;
  if (vehicleType.includes('Large')) perKmRate = 28;

  const results = MANDI_COMPARISON_DATA.map((mandi) => {
    const totalTransportCost = Math.round(mandi.distanceKm * 2 * perKmRate);
    const transportPerQuintal = Math.max(30, Math.round(totalTransportCost / Math.max(1, quantityQuintals)));
    const mandiCess = Math.round(mandi.modalPricePerQuintal * 0.015);
    const loadingFee = 30;
    const totalDeductions = mandiCess + loadingFee;
    const netRealized = mandi.modalPricePerQuintal - transportPerQuintal - totalDeductions;

    return {
      ...mandi,
      transportCostPerQuintal: transportPerQuintal,
      loadingAndMandiFeePerQuintal: totalDeductions,
      netRealizedPricePerQuintal: netRealized,
      netRealizedPricePerKg: Number((netRealized / 100).toFixed(2)),
      isRecommended: false,
    };
  });

  let bestId = results[0].id;
  let highest = -Infinity;
  results.forEach((r) => {
    if (r.netRealizedPricePerQuintal > highest) {
      highest = r.netRealizedPricePerQuintal;
      bestId = r.id;
    }
  });

  const finalResults = results
    .map((r) => ({ ...r, isRecommended: r.id === bestId }))
    .sort((a, b) => b.netRealizedPricePerQuintal - a.netRealizedPricePerQuintal);

  res.json({ results: finalResults, bestMandiId: bestId });
});

// 6. Crop Profitability Planner API ("What Should I Grow?")
app.post('/api/crops/recommendations', (req: Request, res: Response) => {
  const { landAcres = 2.5, irrigation = 'Drip', investmentBudget = 75000, experience = 'Intermediate (2-5 yrs)' } = req.body;

  let yieldMultiplier = 1.0;
  if (irrigation === 'Drip') yieldMultiplier += 0.15;
  if (irrigation === 'Rainfed') yieldMultiplier -= 0.25;
  if (experience.includes('Veteran')) yieldMultiplier += 0.08;
  if (experience.includes('Beginner')) yieldMultiplier -= 0.10;

  const list = CROP_RECOMMENDATIONS_DATABASE.map((item) => {
    const adjustedYield = Math.round(item.estimatedYieldPerAcre * yieldMultiplier * 10) / 10;
    const totalYield = adjustedYield * landAcres;
    const totalCost = item.estimatedCostPerAcre * landAcres;
    const revenue = Math.round(totalYield * item.expectedHarvestPrice);
    const netProfit = revenue - totalCost;
    const margin = revenue > 0 ? Math.round((netProfit / revenue) * 1000) / 10 : 0;

    return {
      ...item,
      estimatedYieldPerAcre: adjustedYield,
      expectedGrossRevenue: revenue,
      expectedNetProfit: netProfit,
      profitMarginPercent: margin,
      bestCaseProfit: Math.round(totalYield * 1.15 * (item.expectedHarvestPrice * 1.25) - totalCost),
      worstCaseProfit: Math.max(0, Math.round(totalYield * 0.8 * (item.expectedHarvestPrice * 0.75) - totalCost)),
    };
  }).sort((a, b) => b.expectedNetProfit - a.expectedNetProfit);

  res.json({ recommendations: list });
});

// 7. Hotel Requirements API
app.get('/api/hotel-requirements', (_req: Request, res: Response) => {
  res.json({ requirements: hotelReqsStore });
});

app.post('/api/hotel-requirements', (req: Request, res: Response) => {
  const {
    hotelName = 'The Rameshwaram Cafe',
    contactPerson = 'Chef Ananya Rao',
    mobile = '9845098765',
    locationArea = 'JP Nagar, Bengaluru',
    crop,
    cropKannada,
    variety = 'Grade A Fresh',
    qualitySpec = 'Firm texture, clean grading',
    weeklyQuantityKg,
    offeredPricePerKg,
    advanceFundingOfferedPercent = 40,
    deliveryFrequency = 'Daily',
    startDate = '2026-11-10',
    endDate = '2026-12-31',
  } = req.body;

  if (!crop || !weeklyQuantityKg || !offeredPricePerKg) {
    res.status(400).json({ error: 'Crop, weekly quantity, and offered price are required' });
    return;
  }

  const newReq: HotelRequirement = {
    id: `req-${Date.now()}`,
    hotelId: `usr-hotel-${Date.now()}`,
    hotelName,
    contactPerson,
    mobile,
    locationArea,
    crop,
    cropKannada: cropKannada || crop,
    variety,
    qualitySpec,
    weeklyQuantityKg: Number(weeklyQuantityKg),
    offeredPricePerKg: Number(offeredPricePerKg),
    advanceFundingOfferedPercent: Number(advanceFundingOfferedPercent),
    deliveryFrequency,
    startDate,
    endDate,
    status: 'Open',
    fulfilledQuantityKg: 0,
  };

  hotelReqsStore.unshift(newReq);
  broadcastEvent('NEW_HOTEL_REQUIREMENT', newReq);

  res.status(201).json({ success: true, requirement: newReq });
});

// 8. Farming Contracts & Advance Funding API
app.get('/api/contracts', (_req: Request, res: Response) => {
  res.json({ contracts: contractsStore });
});

app.post('/api/contracts', (req: Request, res: Response) => {
  const { requirementId, farmerId = 'usr-farmer-01', farmerName = 'Ramesh Gowda', contractedKg } = req.body;

  const reqItem = hotelReqsStore.find((r) => r.id === requirementId);
  if (!reqItem) {
    res.status(404).json({ error: 'Requirement not found' });
    return;
  }

  const quantity = Number(contractedKg) || 250;
  const totalVal = Math.round(quantity * reqItem.offeredPricePerKg);
  const advanceVal = Math.round((totalVal * reqItem.advanceFundingOfferedPercent) / 100);
  const contractNumber = `KC-JPN-2026-${Math.floor(100 + Math.random() * 900)}`;

  const newContract: FarmingContract = {
    id: `ctr-${Date.now()}`,
    contractNumber,
    hotelId: reqItem.hotelId,
    hotelName: reqItem.hotelName,
    farmerId,
    farmerName,
    crop: reqItem.crop,
    cropKannada: reqItem.cropKannada,
    contractQuantityKg: quantity,
    agreedPricePerKg: reqItem.offeredPricePerKg,
    totalContractValue: totalVal,
    advanceAmount: advanceVal,
    advancePaid: true,
    advanceTransactionRef: `UPI-ESCROW-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
    remainingAmount: totalVal - advanceVal,
    deliveryDueDate: reqItem.endDate,
    qualityGrade: reqItem.qualitySpec,
    currentStage: 'Seedling / Sowing',
    stageProgressPercent: 15,
    estimatedHarvestDate: reqItem.startDate,
    status: 'Active',
    hotelConfirmedDelivery: false,
    farmerConfirmedDispatched: false,
    notes: `Contract created via JP Nagar Community Network. Advance of ₹${advanceVal.toLocaleString('en-IN')} held in verified escrow.`,
    createdDate: new Date().toISOString().split('T')[0],
  };

  contractsStore.unshift(newContract);

  // Update requirement fulfilled quantity
  reqItem.fulfilledQuantityKg += quantity;
  if (reqItem.fulfilledQuantityKg >= reqItem.weeklyQuantityKg) {
    reqItem.status = 'Fulfilled';
  } else {
    reqItem.status = 'Partially Contracted';
  }

  broadcastEvent('NEW_CONTRACT_CREATED', {
    contract: newContract,
    updatedRequirement: reqItem,
  });

  res.status(201).json({ success: true, contract: newContract });
});

// Update contract stage
app.patch('/api/contracts/:id/stage', (req: Request, res: Response) => {
  const { newStage, progressPercent } = req.body;
  const contract = contractsStore.find((c) => c.id === req.params.id);
  if (!contract) {
    res.status(404).json({ error: 'Contract not found' });
    return;
  }

  contract.currentStage = newStage;
  contract.stageProgressPercent = progressPercent;
  if (newStage === 'Dispatched / In Transit') {
    contract.farmerConfirmedDispatched = true;
  }

  broadcastEvent('CONTRACT_STAGE_UPDATED', contract);
  res.json({ success: true, contract });
});

// Confirm delivery and release escrow
app.post('/api/contracts/:id/deliver', (req: Request, res: Response) => {
  const contract = contractsStore.find((c) => c.id === req.params.id);
  if (!contract) {
    res.status(404).json({ error: 'Contract not found' });
    return;
  }

  contract.status = 'Completed';
  contract.currentStage = 'Delivered & Inspected';
  contract.stageProgressPercent = 100;
  contract.hotelConfirmedDelivery = true;
  contract.qualityRating = 5;

  broadcastEvent('CONTRACT_DELIVERED', contract);
  res.json({ success: true, contract });
});

// 9. Government Feeds & Data Pipeline API
app.get('/api/gov-feeds/status', (_req: Request, res: Response) => {
  res.json({ statuses: govStatusStore });
});

app.post('/api/gov-feeds/sync', (_req: Request, res: Response) => {
  govStatusStore = govStatusStore.map((s) => ({
    ...s,
    lastSyncTimestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString()} IST (Synced)`,
    recordsCount: s.recordsCount + Math.floor(Math.random() * 25 + 10),
    status: 'Connected - Operational',
  }));

  broadcastEvent('GOV_FEEDS_SYNCED', { statuses: govStatusStore });
  res.json({ success: true, statuses: govStatusStore });
});

// CSV Data Importer
app.post('/api/gov-feeds/import-csv', (req: Request, res: Response) => {
  const { csvContent } = req.body;
  if (!csvContent || typeof csvContent !== 'string') {
    res.status(400).json({ error: 'Valid CSV content is required' });
    return;
  }

  // Parse CSV rows
  const lines = csvContent.trim().split('\n');
  let importedCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',').map((p) => p.trim());
    if (parts.length >= 5) {
      const [commodity, mandi, modalPrice, minPrice, maxPrice] = parts;
      const numModal = parseInt(modalPrice) || 2000;
      const numMin = parseInt(minPrice) || Math.round(numModal * 0.9);
      const numMax = parseInt(maxPrice) || Math.round(numModal * 1.1);

      const existing = commoditiesStore.find((c) => c.commodity.toLowerCase().includes(commodity.toLowerCase()));
      if (existing) {
        existing.prevPrice = existing.modalPrice;
        existing.modalPrice = numModal;
        existing.minPrice = numMin;
        existing.maxPrice = numMax;
        existing.mandi = mandi || existing.mandi;
        existing.date = new Date().toISOString().split('T')[0];
        importedCount++;
      } else {
        commoditiesStore.push({
          id: `comm-import-${Date.now()}-${i}`,
          commodity,
          commodityKannada: commodity,
          variety: 'Imported Grade',
          mandi: mandi || 'Kolar APMC',
          district: 'Kolar',
          state: 'Karnataka',
          date: new Date().toISOString().split('T')[0],
          minPrice: numMin,
          maxPrice: numMax,
          modalPrice: numModal,
          prevPrice: numModal,
          changePercent: 0,
          arrivalsTonnes: 150,
          reportingMarketsCount: 12,
          source: 'AGMARKNET',
          dataSourceUrl: 'https://agmarknet.gov.in',
          unit: 'quintal',
          perishabilityDays: 8,
          season: 'All Season',
        });
        importedCount++;
      }
    }
  }

  broadcastEvent('CSV_DATA_IMPORTED', { importedCount, totalCommodities: commoditiesStore.length });
  res.json({ success: true, importedCount, totalCommodities: commoditiesStore.length });
});

// 10. Weather & Demand-Supply Analytics
app.get('/api/weather', (_req: Request, res: Response) => {
  liveWeatherStore.updatedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  res.json(liveWeatherStore);
});

app.get('/api/analytics/demand-supply', (_req: Request, res: Response) => {
  res.json(COMMUNITY_ANALYTICS_DATA);
});

// 11. AgroVoice Chat API (Gemini 3.8 Flash with fast fallback)
const AGRI_DATA_CONTEXT = `
You are AgroVoice, the intelligent multilingual AI voice assistant for AgroPredict India / KRISHI CONNECT.
Tagline: "Grow Smart. Sell Better. Earn More."
You speak directly with Indian farmers in their native tongue: Kannada, Hindi, English, Telugu, Tamil, Malayalam, Marathi, Punjabi.
Be warm, practical, respectful (address them as Anna/Gowdaru/Kisan Bhai/Sir), concise (optimized for spoken voice synthesis in 2-4 sentences), and accurate.

CURRENT LIVE MARKET DATA (AGMARKNET Official):
- Tomato (Hybrid): Modal ₹2,150/quintal (₹21.50/kg) at Kolar APMC. 7-day prediction: Rising to ₹2,430/quintal.
- Onion (Medium): Modal ₹2,850/quintal (₹28.50/kg) at Yeshwanthpur APMC. 7-day prediction: Softening to ₹2,670/quintal.
- Potato (Jyoti): Modal ₹2,200/quintal (₹22.00/kg) at Binny Mill Bengaluru.
- French Beans: Modal ₹4,600/quintal (₹46.00/kg) at Chikkaballapur APMC. High demand from Bengaluru restaurants.
- Capsicum (Green): Modal ₹3,900/quintal (₹39.00/kg) at Ramanagara APMC.
- Green Chilli: Modal ₹4,300/quintal (₹43.00/kg) at Kolar APMC.

MANDI COMPARISON (Tomato 20 quintals from Kolar/Bengaluru):
- Yeshwanthpur APMC: Modal ₹2,480/qtl. Net realized profit: ₹2,235/qtl (₹22.35/kg) after transport & cess (RECOMMENDED HIGHEST NET RETURN).
- Kolar APMC: Modal ₹2,150/qtl. Net realized profit: ₹2,045/qtl.

WEATHER REPORT:
- 28°C, sunny, humidity 58%, 0% rain probability in next 48 hours. Ideal for vegetable harvesting and onion curing.
`;

function detectNavigationIntent(query: string): string | null {
  const q = query.toLowerCase();
  if (q.includes('dashboard') || q.includes('home') || q.includes('ಡ್ಯಾಶ್‌ಬೋರ್ಡ್') || q.includes('ಮುಖಪುಟ')) return 'overview';
  if (q.includes('prediction') || q.includes('forecast') || q.includes('ಮುನ್ಸೂಚನೆ') || q.includes('ಭವಿಷ್ಯ') || q.includes('market price') || q.includes('ಬೆಲೆ ನೋಡಿ')) return 'prediction';
  if (q.includes('mandi') || q.includes('market') || q.includes('ಮಂಡಿ') || q.includes('where to sell') || q.includes('कहाँ बेचें')) return 'mandi';
  if (q.includes('what should i grow') || q.includes('profit') || q.includes('ಏನು ಬೆಳೆಯಬೇಕು') || q.includes('crop plan')) return 'recommendation';
  if (q.includes('sell or hold') || q.includes('advisor') || q.includes('ಮಾರಾಟ ಅಥವಾ ಸಂಗ್ರಹ') || q.includes('ಮಾರಬೇಕೆ')) return 'selling-advisor';
  if (q.includes('community') || q.includes('hotel') || q.includes('ಹೋಟೆಲ್') || q.includes('ಸಮುದಾಯ ಕೃಷಿ') || q.includes('fund')) return 'community';
  if (q.includes('admin') || q.includes('ನಿರ್ವಾಹಕ') || q.includes('goverment')) return 'admin-portal';
  return null;
}

const LANGUAGE_PROMPT_NAMES: Record<string, string> = {
  kn: 'Kannada (ಕನ್ನಡ)',
  hi: 'Hindi (हिंदी)',
  en: 'English',
  te: 'Telugu (తెలుగు)',
  ta: 'Tamil (தமிழ்)',
  ml: 'Malayalam (മലയാളം)',
  mr: 'Marathi (मराठी)',
  pa: 'Punjabi (ਪੰਜਾਬੀ)',
};

function generateFallbackResponse(query: string, lang: string): { reply: string; targetView?: string } {
  const navTarget = detectNavigationIntent(query);
  const q = query.toLowerCase();

  if (navTarget) {
    if (lang === 'kn') return { reply: `ಖಂಡಿತ, ನಿಮ್ಮ ಆದೇಶದಂತೆ ಆ ಪುಟವನ್ನು ತೆರೆಯಲಾಗುತ್ತಿದೆ. ಪರಿಶೀಲಿಸಿ.`, targetView: navTarget };
    if (lang === 'hi') return { reply: `ज़रूर, आपके आदेशानुसार संबंधित पृष्ठ खोला जा रहा है।`, targetView: navTarget };
    return { reply: `Opening the requested screen right away for you.`, targetView: navTarget };
  }

  if (q.includes('tomato') || q.includes('ಟೊಮೆಟೊ') || q.includes('टमाटर')) {
    if (lang === 'kn') {
      return {
        reply: `ಇಂದು ಕೋಲಾರ ಎಪಿಎಂಸಿಯಲ್ಲಿ ಹೈಬ್ರಿಡ್ ಟೊಮೆಟೊ ಮಾದರಿ ಬೆಲೆ ಕ್ವಿಂಟಾಲ್‌ಗೆ ₹2,150 (ಕೆಜಿಗೆ ₹21.50) ಆಗಿದೆ. ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಆವಕ ಕಡಿಮೆಯಾಗುತ್ತಿರುವುದರಿಂದ ಮುಂದಿನ 7 ದಿನಗಳಲ್ಲಿ ಬೆಲೆ ₹2,430 ವರೆಗೆ ಏರಿಕೆಯಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ. ರಮೇಶ್ವರಂ ಕೆಫೆ ಹೋಟೆಲ್ ನೆಟ್‌ವರ್ಕ್‌ನಲ್ಲಿ ಎ-ಗ್ರೇಡ್ ಟೊಮೆಟೊಗೆ ಕೆಜಿಗೆ ₹25.50 ಖಾತರಿ ಬೆಲೆ ಮತ್ತು 40% ಮುಂಗಡ ನೀಡಲಾಗುತ್ತಿದೆ.`,
        targetView: 'prediction',
      };
    }
    return {
      reply: `Today's Hybrid Tomato modal price at Kolar APMC is ₹2,150/quintal (₹21.50/kg). Our AI forecast predicts it will rise to ₹2,430/quintal over the next 7 days due to lower arrivals. In the JP Nagar Hotel network, The Rameshwaram Cafe offers ₹25.50/kg with 40% upfront advance.`,
      targetView: 'prediction',
    };
  }

  if (q.includes('where') || q.includes('sell') || q.includes('ಎಲ್ಲಿ') || q.includes('ಮಾರಾಟ') || q.includes('कहाँ बेचूं')) {
    if (lang === 'kn') {
      return {
        reply: `ನಿಮ್ಮಲ್ಲಿರುವ 20 ಕ್ವಿಂಟಾಲ್ ಟೊಮೆಟೊಗೆ ಯಶವಂತಪುರ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ಅತ್ಯಧಿಕ ನಿವ್ವಳ ಲಾಭ ನೀಡುತ್ತದೆ. ಅಲ್ಲಿ ಕ್ವಿಂಟಾಲ್‌ಗೆ ₹2,480 ಬೆಲೆ ಇದ್ದು, ಸಾರಿಗೆ ವೆಚ್ಚ ₹190 ಮತ್ತು ಮಂಡಿ ಶುಲ್ಕ ಕಳೆದ ನಂತರ ನಿಮ್ಮ ಕೈಗೆ ₹2,235 (ಕೆಜಿಗೆ ₹22.35) ಸಿಗುತ್ತದೆ. ಕೋಲಾರ ಮಂಡಿಗಿಂತ ಒಟ್ಟು ₹3,800 ಹೆಚ್ಚು ನಿವ್ವಳ ಲಾಭ ಪಡೆಯಬಹುದು.`,
        targetView: 'mandi',
      };
    }
    return {
      reply: `For your 20 quintals of tomatoes, Yeshwanthpur APMC yields the highest net in-pocket return at ₹2,235/quintal (₹22.35/kg) after deducting ₹190 transport and APMC fees. This gives you ₹3,800 more total profit than local yards.`,
      targetView: 'mandi',
    };
  }

  if (lang === 'kn') {
    return { reply: `ನಮಸ್ಕಾರ! ನಾನು ಆಗ್ರೋವಾಯ್ಸ್ (AgroVoice). ನೀವು ಮಾರುಕಟ್ಟೆ ದರ, ಬೆಳೆ ಶಿಫಾರಸು, ಎಲ್ಲಿ ಮಾರಾಟ ಮಾಡಬೇಕು, ಅಥವಾ ಹವಾಮಾನದ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳನ್ನು ನನ್ನೊಂದಿಗೆ ಮಾತನಾಡಬಹುದು.` };
  }
  return { reply: `Hello! I'm AgroVoice, your agricultural voice assistant. You can ask me about live mandi prices, 7-day price forecasts, where to sell for maximum profit, crop diseases, or weather updates.` };
}

app.post('/api/agrovoice/chat', async (req: Request, res: Response) => {
  try {
    const { message, language = 'en', farmerProfile } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message text is required' });
      return;
    }

    const langName = LANGUAGE_PROMPT_NAMES[language] || 'Kannada and English';
    const navIntent = detectNavigationIntent(message);

    if (ai) {
      try {
        const prompt = `
Farmer spoken message: "${message}"
Requested Response Language: ${langName}
Farmer Profile Context: Name: ${farmerProfile?.name || 'Ramesh Gowda'}, Location: ${farmerProfile?.location || 'Kolar & Bengaluru Rural'}, Land: ${farmerProfile?.landSizeAcres || 3.5} acres.

Instructions:
1. Provide a direct, practical, and conversational response in ${langName}.
2. Keep it between 2 to 4 sentences (suitable for speech synthesis voice output).
3. Ground your facts strictly on the live market and weather data provided in the system instruction.
4. If the user asked to navigate, include tag [[NAVIGATE:view_name]].
`;

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI response timeout, using rapid local agricultural engine')), 3500)
        );

        const response = await Promise.race([
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction: AGRI_DATA_CONTEXT,
            },
          }),
          timeoutPromise,
        ]);

        let replyText = response.text || '';
        let targetView: string | undefined = navIntent || undefined;
        const navMatch = replyText.match(/\[\[NAVIGATE:([a-z-]+)\]\]/i);
        if (navMatch) {
          targetView = navMatch[1];
          replyText = replyText.replace(/\[\[NAVIGATE:[a-z-]+\]\]/i, '').trim();
        }

        res.json({
          reply: replyText,
          targetView,
          source: 'gemini-3.8-flash',
        });
        return;
      } catch (geminiError: any) {
        console.warn('Gemini API fallback to local agricultural engine:', geminiError?.message || geminiError);
      }
    }

    const fallback = generateFallbackResponse(message, language);
    res.json({
      reply: fallback.reply,
      targetView: fallback.targetView || navIntent || undefined,
      source: 'local-agri-engine',
    });
  } catch (error: any) {
    console.error('AgroVoice endpoint error:', error);
    res.status(500).json({
      error: 'Failed to process voice request',
      reply: 'I had trouble processing that request. Please try speaking again.',
    });
  }
});

// ==========================================
// VITE SPA DEV & PROD SERVING
// ==========================================
async function startServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`KRISHI CONNECT Real-Time Full-Stack Server listening on port ${port}`);
  });
}

startServer();
