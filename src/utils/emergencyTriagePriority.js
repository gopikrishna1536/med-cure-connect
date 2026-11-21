/**
 * Emergency Severity Index (ESI) 5-Level Triage Acuity Scorer
 * Level 1: Immediate resuscitation required
 * Level 2: High risk / altered mental state / severe pain
 * Level 3: Multiple diagnostic resources needed
 * Level 4: One diagnostic resource needed
 * Level 5: No diagnostic resources needed (routine prescription refill)
 */
export class EmergencyTriagePriority {
  static determineTriageLevel(requiresImmediateLifeSaving, isHighRiskConfusedSeverePain, resourceCountNeeded, vitalsStable) {
    if (requiresImmediateLifeSaving) return { level: 1, urgency: 'RESUSCITATION' };
    if (isHighRiskConfusedSeverePain) return { level: 2, urgency: 'EMERGENT' };

    if (!vitalsStable) return { level: 2, urgency: 'EMERGENT' };

    if (resourceCountNeeded >= 2) return { level: 3, urgency: 'URGENT' };
    if (resourceCountNeeded === 1) return { level: 4, urgency: 'LESS_URGENT' };
    return { level: 5, urgency: 'NON_URGENT' };
  }
}
