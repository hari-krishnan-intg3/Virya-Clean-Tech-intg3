import assert from 'node:assert/strict';
import { test } from 'node:test';
import bcrypt from 'bcryptjs';
import {
  passwordIsValid,
  usernameIsValid,
} from '../controller/auth.js';
import {
  authorizeJiraOperation,
  validateLeadPayload,
} from '../controller/security.js';

test('Jira operations are restricted by role and project', () => {
  process.env.JIRA_SECURITY_CONTROLLER = 'SEQ';

  assert.equal(authorizeJiraOperation('create', 'VCT', 'VCT'), true);
  assert.equal(authorizeJiraOperation('create', 'OTHER', 'VCT', 'operator'), false);
  assert.equal(authorizeJiraOperation('delete', 'VCT', 'VCT', 'operator'), false);
  assert.equal(authorizeJiraOperation('delete', 'VCT', 'VCT', 'admin'), true);
  assert.equal(authorizeJiraOperation('create', 'VCT', 'VCT', 'admin'), true);
});

test('controller registration validates user IDs, passwords, and lead inputs', async () => {
  assert.equal(usernameIsValid('operator1'), true);
  assert.equal(usernameIsValid('x'), false);
  assert.equal(passwordIsValid('LongUniquePass123'), true);
  assert.equal(passwordIsValid('short'), false);
  assert.deepEqual(validateLeadPayload({ fullName: 'Jane Doe', email: 'jane@example.com' }), []);
  assert.ok(validateLeadPayload({ fullName: 'Jane\nDoe', email: 'jane@example.com' }).length > 0);

  const plainPassword = 'LongUniquePass123';
  const passwordHash = await bcrypt.hash(plainPassword, 4);
  assert.notEqual(passwordHash, plainPassword);
  assert.equal(await bcrypt.compare(plainPassword, passwordHash), true);
  assert.equal(await bcrypt.compare('different-password', passwordHash), false);
});