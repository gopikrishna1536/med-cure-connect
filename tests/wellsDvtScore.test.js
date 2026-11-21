import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateWellsDvt } from '../src/utils/wellsDvtScoreCalculator.js';

describe('Wells DVT Probability Tests', () => {
  test('correctly identifies high clinical probability of DVT', () => {
    const res = calculateWellsDvt({
      activeCancer: true,
      entireLegSwollen: true,
      calfSwelling3cmGreaterThanAsymptomatic: true
    });
    assert.equal(res.wellsScore, 3);
    assert.equal(res.dvtLikely, true);
    assert.ok(res.recommendedAction.includes('venous ultrasound'));
  });
});
