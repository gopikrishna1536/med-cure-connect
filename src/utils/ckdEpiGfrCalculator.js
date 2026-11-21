/**
 * 2021 CKD-EPI Creatinine Equation for eGFR (Race-Free)
 */
export function calculateEgfr({ serumCreatinine, age, isFemale }) {
  const kappa = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.241 : -0.302;
  const genderMultiplier = isFemale ? 1.012 : 1.0;

  const scrOverKappa = serumCreatinine / kappa;
  const minTerm = Math.pow(Math.min(scrOverKappa, 1), alpha);
  const maxTerm = Math.pow(Math.max(scrOverKappa, 1), -1.200);
  const ageTerm = Math.pow(0.9938, age);

  const egfr = 142 * minTerm * maxTerm * ageTerm * genderMultiplier;
  const roundedGfr = Math.round(egfr);

  let ckdStage = 'G1 (Normal)';
  if (roundedGfr < 15) ckdStage = 'G5 (Kidney Failure)';
  else if (roundedGfr < 30) ckdStage = 'G4 (Severely Decreased)';
  else if (roundedGfr < 60) ckdStage = 'G3 (Moderately Decreased)';
  else if (roundedGfr < 90) ckdStage = 'G2 (Mildly Decreased)';

  return { egfr: roundedGfr, ckdStage };
}
