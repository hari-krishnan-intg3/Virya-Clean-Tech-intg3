import { createHash, timingSafeEqual } from 'node:crypto';

export const SECURITY_CONTROLLER_CODE = 'SEQ';

export function isSameOriginRequest(origin: unknown, host: unknown): boolean {
  if (typeof origin !== 'string' || typeof host !== 'string') return false;

  try {
    return new URL(origin).host.toLowerCase() === host.toLowerCase();
  } catch {
    return false;
  }
}

export function matchesSecret(candidate: string | undefined, expected: string | undefined): boolean {
  if (typeof candidate !== 'string' || !expected) return false;

  const candidateHash = createHash('sha256').update(candidate).digest();
  const expectedHash = createHash('sha256').update(expected).digest();
  return timingSafeEqual(candidateHash, expectedHash);
}

export type JiraOperation = 'create' | 'update' | 'delete';

export function authorizeJiraOperation(
  operation: JiraOperation,
  projectKey: string,
  allowedProjectKey: string | undefined,
  role?: 'operator' | 'admin',
): boolean {
  const roleAllowsOperation =
    role === undefined
      ? operation === 'create'
      : role === 'admin' || (role === 'operator' && operation === 'create');

  return (
    process.env.JIRA_SECURITY_CONTROLLER?.trim() === SECURITY_CONTROLLER_CODE &&
    roleAllowsOperation &&
    /^[A-Z][A-Z0-9]{1,9}$/.test(projectKey) &&
    projectKey === allowedProjectKey
  );
}

export function validateLeadPayload(value: Record<string, unknown>): string[] {
  const errors: string[] = [];
  const fullName = value.fullName;
  const email = value.email;

  if (
    typeof fullName !== 'string' ||
    fullName.trim().length < 2 ||
    fullName.length > 120 ||
    /[\u0000-\u001F\u007F]/.test(fullName)
  ) {
    errors.push('fullName must contain between 2 and 120 characters');
  }
  if (
    typeof email !== 'string' ||
    email.length > 200 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    errors.push('email must be a valid address');
  }

  const fieldLimits: Record<string, number> = {
    phone: 40,
    company: 120,
    service: 80,
    consumption: 80,
    capacity: 80,
    location: 160,
    details: 3000,
    source: 40,
  };
  for (const [field, limit] of Object.entries(fieldLimits)) {
    const fieldValue = value[field];
    const containsControlCharacters =
      typeof fieldValue === 'string' &&
      (field === 'details'
        ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(fieldValue)
        : /[\u0000-\u001F\u007F]/.test(fieldValue));
    if (
      fieldValue !== undefined &&
      (typeof fieldValue !== 'string' || fieldValue.length > limit || containsControlCharacters)
    ) {
      errors.push(`${field} is invalid or too long`);
    }
  }

  if (
    value.context !== undefined &&
    (typeof value.context !== 'object' || value.context === null || Array.isArray(value.context))
  ) {
    errors.push('context must be an object');
  } else if (value.context && JSON.stringify(value.context).length > 20000) {
    errors.push('context is too large');
  }

  return errors;
}