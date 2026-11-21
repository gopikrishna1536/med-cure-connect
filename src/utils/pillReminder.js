/**
 * Patient Pill Reminder Schedule & Daily Dose Matrix Generator.
 */

const STANDARD_DOSE_TIMES = {
  OD: ['09:00 AM'],
  BD: ['09:00 AM', '09:00 PM'],
  TID: ['08:00 AM', '02:00 PM', '08:00 PM'],
  QID: ['06:00 AM', '12:00 PM', '06:00 PM', '10:00 PM'],
  QHS: ['10:00 PM']
};

class PillReminderEngine {
  /**
   * Generates a chronologically sorted daily medication reminder schedule for a patient.
   * @param {Array<Object>} prescriptions - [{ medicationName, frequency: 'BD', instructions: 'After food' }]
   * @returns {Array<Object>} Chronological daily reminders [{ time, medication, instructions }]
   */
  static generateDailySchedule(prescriptions = []) {
    if (!Array.isArray(prescriptions)) return [];

    const schedule = [];

    prescriptions.forEach(p => {
      const freq = (p.frequency || 'OD').toUpperCase().trim();
      const times = STANDARD_DOSE_TIMES[freq] || STANDARD_DOSE_TIMES.OD;
      const instructions = p.instructions || 'With a glass of water';

      times.forEach(timeStr => {
        schedule.push({
          time: timeStr,
          medication: p.medicationName,
          dosage: p.dosage || '1 tablet',
          instructions
        });
      });
    });

    // Sort chronologically by 24h equivalent time
    const toMinutes = (timeStr) => {
      const [timePart, modifier] = timeStr.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    schedule.sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
    return schedule;
  }
}

export { PillReminderEngine, STANDARD_DOSE_TIMES };
