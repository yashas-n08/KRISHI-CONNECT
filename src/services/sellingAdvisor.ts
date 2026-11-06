import { COMMODITIES_MARKET_DATA, HOTEL_REQUIREMENTS_DATA, SEVEN_DAY_FORECASTS } from '../data/mockData';
import { SellingAdvisorInput, SellingAdvisorResult } from '../types';

export function evaluateSellingDecision(input: SellingAdvisorInput): SellingAdvisorResult {
  const { crop, quantityQuintals, qualityGrade, storageAvailable, coldStorageAvailable } = input;

  const commodity = COMMODITIES_MARKET_DATA.find((c) => c.commodity === crop) || COMMODITIES_MARKET_DATA[0];
  const currentPricePerQuintal = commodity.modalPrice;
  const currentTotalValue = Math.round(quantityQuintals * currentPricePerQuintal);

  // Check if there is an active hotel requirement for this crop with high payout
  const hotelMatches = HOTEL_REQUIREMENTS_DATA.filter((h) => h.crop === crop && h.status === 'Open');
  const bestHotel = hotelMatches.length > 0 ? hotelMatches[0] : null;

  // Forecast trajectory
  const forecast = SEVEN_DAY_FORECASTS[crop] || [];
  const day2Price = forecast.length >= 2 ? forecast[1].predictedModalPrice : currentPricePerQuintal * 1.02;
  const day5Price = forecast.length >= 5 ? forecast[4].predictedModalPrice : currentPricePerQuintal * 1.04;

  const isHighlyPerishable = commodity.perishabilityDays <= 7; // e.g. Tomato (6 days), Beans (5 days)

  // 1. Check Hotel Option: If Grade A and Hotel pays 15%+ above Mandi
  if (qualityGrade.includes('Grade A') && bestHotel && bestHotel.offeredPricePerKg * 100 > currentPricePerQuintal * 1.12) {
    const hotelPricePerQuintal = bestHotel.offeredPricePerKg * 100;
    const hotelTotalValue = Math.round(quantityQuintals * hotelPricePerQuintal);
    const netGain = hotelTotalValue - currentTotalValue;

    return {
      decision: 'SELL TO A REGISTERED HOTEL',
      decisionKannada: 'ನೋಂದಾಯಿತ ಹೋಟೆಲ್‌ಗೆ ನೇರವಾಗಿ ಮಾರಾಟ ಮಾಡಿ',
      currentSellingValue: currentTotalValue,
      expectedFutureSellingValue: hotelTotalValue,
      storageAndSpoilageCost: 0,
      netFinancialImpact: netGain,
      riskAssessment: 'Low Risk',
      spoilagePercentageExpected: 0,
      reasoning: [
        `${bestHotel.hotelName} offers guaranteed ₹${bestHotel.offeredPricePerKg}/kg (₹${hotelPricePerQuintal}/quintal), which is ₹${hotelPricePerQuintal - currentPricePerQuintal}/quintal above APMC modal.`,
        `Direct delivery eliminates 6.5% mandi commission and loading tolls.`,
        `Eligible for ${bestHotel.advanceFundingOfferedPercent}% upfront advance payment.`,
      ],
      targetVenue: `${bestHotel.hotelName} (${bestHotel.locationArea})`,
    };
  }

  // 2. High perishability crops without cold storage
  if (isHighlyPerishable && !coldStorageAvailable) {
    // Spoilage rate without cold storage is 3.5% per day for ripe tomatoes/beans
    const dailySpoilageRate = 0.035;
    const day2QuantityAfterSpoilage = quantityQuintals * (1 - (dailySpoilageRate * 2));
    const day2Value = Math.round(day2QuantityAfterSpoilage * day2Price);
    const day2HoldingCost = Math.round(quantityQuintals * (storageAvailable ? 15 : 35) * 2);
    const netDay2Gain = day2Value - day2HoldingCost - currentTotalValue;

    if (day2Price > currentPricePerQuintal * 1.07 && netDay2Gain > 800) {
      return {
        decision: 'HOLD FOR 2 DAYS',
        decisionKannada: '೨ ದಿನಗಳ ಕಾಲ ಸಂಗ್ರಹಿಸಿ (Hold for 2 Days)',
        currentSellingValue: currentTotalValue,
        expectedFutureSellingValue: day2Value,
        storageAndSpoilageCost: day2HoldingCost + Math.round((currentTotalValue * 0.07)),
        netFinancialImpact: netDay2Gain,
        riskAssessment: 'Medium Risk',
        spoilagePercentageExpected: 7.0,
        reasoning: [
          `AI forecasts a +${(((day2Price - currentPricePerQuintal) / currentPricePerQuintal) * 100).toFixed(1)}% price spike over the next 48 hours due to weekend tiffin demand.`,
          `Expected price jump exceeds the estimated 7% natural moisture weight loss and handling risk.`,
          `Ensure produce is kept in shaded, aerated plastic crates to minimize rot.`,
        ],
        targetVenue: 'Local APMC or Wholesale Distributor on Day 2',
      };
    }

    // Default for perishable crops is SELL NOW
    return {
      decision: 'SELL NOW',
      decisionKannada: 'ಇಂದೇ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಮಾರಾಟ ಮಾಡಿ (Sell Now)',
      currentSellingValue: currentTotalValue,
      expectedFutureSellingValue: currentTotalValue,
      storageAndSpoilageCost: 0,
      netFinancialImpact: 0,
      riskAssessment: 'Low Risk',
      spoilagePercentageExpected: 0,
      reasoning: [
        `${crop} is highly perishable with a shelf life under ${commodity.perishabilityDays} days.`,
        `Holding without active refrigeration causes 3.5% weight loss daily and grade downgrading.`,
        `Current APMC modal price (₹${currentPricePerQuintal}/quintal) offers strong baseline realization.`,
      ],
      targetVenue: `${commodity.mandi}`,
    };
  }

  // 3. Storable crops (Onion, Potato) or cold-stored commodities
  if (!isHighlyPerishable || coldStorageAvailable) {
    const day5Quantity = quantityQuintals * 0.98; // minor shrinkage
    const storageCost5Days = quantityQuintals * 40; // ₹40/quintal storage
    const day5Value = Math.round(day5Quantity * day5Price);
    const netDay5Impact = day5Value - storageCost5Days - currentTotalValue;

    if (day5Price > currentPricePerQuintal * 1.08 && netDay5Impact > 1200) {
      return {
        decision: 'HOLD FOR 5 DAYS',
        decisionKannada: '೫ ದಿನಗಳ ಕಾಲ ಸಂಗ್ರಹಿಸಿ (Hold for 5 Days)',
        currentSellingValue: currentTotalValue,
        expectedFutureSellingValue: day5Value,
        storageAndSpoilageCost: storageCost5Days + Math.round(currentTotalValue * 0.02),
        netFinancialImpact: netDay5Impact,
        riskAssessment: 'Low Risk',
        spoilagePercentageExpected: 2.0,
        reasoning: [
          `Substantial supply constriction expected around Day 5 as regional harvests taper off.`,
          `Adequate curing and dry ventilation will preserve grade with minimal loss (<2%).`,
          `Net gain after ₹40/quintal warehouse fee is +₹${netDay5Impact.toLocaleString('en-IN')}.`,
        ],
        targetVenue: 'Yeshwanthpur Mega APMC / Whitefield Logistics Hub',
      };
    }
  }

  // 4. Default: Sell at Another Mandi
  return {
    decision: 'SELL AT ANOTHER MANDI',
    decisionKannada: 'ಬೇರೆ ಮಂಡಿಯಲ್ಲಿ ಮಾರಾಟ ಮಾಡಿ (Sell at Another Mandi)',
    currentSellingValue: currentTotalValue,
    expectedFutureSellingValue: Math.round(quantityQuintals * (currentPricePerQuintal + 280)),
    storageAndSpoilageCost: Math.round(quantityQuintals * 75), // extra transport
    netFinancialImpact: Math.round(quantityQuintals * (280 - 75)),
    riskAssessment: 'Low Risk',
    spoilagePercentageExpected: 1.0,
    reasoning: [
      `Yeshwanthpur APMC is trading at ₹${currentPricePerQuintal + 280}/quintal, significantly above local yards.`,
      `Even after paying ₹75/quintal extra transport, your net return increases by ₹${Math.round(quantityQuintals * 205).toLocaleString('en-IN')}.`,
      `High auction liquidity ensures immediate cash clearance on same-day weighing.`,
    ],
    targetVenue: 'Yeshwanthpur APMC, Bengaluru',
  };
}
