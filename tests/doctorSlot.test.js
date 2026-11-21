import test from 'node:test';
import assert from 'node:assert/strict';
import { DoctorSlotAvailability } from '../src/utils/doctorSlotAvailability.js';

test('Doctor Slot Availability Tests', async (t) => {
  await t.test('should detect schedule conflict for doctor', () => {
    const existing = [
      { id: 'APP-1', doctorId: 'DOC-9', startTime: '2026-12-01T10:00:00Z', endTime: '2026-12-01T10:30:00Z' }
    ];
    const res = DoctorSlotAvailability.isSlotAvailable(existing, 'DOC-9', '2026-12-01T10:15:00Z', '2026-12-01T10:45:00Z');
    assert.equal(res.available, false);
    assert.equal(res.conflictAppointmentId, 'APP-1');
  });
});
