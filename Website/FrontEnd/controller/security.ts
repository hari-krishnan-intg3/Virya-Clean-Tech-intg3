import { createHash, timingSafeEqual } from 'node:crypto';

export function matchesSecret(candidate: string | undefined, expected: string | undefined): boolean {
  if (typeof candidate !== 'string' || !expected) return false;

  const candidateHash = createHash('sha256').update(candidate).digest();
  const expectedHash = createHash('sha256').update(expected).digest();
  return timingSafeEqual(candidateHash, expectedHash);
}