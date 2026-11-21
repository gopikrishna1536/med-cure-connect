import test from 'node:test';
import assert from 'node:assert/strict';
import { LabReportReferenceRange } from '../src/utils/labReportReferenceRange.js';

test('Lab Report Range Tests', async (t) => {
  await t.test('should flag elevated fasting blood sugar', () => {
    const res = LabReportReferenceRange.evaluateResult('fasting_glucose', 115);
    assert.equal(res.flag, 'HIGH');
    assert.equal(res.isAbnormal, true);
  });
});
