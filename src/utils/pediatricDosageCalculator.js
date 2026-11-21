/**
 * Clinical Pediatric Dosage Calculator (Clark's Rule and Young's Rule)
 */
export class PediatricDosageCalculator {
  // Clark's Rule: Child Dose = (Weight in lbs / 150) * Adult Dose
  static byWeightClark(childWeightKg, adultDoseMg) {
    const weightLbs = childWeightKg * 2.20462;
    const childDose = (weightLbs / 150.0) * adultDoseMg;
    return Number(childDose.toFixed(1));
  }

  // Young's Rule: Child Dose = (Age / (Age + 12)) * Adult Dose
  static byAgeYoung(childAgeYears, adultDoseMg) {
    if (childAgeYears <= 0 || childAgeYears >= 18) {
      throw new Error('Age must be between 1 and 17 years for Young\'s rule');
    }
    const childDose = (childAgeYears / (childAgeYears + 12.0)) * adultDoseMg;
    return Number(childDose.toFixed(1));
  }
}
