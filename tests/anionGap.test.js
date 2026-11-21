import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateAnionGap } from '../src/utils/anionGapElectrolyteBalance.js';

describe('Anion Gap Electrolyte Tests', () => {
  test('diagnoses High Anion Gap Metabolic Acidosis (HAGMA)', () => {
    const res = calculateAnionGap({
      sodium: 140,
      chloride: 100,
      bicarbonate: 16
    });
    assert.equal(res.anionGap, 24);
    assert.equal(res.interpretation, 'High Anion Gap Metabolic Acidosis (HAGMA)');
  });
});
