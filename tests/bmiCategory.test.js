import test from 'node:test';
import assert from 'node:assert/strict';
import { BmiHealthCategory } from '../src/utils/bmiHealthCategory.js';

test('BMI and BMR Tests', async (t) => {
  await t.test('should calculate normal BMI and BMR for adult male', () => {
    // 70 kg, 175 cm (1.75m), 30 yrs male -> BMI = 70 / 3.0625 = 22.9
    // BMR = 700 + 1093.75 - 150 + 5 = 1648.75 -> 1649 kcal
    const res = BmiHealthCategory.evaluate(70, 175, 30, 'male');
    assert.equal(res.bmi, 22.9);
    assert.equal(res.category, 'NORMAL_WEIGHT');
    assert.equal(res.basalMetabolicRateKcal, 1649);
  });
});
