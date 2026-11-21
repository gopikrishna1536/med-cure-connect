/**
 * Wells Criteria for Deep Vein Thrombosis (DVT)
 */
export function calculateWellsDvt(criteria = {}) {
  let score = 0;
  if (criteria.activeCancer) score += 1;
  if (criteria.paralysisOrParesisOrImmobilization) score += 1;
  if (criteria.bedriddenRecentlyOrMajorSurgery) score += 1;
  if (criteria.localizedTendernessDeepVenous) score += 1;
  if (criteria.entireLegSwollen) score += 1;
  if (criteria.calfSwelling3cmGreaterThanAsymptomatic) score += 1;
  if (criteria.pittingEdemaConfinedSymptomaticLeg) score += 1;
  if (criteria.collateralSuperficialVeins) score += 1;
  if (criteria.alternativeDiagnosisAtLeastAsLikely) score -= 2;

  const dvtLikely = score >= 2;
  return {
    wellsScore: score,
    dvtLikely,
    recommendedAction: dvtLikely ? 'Perform proximal leg venous ultrasound' : 'Order high-sensitivity D-dimer test'
  };
}
