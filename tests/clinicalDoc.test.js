import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Clinical Documentation Tests', () => {
  test('confirms clinical architecture specification is present', () => {
    const docPath = path.join(__dirname, '..', 'docs', 'CLINICAL_DECISION_SUPPORT_SPEC.md');
    assert.ok(fs.existsSync(docPath));
    const content = fs.readFileSync(docPath, 'utf8');
    assert.ok(content.includes('Med-Cure Connect - Clinical Decision Support'));
  });
});
