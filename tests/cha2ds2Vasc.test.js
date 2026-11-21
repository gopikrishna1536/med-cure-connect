import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateCha2ds2Vasc } from '../src/utils/cha2ds2VascScorer.js';

describe('CHA2DS2-VASc Stroke Risk Tests', () => {
  test('identifies high risk atrial fibrillation requiring oral anticoagulation', () => {
    const res = calculateCha2ds2Vasc({
      congestiveHeartFailure: true,
      hypertension: true,
      age: 76,
      diabetes: true,
      priorStrokeOrTia: false,
      vascularDisease: true,
      isFemale: false
    });
    assert.ok(res.rawScore >= 5);
    assert.equal(res.anticoagulationRecommended, true);
  });
});
