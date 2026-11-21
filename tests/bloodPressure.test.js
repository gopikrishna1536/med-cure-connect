import test from 'node:test';
import assert from 'node:assert/strict';
import { BloodPressureClassifier } from '../src/utils/bloodPressureClassifier.js';

test('Blood Pressure Classification Tests', async (t) => {
  await t.test('should classify Stage 1 hypertension', () => {
    const res = BloodPressureClassifier.classify(132, 84);
    assert.equal(res.stage, 'HYPERTENSION_STAGE_1');
    assert.equal(res.requiresEmergencyCare, false);
  });

  await t.test('should trigger emergency alert for hypertensive crisis', () => {
    const res = BloodPressureClassifier.classify(185, 115);
    assert.equal(res.stage, 'HYPERTENSIVE_CRISIS');
    assert.equal(res.requiresEmergencyCare, true);
  });
});
