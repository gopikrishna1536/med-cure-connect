/**
 * Medication Dosage & Prescription Refill Schedule Engine.
 */

export function calculateMedicationRefill(params) {
  const {
    medicationName,
    totalPills,
    pillsPerDose = 1,
    dosesPerDay = 1,
    startDate,
    asOfDate = new Date()
  } = params;

  if (!medicationName) throw new Error('Medication name is required');
  if (totalPills <= 0) throw new Error('Total pills must be a positive number');
  if (pillsPerDose <= 0 || dosesPerDay <= 0) throw new Error('Dose quantities must be positive');
  if (!startDate) throw new Error('Start date is required');

  const start = new Date(startDate);
  const asOf = new Date(asOfDate);
  const dailyConsumption = pillsPerDose * dosesPerDay;
  const daysTotalSupply = Math.floor(totalPills / dailyConsumption);

  const diffMs = asOf.getTime() - start.getTime();
  const daysElapsed = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  const pillsConsumed = Math.min(totalPills, daysElapsed * dailyConsumption);
  const pillsRemaining = Math.max(0, totalPills - pillsConsumed);
  const daysRemaining = Math.floor(pillsRemaining / dailyConsumption);

  const projectedDepletionDate = new Date(start.getTime() + (daysTotalSupply * 24 * 60 * 60 * 1000));

  let status = 'HEALTHY_SUPPLY';
  let priority = 'LOW';

  if (daysRemaining === 0) {
    status = 'DEPLETED_REFILL_URGENT';
    priority = 'CRITICAL';
  } else if (daysRemaining <= 2) {
    status = 'URGENT_REFILL_NEEDED';
    priority = 'HIGH';
  } else if (daysRemaining <= 5) {
    status = 'REFILL_DUE';
    priority = 'MEDIUM';
  }

  return {
    medicationName,
    dailyConsumption,
    daysTotalSupply,
    daysElapsed,
    pillsRemaining,
    daysRemaining,
    depletionDate: projectedDepletionDate.toISOString().split('T')[0],
    status,
    priority
  };
}
