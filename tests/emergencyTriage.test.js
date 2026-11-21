import test from 'node:test';
import assert from 'node:assert/strict';
import { EmergencyTriagePriority } from '../src/utils/emergencyTriagePriority.js';

test('Emergency Triage Tests', async (t) => {
  await t.test('should triage life-saving condition as ESI Level 1', () => {
    const res = EmergencyTriagePriority.determineTriageLevel(true, false, 3, false);
    assert.equal(res.level, 1);
    assert.equal(res.urgency, 'RESUSCITATION');
  });

  await t.test('should triage stable patient needing lab and X-ray as Level 3', () => {
    const res = EmergencyTriagePriority.determineTriageLevel(false, false, 2, true);
    assert.equal(res.level, 3);
    assert.equal(res.urgency, 'URGENT');
  });
});
