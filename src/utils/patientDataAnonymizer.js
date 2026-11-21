import crypto from 'node:crypto';

/**
 * HIPAA Safe Harbor De-Identification & Pseudonymization Engine
 */
export class PatientDataAnonymizer {
  static pseudonymize(patientRecord, saltKey = 'hipaa_salt_123') {
    const surrogateId = crypto
      .createHash('sha256')
      .update(`${patientRecord.ssnOrId}:${saltKey}`)
      .digest('hex')
      .slice(0, 16);

    return {
      surrogatePatientId: surrogateId,
      yearOfBirth: new Date(patientRecord.dateOfBirth).getFullYear(),
      gender: patientRecord.gender,
      diagnosisCode: patientRecord.diagnosisCode,
      // Stripped PII fields
      name: '[REDACTED]',
      address: '[REDACTED]',
      phone: '[REDACTED]'
    };
  }
}
