import { MANDI_COMPARISON_DATA } from '../data/mockData';
import { MandiComparisonItem } from '../types';

export interface MandiFinderParams {
  cropName: string;
  quantityQuintals: number;
  vehicleType: 'Auto (5-8 quintals)' | 'Mini Truck (15-25 quintals)' | 'Large Canter (50+ quintals)';
}

export function calculateMandiReturns(params: MandiFinderParams): MandiComparisonItem[] {
  const { quantityQuintals, vehicleType } = params;

  // Fuel & vehicle hiring rates per km in Karnataka
  let perKmRate = 18; // base mini truck ₹18/km round-trip cost divided by capacity
  if (vehicleType === 'Auto (5-8 quintals)') {
    perKmRate = 12;
  } else if (vehicleType === 'Large Canter (50+ quintals)') {
    perKmRate = 28;
  }

  const results = MANDI_COMPARISON_DATA.map((mandi) => {
    // Total roundtrip transport cost distributed over the consignment load
    const totalTransportCost = Math.round((mandi.distanceKm * 2 * perKmRate));
    const transportPerQuintal = Math.max(30, Math.round(totalTransportCost / Math.max(1, quantityQuintals)));

    // APMC Mandi fee is 1.5% of modal price + loading cess ₹25/quintal
    const mandiCess = Math.round(mandi.modalPricePerQuintal * 0.015);
    const loadingUnloadingFee = 30; // standard hamali fee in Karnataka mandis
    const totalFeesPerQuintal = mandiCess + loadingUnloadingFee;

    const netRealizedPerQuintal = mandi.modalPricePerQuintal - transportPerQuintal - totalFeesPerQuintal;
    const netRealizedPerKg = Number((netRealizedPerQuintal / 100).toFixed(2));

    return {
      ...mandi,
      transportCostPerQuintal: transportPerQuintal,
      loadingAndMandiFeePerQuintal: totalFeesPerQuintal,
      netRealizedPricePerQuintal: netRealizedPerQuintal,
      netRealizedPricePerKg: netRealizedPerKg,
      isRecommended: false,
    };
  });

  // Find the highest net return
  let bestMandiId = results[0].id;
  let highestNet = -Infinity;
  results.forEach((r) => {
    if (r.netRealizedPricePerQuintal > highestNet) {
      highestNet = r.netRealizedPricePerQuintal;
      bestMandiId = r.id;
    }
  });

  return results.map((r) => ({
    ...r,
    isRecommended: r.id === bestMandiId,
  })).sort((a, b) => b.netRealizedPricePerQuintal - a.netRealizedPricePerQuintal);
}
