import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseServerClient } from '../_lib/daraja.js';

interface CallbackMetadataItem {
  Name: string;
  Value?: string | number;
}

interface StkCallback {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: number;
  ResultDesc: string;
  CallbackMetadata?: { Item: CallbackMetadataItem[] };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Safaricom expects a 200 with this exact shape regardless of outcome,
  // or it will keep retrying the callback.
  const ack = () => res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });

  if (req.method !== 'POST') {
    ack();
    return;
  }

  try {
    const stkCallback: StkCallback | undefined = req.body?.Body?.stkCallback;
    if (!stkCallback) {
      ack();
      return;
    }

    const items = stkCallback.CallbackMetadata?.Item ?? [];
    const findValue = (name: string) => items.find((i) => i.Name === name)?.Value;
    const receipt = findValue('MpesaReceiptNumber');

    const supabase = supabaseServerClient();
    await supabase
      .from('mpesa_transactions')
      .update({
        status: stkCallback.ResultCode === 0 ? 'success' : 'failed',
        result_code: stkCallback.ResultCode,
        result_desc: stkCallback.ResultDesc,
        mpesa_receipt: receipt ? String(receipt) : null,
        updated_at: new Date().toISOString(),
      })
      .eq('checkout_request_id', stkCallback.CheckoutRequestID);
  } catch {
    // Swallow errors here — Safaricom only cares about the 200 ack.
    // The transaction will simply remain "pending" for the client to
    // detect as a timeout, which is a safe failure mode.
  }

  ack();
}
