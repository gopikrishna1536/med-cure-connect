import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateApgar } from '../src/utils/apgarScoreEvaluator.js';

describe('Neonatal APGAR Score Tests', () => {
  test('evaluates healthy newborn APGAR score', () => {
    const res = evaluateApgar({
      heartRateBpm: 120,
      respiratoryEffort: 2,
      muscleTone: 2,
      reflexIrritability: 2,
      color: 2
    });
    assert.equal(res.score, 10);
    assert.equal(res.status, 'Reassuring');
  });
});
