import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateHasBled } from '../src/utils/hasBledBleedingRisk.js';

describe('HAS-BLED Score Tests', () => {
  test('flags high bleeding risk when score is 3 or greater', () => {
    const res = calculateHasBled({
      hypertension: true,
      bleedingHistory: true,
      elderlyAge65: true
    });
    assert.equal(res.hasBledScore, 3);
    assert.equal(res.highRisk, true);
  });
});
