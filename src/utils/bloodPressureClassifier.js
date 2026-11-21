/**
 * American Heart Association (AHA/ACC) Blood Pressure Stage Classifier
 */
export class BloodPressureClassifier {
  static classify(systolicMmHg, diastolicMmHg) {
    if (systolicMmHg <= 0 || diastolicMmHg <= 0) {
      throw new Error('Blood pressure values must be positive non-zero');
    }

    if (systolicMmHg > 180 || diastolicMmHg > 120) {
      return { stage: 'HYPERTENSIVE_CRISIS', requiresEmergencyCare: true };
    }
    if (systolicMmHg >= 140 || diastolicMmHg >= 90) {
      return { stage: 'HYPERTENSION_STAGE_2', requiresEmergencyCare: false };
    }
    if ((systolicMmHg >= 130 && systolicMmHg <= 139) || (diastolicMmHg >= 80 && diastolicMmHg <= 89)) {
      return { stage: 'HYPERTENSION_STAGE_1', requiresEmergencyCare: false };
    }
    if (systolicMmHg >= 120 && systolicMmHg <= 129 && diastolicMmHg < 80) {
      return { stage: 'ELEVATED', requiresEmergencyCare: false };
    }
    return { stage: 'NORMAL', requiresEmergencyCare: false };
  }
}
