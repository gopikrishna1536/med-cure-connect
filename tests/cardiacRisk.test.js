import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateFraminghamRisk } from '../src/utils/cardiacRiskFramingham.js';

describe('Framingham Cardiac Risk Tests', () => {
  test('evaluates 10-year CVD risk score and risk classification', () => {
    const res = calculateFraminghamRisk({
      gender: 'male',
      age: 52,
      totalCholesterol: 220,
      hdlCholesterol: 38,
      systolicBp: 145,
      treatedBp: true,
      smoker: true
    });
    assert.ok(res.score >= 10);
    assert.equal(res.riskCategory, 'High');
  });
});
