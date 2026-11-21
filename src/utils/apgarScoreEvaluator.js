/**
 * Neonatal APGAR Score Evaluator (0 to 10)
 */
export function evaluateApgar({ heartRateBpm, respiratoryEffort, muscleTone, reflexIrritability, color }) {
  let score = 0;
  if (heartRateBpm >= 100) score += 2;
  else if (heartRateBpm > 0) score += 1;

  score += Math.max(0, Math.min(2, respiratoryEffort || 0));
  score += Math.max(0, Math.min(2, muscleTone || 0));
  score += Math.max(0, Math.min(2, reflexIrritability || 0));
  score += Math.max(0, Math.min(2, color || 0));

  return {
    score,
    status: score >= 7 ? 'Reassuring' : (score >= 4 ? 'Moderately Abnormal' : 'Severely Depressed')
  };
}
