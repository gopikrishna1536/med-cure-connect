import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { PillReminderEngine } from '../src/utils/pillReminder.js';

describe('Patient Pill Reminder Schedule Tests', () => {
  test('should generate sorted daily schedule for multiple prescriptions', () => {
    const prescriptions = [
      { medicationName: 'Metformin 500mg', frequency: 'BD', instructions: 'After meals' },
      { medicationName: 'Atorvastatin 20mg', frequency: 'QHS', instructions: 'At bedtime' },
      { medicationName: 'Pantoprazole 40mg', frequency: 'OD', instructions: 'Before breakfast' }
    ];

    const schedule = PillReminderEngine.generateDailySchedule(prescriptions);
    assert.equal(schedule.length, 4); // BD (2) + QHS (1) + OD (1) = 4 reminders

    // Morning reminders at 09:00 AM
    assert.equal(schedule[0].time, '09:00 AM');
    assert.equal(schedule[1].time, '09:00 AM');
    // Evening reminder at 09:00 PM
    assert.equal(schedule[2].time, '09:00 PM');
    // Night bedtime reminder at 10:00 PM
    assert.equal(schedule[3].time, '10:00 PM');
    assert.equal(schedule[3].medication, 'Atorvastatin 20mg');
  });

  test('should return empty schedule when no prescriptions passed', () => {
    const schedule = PillReminderEngine.generateDailySchedule([]);
    assert.equal(schedule.length, 0);
  });
});
