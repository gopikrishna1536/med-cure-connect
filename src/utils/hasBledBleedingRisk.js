/**
 * HAS-BLED Major Bleeding Risk Score
 */
export function calculateHasBled({ hypertension, abnormalRenalOrLiver, priorStroke, bleedingHistory, labileInr, elderlyAge65, drugsOrAlcohol }) {
  let score = 0;
  if (hypertension) score += 1;
  if (abnormalRenalOrLiver) score += 1;
  if (priorStroke) score += 1;
  if (bleedingHistory) score += 1;
  if (labileInr) score += 1;
  if (elderlyAge65) score += 1;
  if (drugsOrAlcohol) score += 1;

  return {
    hasBledScore: score,
    highRisk: score >= 3,
    recommendation: score >= 3 ? 'High bleeding risk: close monitoring and modifiable factor mitigation' : 'Low to moderate risk'
  };
}
