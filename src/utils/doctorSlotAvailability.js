/**
 * Outpatient Doctor Consultation Slot Availability & Overlap Checker
 */
export class DoctorSlotAvailability {
  static isSlotAvailable(existingAppointments, doctorId, requestedStartIso, requestedEndIso) {
    const reqStart = new Date(requestedStartIso).getTime();
    const reqEnd = new Date(requestedEndIso).getTime();

    for (const app of existingAppointments) {
      if (app.doctorId === doctorId && app.status !== 'CANCELLED') {
        const appStart = new Date(app.startTime).getTime();
        const appEnd = new Date(app.endTime).getTime();

        if (reqStart < appEnd && reqEnd > appStart) {
          return { available: false, conflictAppointmentId: app.id };
        }
      }
    }

    return { available: true };
  }
}
