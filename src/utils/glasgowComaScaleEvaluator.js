/**
 * Glasgow Coma Scale (GCS) Assessment (3 - 15)
 */
export function evaluateGcs({ eyeResponse, verbalResponse, motorResponse }) {
  const e = Math.max(1, Math.min(4, eyeResponse || 1));
  const v = Math.max(1, Math.min(5, verbalResponse || 1));
  const m = Math.max(1, Math.min(6, motorResponse || 1));
  const total = e + v + m;

  let severity = 'Mild Brain Injury (GCS 13-15)';
  if (total <= 8) severity = 'Severe Brain Injury (GCS 3-8) - Intubation Indicated';
  else if (total <= 12) severity = 'Moderate Brain Injury (GCS 9-12)';

  return {
    gcsTotal: total,
    breakdown: { eye: e, verbal: v, motor: m },
    severity
  };
}
