/**
 * Prescription Validation and Drug-Drug Interaction Safety Checker.
 */

// Critical severe adverse drug interaction pairs
const DANGEROUS_INTERACTIONS = [
  {
    pair: ['warfarin', 'aspirin'],
    severity: 'HIGH',
    risk: 'Significantly elevated risk of major gastrointestinal hemorrhage.'
  },
  {
    pair: ['sildenafil', 'nitroglycerin'],
    severity: 'CRITICAL',
    risk: 'Severe, potentially fatal hypotensive collapse.'
  },
  {
    pair: ['metformin', 'iodinated contrast'],
    severity: 'HIGH',
    risk: 'Increased susceptibility to contrast-induced acute lactic acidosis.'
  },
  {
    pair: ['simvastatin', 'clarithromycin'],
    severity: 'HIGH',
    risk: 'Inhibition of CYP3A4 leading to rhabdomyolysis and severe myopathy.'
  },
  {
    pair: ['lisinopril', 'spironolactone'],
    severity: 'MODERATE',
    risk: 'Elevated risk of severe hyperkalemia.'
  }
];

const VALID_DOSAGE_FREQUENCIES = ['OD', 'BD', 'TID', 'QID', 'PRN', 'SOS', 'STAT', 'QHS'];

/**
 * Validates doctor registration and prescription date freshness.
 */
export function validatePrescriptionMetadata(prescription) {
  const { doctorRegNo, issuedDate, validityDays = 30 } = prescription;

  if (!doctorRegNo || typeof doctorRegNo !== 'string' || doctorRegNo.trim().length < 5) {
    return {
      isValid: false,
      reason: 'Invalid or missing Doctor Medical Council Registration Number'
    };
  }

  if (!issuedDate) {
    return {
      isValid: false,
      reason: 'Missing prescription issuance date'
    };
  }

  const issued = new Date(issuedDate);
  const now = new Date();
  const diffTime = now.getTime() - issued.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      isValid: false,
      reason: 'Prescription issue date cannot be in the future'
    };
  }

  if (diffDays > validityDays) {
    return {
      isValid: false,
      reason: `Prescription has expired (${diffDays} days old, max validity is ${validityDays} days)`
    };
  }

  return {
    isValid: true,
    ageDays: diffDays,
    expiresInDays: validityDays - diffDays
  };
}

/**
 * Scans a list of prescribed medications for known drug-drug interactions.
 */
export function checkDrugInteractions(drugNames = []) {
  const normalized = drugNames.map(d => String(d).trim().toLowerCase());
  const warnings = [];

  for (const rule of DANGEROUS_INTERACTIONS) {
    const [drugA, drugB] = rule.pair;
    const hasA = normalized.some(d => d.includes(drugA));
    const hasB = normalized.some(d => d.includes(drugB));

    if (hasA && hasB) {
      warnings.push({
        severity: rule.severity,
        drugs: [drugA, drugB],
        warning: rule.risk
      });
    }
  }

  return {
    hasInteractions: warnings.length > 0,
    criticalCount: warnings.filter(w => w.severity === 'CRITICAL').length,
    warnings
  };
}

/**
 * Validates dosage instructions.
 */
export function validateDosageInstructions(instructions = []) {
  return instructions.map(inst => {
    const freq = (inst.frequency || '').toUpperCase().trim();
    const isStandardFreq = VALID_DOSAGE_FREQUENCIES.includes(freq);
    const quantity = Number(inst.quantity || 0);

    return {
      medication: inst.medication,
      frequency: freq,
      isStandardFrequency: isStandardFreq,
      isValidQuantity: quantity > 0 && Number.isInteger(quantity),
      quantity
    };
  });
}
