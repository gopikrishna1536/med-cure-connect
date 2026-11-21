import test from 'node:test';
import assert from 'node:assert/strict';
import { MedicalInsuranceCopay } from '../src/utils/medicalInsuranceCopay.js';

test('Insurance Copay Tests', async (t) => {
  await t.test('should calculate patient liability under deductible and 20% coinsurance', () => {
    // $1000 claim, $200 deductible remaining (leaves $800 balance), 20% coinsurance ($160) -> $360 patient, $640 insurer
    const res = MedicalInsuranceCopay.calculatePatientLiability(1000, 200, 20, 5000);
    assert.equal(res.deductiblePaid, 200);
    assert.equal(res.finalPatientLiability, 360);
    assert.equal(res.insurerLiability, 640);
  });
});
