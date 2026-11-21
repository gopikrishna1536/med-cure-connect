import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateMedicationRefill } from '../src/utils/refillReminder.js';

describe('Medication Dosage & Refill Schedule Tests', () => {
  test('should calculate healthy supply when many doses remain', () => {
    // 60 pills, 1 pill twice a day = 30 days supply
    // 10 days elapsed -> 20 days remaining
    const startDate = '2026-01-01T00:00:00.000Z';
    const asOfDate = '2026-01-11T00:00:00.000Z';

    const refill = calculateMedicationRefill({
      medicationName: 'Metformin 500mg',
      totalPills: 60,
      pillsPerDose: 1,
      dosesPerDay: 2,
      startDate,
      asOfDate
    });

    assert.equal(refill.dailyConsumption, 2);
    assert.equal(refill.daysTotalSupply, 30);
    assert.equal(refill.daysElapsed, 10);
    assert.equal(refill.pillsRemaining, 40);
    assert.equal(refill.daysRemaining, 20);
    assert.equal(refill.status, 'HEALTHY_SUPPLY');
    assert.equal(refill.priority, 'LOW');
    assert.equal(refill.depletionDate, '2026-01-31');
  });

  test('should trigger REFILL_DUE when 4 days remaining', () => {
    const startDate = '2026-01-01T00:00:00.000Z';
    const asOfDate = '2026-01-27T00:00:00.000Z'; // 26 days elapsed out of 30

    const refill = calculateMedicationRefill({
      medicationName: 'Atorvastatin 20mg',
      totalPills: 30,
      pillsPerDose: 1,
      dosesPerDay: 1,
      startDate,
      asOfDate
    });

    assert.equal(refill.daysRemaining, 4);
    assert.equal(refill.status, 'REFILL_DUE');
    assert.equal(refill.priority, 'MEDIUM');
  });

  test('should trigger URGENT_REFILL_NEEDED when 2 days remaining', () => {
    const startDate = '2026-01-01T00:00:00.000Z';
    const asOfDate = '2026-01-29T00:00:00.000Z'; // 28 days elapsed out of 30

    const refill = calculateMedicationRefill({
      medicationName: 'Levothyroxine 50mcg',
      totalPills: 30,
      pillsPerDose: 1,
      dosesPerDay: 1,
      startDate,
      asOfDate
    });

    assert.equal(refill.daysRemaining, 2);
    assert.equal(refill.status, 'URGENT_REFILL_NEEDED');
    assert.equal(refill.priority, 'HIGH');
  });

  test('should trigger DEPLETED_REFILL_URGENT when stock reaches zero', () => {
    const startDate = '2026-01-01T00:00:00.000Z';
    const asOfDate = '2026-02-05T00:00:00.000Z'; // 35 days elapsed

    const refill = calculateMedicationRefill({
      medicationName: 'Amlodipine 5mg',
      totalPills: 30,
      pillsPerDose: 1,
      dosesPerDay: 1,
      startDate,
      asOfDate
    });

    assert.equal(refill.daysRemaining, 0);
    assert.equal(refill.pillsRemaining, 0);
    assert.equal(refill.status, 'DEPLETED_REFILL_URGENT');
    assert.equal(refill.priority, 'CRITICAL');
  });
});
