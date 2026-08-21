import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseServerClient } from '../_lib/daraja.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const checkoutRequestId = req.query.checkoutRequestId;
  if (typeof checkoutRequestId !== 'string') {
    res.status(400).json({ error: 'checkoutRequestId is required.' });
    return;
  }

  const supabase = supabaseServerClient();
  const { data, error } = await supabase
    .from('mpesa_transactions')
    .select('status, result_desc, mpesa_receipt')
    .eq('checkout_request_id', checkoutRequestId)
    .maybeSingle();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  if (!data) {
    res.status(404).json({ error: 'Transaction not found.' });
    return;
  }

  res.status(200).json(data);
}
