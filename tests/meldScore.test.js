import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateMeldScore } from '../src/utils/meldScoreCalculator.js';

describe('MELD Liver Mortality Tests', () => {
  test('computes MELD score and 90-day waitlist mortality estimation', () => {
    const res = calculateMeldScore({
      serumBilirubinMgDl: 4.5,
      inr: 2.1,
      serumCreatinineMgDl: 2.2,
      serumSodiumMeqL: 130,
      isFemale: false
    });
    assert.ok(res.meldScore >= 25);
    assert.ok(res.projected90DayMortalityPercent >= 19.6);
  });
});
