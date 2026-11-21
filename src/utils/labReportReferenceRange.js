/**
 * Clinical Laboratory Reference Range Validator
 */
export class LabReportReferenceRange {
  static REFERENCE_RANGES = {
    hemoglobin_male: { min: 13.8, max: 17.2, unit: 'g/dL' },
    hemoglobin_female: { min: 12.1, max: 15.1, unit: 'g/dL' },
    fasting_glucose: { min: 70, max: 99, unit: 'mg/dL' },
    total_cholesterol: { min: 125, max: 200, unit: 'mg/dL' }
  };

  static evaluateResult(testKey, value) {
    const range = LabReportReferenceRange.REFERENCE_RANGES[testKey];
    if (!range) throw new Error(`Unknown lab test parameter: ${testKey}`);

    let flag = 'NORMAL';
    if (value < range.min) flag = 'LOW';
    else if (value > range.max) flag = 'HIGH';

    return {
      testKey,
      value,
      unit: range.unit,
      referenceMin: range.min,
      referenceMax: range.max,
      flag,
      isAbnormal: flag !== 'NORMAL'
    };
  }
}
