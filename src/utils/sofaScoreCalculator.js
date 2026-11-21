/**
 * Sequential Organ Failure Assessment (SOFA) ICU Score
 */
export function calculateSofaScore({ pao2Fio2, platelets, bilirubin, gcs, meanArterialPressure, creatinine }) {
  let score = 0;
  if (pao2Fio2 < 100) score += 4;
  else if (pao2Fio2 < 200) score += 3;
  else if (pao2Fio2 < 300) score += 2;
  else if (pao2Fio2 < 400) score += 1;

  if (platelets < 20) score += 4;
  else if (platelets < 50) score += 3;
  else if (platelets < 100) score += 2;
  else if (platelets < 150) score += 1;

  if (bilirubin >= 12.0) score += 4;
  else if (bilirubin >= 6.0) score += 3;
  else if (bilirubin >= 2.0) score += 2;
  else if (bilirubin >= 1.2) score += 1;

  if (meanArterialPressure < 70) score += 1;

  if (gcs < 6) score += 4;
  else if (gcs <= 9) score += 3;
  else if (gcs <= 12) score += 2;
  else if (gcs <= 14) score += 1;

  if (creatinine >= 5.0) score += 4;
  else if (creatinine >= 3.5) score += 3;
  else if (creatinine >= 2.0) score += 2;
  else if (creatinine >= 1.2) score += 1;

  return {
    totalSofaScore: score,
    projectedMortalityRatePercent: score >= 12 ? 80 : (score >= 8 ? 33 : (score >= 4 ? 15 : 5))
  };
}
