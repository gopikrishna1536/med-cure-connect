/**
 * CURB-65 Pneumonia Severity Score
 */
export function calculateCurb65({ confusion, bunMgDl, respiratoryRate, systolicBp, diastolicBp, age }) {
  let score = 0;
  if (confusion) score += 1;
  if (bunMgDl > 19) score += 1;
  if (respiratoryRate >= 30) score += 1;
  if (systolicBp < 90 || diastolicBp <= 60) score += 1;
  if (age >= 65) score += 1;

  let disposition = 'Outpatient Treatment';
  if (score >= 3) disposition = 'Urgent Inpatient / ICU Admission';
  else if (score === 2) disposition = 'Inpatient Observation';

  return {
    curb65Score: score,
    disposition,
    estimated30DayMortalityPercent: score >= 4 ? 30.0 : (score === 3 ? 14.0 : (score === 2 ? 6.8 : 1.2))
  };
}
