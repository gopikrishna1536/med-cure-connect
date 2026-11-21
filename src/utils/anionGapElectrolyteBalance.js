/**
 * Serum Anion Gap and Delta Gap Electrolyte Calculator
 */
export function calculateAnionGap({ sodium, chloride, bicarbonate }) {
  const ag = sodium - (chloride + bicarbonate);
  const deltaAg = ag - 12;
  const deltaBicarb = 24 - bicarbonate;
  const deltaRatio = deltaBicarb !== 0 ? Number((deltaAg / deltaBicarb).toFixed(2)) : 1.0;

  let interpretation = 'Normal Anion Gap';
  if (ag > 12) {
    interpretation = 'High Anion Gap Metabolic Acidosis (HAGMA)';
  } else if (ag < 8) {
    interpretation = 'Low Anion Gap (possible hypoalbuminemia)';
  }

  return {
    anionGap: ag,
    deltaRatio,
    interpretation
  };
}
