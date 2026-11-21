/**
 * Clinical Body Mass Index (BMI) & Basal Metabolic Rate (BMR) Calculator
 */
export class BmiHealthCategory {
  static evaluate(weightKg, heightCm, ageYears, gender = 'male') {
    if (weightKg <= 0 || heightCm <= 0 || ageYears <= 0) {
      throw new Error('Weight, height, and age must be strictly positive');
    }

    const heightM = heightCm / 100.0;
    const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

    let category = 'NORMAL_WEIGHT';
    if (bmi < 18.5) category = 'UNDERWEIGHT';
    else if (bmi < 25.0) category = 'NORMAL_WEIGHT';
    else if (bmi < 30.0) category = 'OVERWEIGHT';
    else category = 'OBESE';

    // Mifflin-St Jeor Equation for BMR
    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears);
    bmr += gender.toLowerCase() === 'male' ? 5 : -161;

    return {
      bmi,
      category,
      basalMetabolicRateKcal: Math.round(bmr)
    };
  }
}
