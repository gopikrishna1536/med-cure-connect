/**
 * Simplified APACHE II Acute Physiological ICU Severity Score
 */
export function calculateApache2({ tempCelsius, mapMmHg, heartRate, respRate, wbcKUl }) {
  let score = 0;
  if (tempCelsius >= 41 || tempCelsius <= 29.9) score += 4;
  else if (tempCelsius >= 39) score += 3;

  if (mapMmHg >= 160 || mapMmHg <= 49) score += 4;
  else if (mapMmHg <= 69) score += 2;

  if (heartRate >= 180 || heartRate <= 39) score += 4;
  else if (heartRate >= 140) score += 3;

  if (respRate >= 50 || respRate <= 5) score += 4;
  else if (respRate >= 35) score += 3;

  if (wbcKUl >= 40 || wbcKUl < 1) score += 4;
  else if (wbcKUl >= 20) score += 2;

  return {
    apacheScore: score,
    icuSeverity: score >= 15 ? 'High ICU Severity' : 'Moderate / Monitored'
  };
}
