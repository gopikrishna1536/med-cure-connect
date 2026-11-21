import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  validatePrescriptionMetadata,
  checkDrugInteractions,
  validateDosageInstructions
} from '../src/utils/prescriptionValidator.js';

describe('Pharmacy Prescription Validation & Safety Checker Tests', () => {
  test('should validate valid recent doctor prescription', () => {
    const today = new Date().toISOString().split('T')[0];
    const validation = validatePrescriptionMetadata({
      doctorRegNo: 'MCI-987654',
      issuedDate: today,
      validityDays: 30
    });

    assert.equal(validation.isValid, true);
    assert.equal(validation.ageDays, 0);
  });

  test('should reject expired or future prescriptions', () => {
    // 60 days ago with 30 day validity
    const oldDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
    const expired = validatePrescriptionMetadata({
      doctorRegNo: 'MCI-12345',
      issuedDate: oldDate,
      validityDays: 30
    });
    assert.equal(expired.isValid, false);
    assert.ok(expired.reason.includes('expired'));

    // Future date
    const futureDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
    const future = validatePrescriptionMetadata({
      doctorRegNo: 'MCI-12345',
      issuedDate: futureDate
    });
    assert.equal(future.isValid, false);
    assert.ok(future.reason.includes('future'));
  });

  test('should detect critical dangerous drug interactions', () => {
    const medications = ['Warfarin 5mg Tablets', 'Aspirin 81mg Cardioprotect', 'Atorvastatin 20mg'];
    const check = checkDrugInteractions(medications);

    assert.equal(check.hasInteractions, true);
    assert.equal(check.warnings.length, 1);
    assert.equal(check.warnings[0].severity, 'HIGH');
    assert.ok(check.warnings[0].warning.includes('hemorrhage'));
  });

  test('should flag fatal sildenafil and nitroglycerin interaction as CRITICAL', () => {
    const medications = ['Sildenafil 50mg', 'Sublingual Nitroglycerin'];
    const check = checkDrugInteractions(medications);

    assert.equal(check.hasInteractions, true);
    assert.equal(check.criticalCount, 1);
    assert.equal(check.warnings[0].severity, 'CRITICAL');
  });

  test('should validate dosage frequencies and quantity integers', () => {
    const list = [
      { medication: 'Amoxicillin 500mg', frequency: 'TID', quantity: 21 },
      { medication: 'Paracetamol 650mg', frequency: 'SOS', quantity: 10 }
    ];

    const validated = validateDosageInstructions(list);
    assert.equal(validated.length, 2);
    assert.equal(validated[0].isStandardFrequency, true);
    assert.equal(validated[0].isValidQuantity, true);
  });
});
