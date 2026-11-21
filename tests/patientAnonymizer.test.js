import test from 'node:test';
import assert from 'node:assert/strict';
import { PatientDataAnonymizer } from '../src/utils/patientDataAnonymizer.js';

test('HIPAA Anonymizer Tests', async (t) => {
  await t.test('should redact direct identifiers and generate deterministic surrogate ID', () => {
    const record = {
      name: 'John Doe',
      ssnOrId: 'SSN-999',
      dateOfBirth: '1985-05-12',
      gender: 'M',
      diagnosisCode: 'E11.9'
    };
    const anonymized = PatientDataAnonymizer.pseudonymize(record);
    assert.equal(anonymized.name, '[REDACTED]');
    assert.equal(anonymized.yearOfBirth, 1985);
    assert.equal(anonymized.diagnosisCode, 'E11.9');
    assert.equal(anonymized.surrogatePatientId.length, 16);
  });
});
