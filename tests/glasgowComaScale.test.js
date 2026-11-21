import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateGcs } from '../src/utils/glasgowComaScaleEvaluator.js';

describe('Glasgow Coma Scale Tests', () => {
  test('evaluates GCS and alerts on severe brain injury', () => {
    const res = evaluateGcs({ eyeResponse: 2, verbalResponse: 2, motorResponse: 3 });
    assert.equal(res.gcsTotal, 7);
    assert.ok(res.severity.includes('Severe Brain Injury'));
  });
});
