import { CROP_RECOMMENDATIONS_DATABASE } from '../data/mockData';
import { CropRecommendation } from '../types';

export interface CropPlannerCriteria {
  location: string;
  landAcres: number;
  irrigation: 'Drip' | 'Borewell' | 'Canal' | 'Rainfed';
  investmentBudget: number; // ₹
  experience: 'Beginner (<2 yrs)' | 'Intermediate (2-5 yrs)' | 'Veteran (5+ yrs)';
  season: 'Upcoming Kharif' | 'Rabi / Winter' | 'Summer / Zaid';
}

export function calculateCropProfitability(criteria: CropPlannerCriteria): CropRecommendation[] {
  const { landAcres, irrigation, investmentBudget, experience } = criteria;

  return CROP_RECOMMENDATIONS_DATABASE.map((item) => {
    // Suitability modifier based on irrigation and experience
    let yieldMultiplier = 1.0;
    if (irrigation === 'Drip') {
      yieldMultiplier += 0.15; // +15% yield with drip
    } else if (irrigation === 'Rainfed') {
      yieldMultiplier -= 0.25; // -25% yield if solely rainfed
    }

    if (experience === 'Veteran (5+ yrs)') {
      yieldMultiplier += 0.08;
    } else if (experience === 'Beginner (<2 yrs)') {
      yieldMultiplier -= 0.10;
    }

    const adjustedYieldPerAcre = Math.round(item.estimatedYieldPerAcre * yieldMultiplier * 10) / 10;
    const totalYieldQuintals = adjustedYieldPerAcre * landAcres;

    // Cost scaling
    const costPerAcre = item.estimatedCostPerAcre;
    const totalCultivationCost = costPerAcre * landAcres;

    // Harvest forward price (accounting for historical time-to-harvest seasonality)
    const harvestPriceQuintal = item.expectedHarvestPrice;
    const expectedRevenue = Math.round(totalYieldQuintals * harvestPriceQuintal);
    const expectedNetProfit = expectedRevenue - totalCultivationCost;
    const profitMargin = expectedRevenue > 0 ? Math.round((expectedNetProfit / expectedRevenue) * 1000) / 10 : 0;

    // Best-case (+25% price / +15% yield) & Worst-case (-25% price / -20% yield)
    const bestCaseProfit = Math.round(
      totalYieldQuintals * 1.15 * (harvestPriceQuintal * 1.25) - totalCultivationCost
    );
    const worstCaseProfit = Math.max(
      0,
      Math.round(totalYieldQuintals * 0.8 * (harvestPriceQuintal * 0.75) - totalCultivationCost)
    );

    // Is it affordable within budget?
    const isAffordable = investmentBudget >= totalCultivationCost;

    return {
      ...item,
      estimatedYieldPerAcre: adjustedYieldPerAcre,
      expectedGrossRevenue: expectedRevenue,
      expectedNetProfit: expectedNetProfit,
      profitMarginPercent: profitMargin,
      bestCaseProfit: bestCaseProfit,
      worstCaseProfit: worstCaseProfit,
      keyFactors: [
        ...item.keyFactors,
        isAffordable
          ? `Fits comfortably within your ₹${investmentBudget.toLocaleString('en-IN')} total budget.`
          : `Requires ₹${totalCultivationCost.toLocaleString('en-IN')} (Eligible for ₹${Math.round(totalCultivationCost * 0.4).toLocaleString('en-IN')} advance hotel funding).`,
      ],
    };
  }).sort((a, b) => b.expectedNetProfit - a.expectedNetProfit);
}
