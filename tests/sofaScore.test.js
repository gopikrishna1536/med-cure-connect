import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateSofaScore } from '../src/utils/sofaScoreCalculator.js';

describe('SOFA Score Tests', () => {
  test('calculates multi-organ failure ICU score and estimated mortality rate', () => {
    const res = calculateSofaScore({
      pao2Fio2: 180,
      platelets: 45,
      bilirubin: 2.5,
      meanArterialPressure: 65,
      gcs: 11,
      creatinine: 2.2
    });
    assert.equal(res.totalSofaScore, 13);
    assert.equal(res.projectedMortalityRatePercent, 80);
  });
});
