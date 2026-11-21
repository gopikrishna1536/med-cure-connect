/**
 * Framingham 10-Year Cardiovascular Disease Risk Score
 */
export function calculateFraminghamRisk({ gender, age, totalCholesterol, hdlCholesterol, systolicBp, treatedBp = false, smoker = false }) {
  let score = 0;
  if (age >= 50) score += 6;
  else if (age >= 40) score += 4;
  else if (age >= 30) score += 2;

  if (totalCholesterol > 240) score += 3;
  else if (totalCholesterol > 200) score += 1;

  if (hdlCholesterol < 40) score += 2;
  else if (hdlCholesterol >= 60) score -= 1;

  if (systolicBp >= 140) score += (treatedBp ? 3 : 2);
  else if (systolicBp >= 130) score += 1;

  if (smoker) score += 2;

  const estimatedRiskPercent = Math.min(30, Math.max(1, score * 2));
  return {
    score,
    estimatedRiskPercent,
    riskCategory: estimatedRiskPercent < 10 ? 'Low' : (estimatedRiskPercent < 20 ? 'Intermediate' : 'High')
  };
}
