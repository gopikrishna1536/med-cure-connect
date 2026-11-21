import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateCurb65 } from '../src/utils/curb65PneumoniaSeverity.js';

describe('CURB-65 Pneumonia Severity Tests', () => {
  test('triages severe pneumonia requiring urgent hospital admission', () => {
    const res = calculateCurb65({
      confusion: true,
      bunMgDl: 25,
      respiratoryRate: 32,
      systolicBp: 85,
      diastolicBp: 55,
      age: 70
    });
    assert.equal(res.curb65Score, 5);
    assert.equal(res.disposition, 'Urgent Inpatient / ICU Admission');
  });
});
