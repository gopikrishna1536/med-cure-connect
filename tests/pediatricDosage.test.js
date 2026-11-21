import test from 'node:test';
import assert from 'node:assert/strict';
import { PediatricDosageCalculator } from '../src/utils/pediatricDosageCalculator.js';

test('Pediatric Dosage Tests', async (t) => {
  await t.test('should calculate child dose by weight using Clark rule', () => {
    // 34 kg child (~75 lbs = 50% of 150) on 500 mg adult dose -> 250 mg
    const dose = PediatricDosageCalculator.byWeightClark(34.0, 500);
    assert.ok(dose >= 245 && dose <= 255);
  });
});
