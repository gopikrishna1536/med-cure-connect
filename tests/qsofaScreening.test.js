import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateQsofa } from '../src/utils/qsofaScreeningEvaluator.js';

describe('qSOFA Sepsis Screening Tests', () => {
  test('triggers sepsis alert when 2 or more criteria are met', () => {
    const res = evaluateQsofa({
      respiratoryRate: 24,
      gcs: 13,
      systolicBp: 95
    });
    assert.equal(res.qsofaScore, 3);
    assert.equal(res.sepsisHighRisk, true);
    assert.ok(res.alert.includes('HIGH SEPSIS RISK'));
  });
});
