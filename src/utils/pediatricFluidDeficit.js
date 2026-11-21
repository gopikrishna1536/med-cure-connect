/**
 * Holliday-Segar 4-2-1 Maintenance Fluid Calculator
 */
export function calculatePediatricMaintenanceFluid(weightKg) {
  if (!weightKg || weightKg <= 0) return { hourlyRateMl: 0, dailyVolumeMl: 0 };
  let hourlyRate = 0;

  if (weightKg <= 10) {
    hourlyRate = weightKg * 4;
  } else if (weightKg <= 20) {
    hourlyRate = (10 * 4) + ((weightKg - 10) * 2);
  } else {
    hourlyRate = (10 * 4) + (10 * 2) + ((weightKg - 20) * 1);
  }

  const dailyVolume = hourlyRate * 24;
  return {
    weightKg,
    hourlyRateMl: Number(hourlyRate.toFixed(1)),
    dailyVolumeMl: Number(dailyVolume.toFixed(1))
  };
}
