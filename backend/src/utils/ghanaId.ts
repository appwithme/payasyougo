/** Ghana Card personal ID — official pattern GHA-XXXXXXXXX-X */
const GHANA_CARD_RE = /^GHA-\d{9}-\d$/i;

/** Ghana DVLA licence — common formats e.g. DL1234567 or NAG-03102017-10785 */
const LICENSE_RE = /^[A-Z]{1,3}[-\s]?\d{5,12}([-\s]?\d{3,8})?[A-Z]?$/i;

export function normalizeGhanaCard(raw: string): string {
  const cleaned = raw.trim().toUpperCase().replace(/\s+/g, '');
  if (GHANA_CARD_RE.test(cleaned)) return cleaned;
  // Allow typed digits only → wrap as GHA-XXXXXXXXX-X when 10 digits
  const digits = cleaned.replace(/\D/g, '');
  if (digits.length === 10) {
    return `GHA-${digits.slice(0, 9)}-${digits.slice(9)}`;
  }
  return cleaned;
}

export function isValidGhanaCardFormat(raw: string): boolean {
  return GHANA_CARD_RE.test(normalizeGhanaCard(raw));
}

export function normalizeLicense(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, '');
}

export function isValidLicenseFormat(raw: string): boolean {
  const n = normalizeLicense(raw);
  return n.length >= 6 && n.length <= 20 && LICENSE_RE.test(n);
}

export type IdVerifyType = 'ghana_card' | 'license';

/** Format + basic integrity check (no live NIA/DVLA API in campus pilot). */
export function verifyIdentityDocument(
  type: IdVerifyType,
  number: string
): { verified: boolean; normalized: string; message: string } {
  if (type === 'ghana_card') {
    const normalized = normalizeGhanaCard(number);
    if (!isValidGhanaCardFormat(normalized)) {
      return {
        verified: false,
        normalized,
        message: 'Enter a valid Ghana Card number (e.g. GHA-123456789-0).',
      };
    }
    return {
      verified: true,
      normalized,
      message: 'Ghana Card format verified.',
    };
  }

  const normalized = normalizeLicense(number);
  if (!isValidLicenseFormat(normalized)) {
    return {
      verified: false,
      normalized,
      message: 'Enter a valid driver licence number (at least 6 characters).',
    };
  }
  return {
    verified: true,
    normalized,
    message: 'Driver licence format verified.',
  };
}
