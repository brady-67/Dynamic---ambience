import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  DARAJA_BASE_URL,
  darajaPassword,
  darajaTimestamp,
  getDarajaAccessToken,
  normalizeKenyanPhone,
  requiredEnv,
  supabaseServerClient,
} from '../_lib/daraja.js';

interface StkPushBody {
  phone: string;
  amount: number;
  orderSummary?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = req.body as StkPushBody;
    const phone = normalizeKenyanPhone(body?.phone ?? '');
    const amount = Math.round(Number(body?.amount));

    if (!phone) {
      res.status(400).json({ error: 'Enter a valid Safaricom number, e.g. 07XXXXXXXX.' });
      return;
    }
    if (!Number.isFinite(amount) || amount < 1) {
      res.status(400).json({ error: 'Invalid amount.' });
      return;
    }

    const shortcode = requiredEnv('MPESA_SHORTCODE');
    const passkey = requiredEnv('MPESA_PASSKEY');
    const callbackUrl = requiredEnv('MPESA_CALLBACK_URL');
    const accountReference = process.env.MPESA_ACCOUNT_REFERENCE || 'Dynamic Ambience';

    const timestamp = darajaTimestamp();
    const password = darajaPassword(shortcode, passkey, timestamp);
    const accessToken = await getDarajaAccessToken();

    const stkRes = await fetch(`${DARAJA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: callbackUrl,
        AccountReference: accountReference,
        TransactionDesc: 'Dynamic Ambience order',
      }),
    });

    const stkData = await stkRes.json();

    if (!stkRes.ok || stkData.ResponseCode !== '0') {
      res.status(502).json({
        error: stkData.errorMessage || stkData.ResponseDescription || 'STK push request failed.',
      });
      return;
    }

    const supabase = supabaseServerClient();
    const { error: dbError } = await supabase.from('mpesa_transactions').insert({
      checkout_request_id: stkData.CheckoutRequestID,
      merchant_request_id: stkData.MerchantRequestID,
      phone,
      amount,
      order_summary: body?.orderSummary ?? null,
      status: 'pending',
    });

    if (dbError) {
      res.status(500).json({ error: `Could not record transaction: ${dbError.message}` });
      return;
    }

    res.status(200).json({ checkoutRequestId: stkData.CheckoutRequestID });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unexpected error.' });
  }
}
