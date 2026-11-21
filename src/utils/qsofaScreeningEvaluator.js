/**
 * Quick SOFA (qSOFA) Bedside Sepsis Screening
 */
export function evaluateQsofa({ respiratoryRate, gcs, systolicBp }) {
  let score = 0;
  if (respiratoryRate >= 22) score += 1;
  if (gcs < 15) score += 1;
  if (systolicBp <= 100) score += 1;

  const sepsisHighRisk = score >= 2;
  return {
    qsofaScore: score,
    sepsisHighRisk,
    alert: sepsisHighRisk ? 'HIGH SEPSIS RISK: Initiate sepsis workup, blood cultures and lactate check' : 'Low risk'
  };
}
