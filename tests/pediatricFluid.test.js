import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculatePediatricMaintenanceFluid } from '../src/utils/pediatricFluidDeficit.js';

describe('Pediatric Maintenance IV Fluid Tests', () => {
  test('calculates Holliday-Segar fluid rates across weight ranges', () => {
    const child8kg = calculatePediatricMaintenanceFluid(8);
    assert.equal(child8kg.hourlyRateMl, 32);

    const child15kg = calculatePediatricMaintenanceFluid(15);
    assert.equal(child15kg.hourlyRateMl, 50);

    const child25kg = calculatePediatricMaintenanceFluid(25);
    assert.equal(child25kg.hourlyRateMl, 65);
  });
});
