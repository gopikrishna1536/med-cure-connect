/**
 * MELD 3.0 Score for End-Stage Liver Disease
 */
export function calculateMeldScore({ serumBilirubinMgDl, inr, serumCreatinineMgDl, serumSodiumMeqL, isFemale }) {
  const bili = Math.max(1.0, serumBilirubinMgDl);
  const inrVal = Math.max(1.0, inr);
  const cr = Math.min(4.0, Math.max(1.0, serumCreatinineMgDl));
  const na = Math.min(137, Math.max(125, serumSodiumMeqL || 135));

  const meld = 9.57 * Math.log(cr) + 3.78 * Math.log(bili) + 11.2 * Math.log(inrVal) + 6.43;
  const meldNa = meld + 1.32 * (137 - na) - (0.033 * meld * (137 - na));

  const finalScore = Math.min(40, Math.max(6, Math.round(meldNa)));
  return {
    meldScore: finalScore,
    projected90DayMortalityPercent: finalScore >= 30 ? 52.6 : (finalScore >= 20 ? 19.6 : 6.0)
  };
}
