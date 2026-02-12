/**
 * Generates a SHA-256 hash for certificate data
 * Format: id|name|program|date|secret
 */
export const generateCertificateHash = async (data: {
  certificate_id: string;
  recipient_name: string;
  program_name: string;
  completion_date: string;
}): Promise<string> => {
  const secret = "MANAS360_PRIVATE_SECRET_2025";
  const hashString = `${data.certificate_id}|${data.recipient_name}|${data.program_name}|${data.completion_date}|${secret}`;
  
  const msgUint8 = new TextEncoder().encode(hashString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
};