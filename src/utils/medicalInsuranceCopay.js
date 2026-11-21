/**
 * Health Insurance Claim & Deductible Apportioner
 */
export class MedicalInsuranceCopay {
  static calculatePatientLiability(claimAmount, remainingDeductible, coinsurancePercent, remainingOutOfPocketMax) {
    if (claimAmount <= 0) throw new Error('Claim amount must be positive');

    // 1. Pay deductible first
    const deductiblePaid = Math.min(claimAmount, remainingDeductible);
    const balanceAfterDeductible = claimAmount - deductiblePaid;

    // 2. Coinsurance on remaining balance
    const coinsuranceAmount = balanceAfterDeductible * (coinsurancePercent / 100);

    // 3. Subject to out of pocket maximum
    const initialPatientTotal = deductiblePaid + coinsuranceAmount;
    const finalPatientLiability = Math.min(initialPatientTotal, remainingOutOfPocketMax);
    const insurerLiability = Number((claimAmount - finalPatientLiability).toFixed(2));

    return {
      claimAmount,
      deductiblePaid: Number(deductiblePaid.toFixed(2)),
      coinsurancePaid: Number((finalPatientLiability - deductiblePaid).toFixed(2)),
      finalPatientLiability: Number(finalPatientLiability.toFixed(2)),
      insurerLiability
    };
  }
}
