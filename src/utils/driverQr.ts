const PREFIX = 'payasyougo:driver:';

/** Payload encoded in the driver’s QR code */
export function encodeDriverQr(driverId: string): string {
  const id = String(driverId || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  return `${PREFIX}${id}`;
}

/** Accepts PayAsYouGo QR payloads or a raw driver ID like DRV100 */
export function parseDriverQr(raw: string): string | null {
  const text = String(raw || '').trim();
  if (!text) return null;

  if (text.toLowerCase().startsWith(PREFIX)) {
    const id = text.slice(PREFIX.length).toUpperCase().replace(/[^A-Z0-9]/g, '');
    return id.length >= 5 ? id : null;
  }

  // plain driver code pasted/scanned
  const plain = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (/^DRV[A-Z0-9]{2,}$/.test(plain)) return plain;

  return null;
}
