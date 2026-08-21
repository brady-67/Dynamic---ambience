import { createClient } from '@supabase/supabase-js';

const isProd = (process.env.MPESA_ENV ?? 'sandbox') === 'production';

export const DARAJA_BASE_URL = isProd
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export async function getDarajaAccessToken(): Promise<string> {
  const key = requiredEnv('MPESA_CONSUMER_KEY');
  const secret = requiredEnv('MPESA_CONSUMER_SECRET');
  const credentials = Buffer.from(`${key}:${secret}`).toString('base64');

  const res = await fetch(
    `${DARAJA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${credentials}` } },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Daraja OAuth failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

/** Timestamp in the exact yyyyMMddHHmmss format Daraja requires, in EAT (UTC+3). */
export function darajaTimestamp(): string {
  const now = new Date(Date.now() + 3 * 60 * 60 * 1000); // shift to Africa/Nairobi (UTC+3)
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    now.getUTCFullYear().toString() +
    pad(now.getUTCMonth() + 1) +
    pad(now.getUTCDate()) +
    pad(now.getUTCHours()) +
    pad(now.getUTCMinutes()) +
    pad(now.getUTCSeconds())
  );
}

export function darajaPassword(shortcode: string, passkey: string, timestamp: string): string {
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
}

/**
 * Normalizes a Kenyan phone number to Safaricom's required 2547XXXXXXXX /
 * 2541XXXXXXXX format, accepting common local formats as input.
 */
export function normalizeKenyanPhone(input: string): string | null {
  const digits = input.replace(/\D/g, '');
  if (/^254(7|1)\d{8}$/.test(digits)) return digits;
  if (/^0(7|1)\d{8}$/.test(digits)) return `254${digits.slice(1)}`;
  if (/^(7|1)\d{8}$/.test(digits)) return `254${digits}`;
  return null;
}

export function supabaseServerClient() {
  const url = requiredEnv('VITE_SUPABASE_URL');
  const anonKey = requiredEnv('VITE_SUPABASE_ANON_KEY');
  return createClient(url, anonKey);
}
