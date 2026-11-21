import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateEgfr } from '../src/utils/ckdEpiGfrCalculator.js';

describe('CKD-EPI 2021 eGFR Tests', () => {
  test('calculates accurate eGFR and assigns chronic kidney disease stage', () => {
    const normal = calculateEgfr({ serumCreatinine: 0.9, age: 35, isFemale: false });
    assert.ok(normal.egfr >= 90);
    assert.equal(normal.ckdStage, 'G1 (Normal)');

    const impaired = calculateEgfr({ serumCreatinine: 2.8, age: 65, isFemale: false });
    assert.ok(impaired.egfr < 30);
    assert.equal(impaired.ckdStage, 'G4 (Severely Decreased)');
  });
});
