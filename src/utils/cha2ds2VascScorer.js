/**
 * CHA2DS2-VASc Atrial Fibrillation Stroke Risk Score
 */
export function calculateCha2ds2Vasc({ congestiveHeartFailure, hypertension, age, diabetes, priorStrokeOrTia, vascularDisease, isFemale }) {
  let score = 0;
  if (congestiveHeartFailure) score += 1;
  if (hypertension) score += 1;
  if (age >= 75) score += 2;
  else if (age >= 65) score += 1;
  if (diabetes) score += 1;
  if (priorStrokeOrTia) score += 2;
  if (vascularDisease) score += 1;
  if (isFemale) score += 1;

  const adjustedScoreForDecision = isFemale ? score - 1 : score;
  const anticoagulationRecommended = adjustedScoreForDecision >= 2;

  return {
    rawScore: score,
    anticoagulationRecommended,
    annualStrokeRiskPercent: score >= 6 ? 9.8 : (score === 4 ? 4.0 : (score === 2 ? 2.2 : 0.5))
  };
}
