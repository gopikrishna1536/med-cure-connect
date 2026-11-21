import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateApache2 } from '../src/utils/apache2MortalityRisk.js';

describe('APACHE II Severity Tests', () => {
  test('scores acute physiological derangements accurately', () => {
    const res = calculateApache2({
      tempCelsius: 39.5,
      mapMmHg: 65,
      heartRate: 150,
      respRate: 36,
      wbcKUl: 22
    });
    assert.ok(res.apacheScore >= 12);
  });
});
