import { useRef, useState } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { compressImage } from '@/lib/compressImage';
import type { Product } from '@/lib/types';

const BUCKET = 'product-images';
const MARKER = `/storage/v1/object/public/${BUCKET}/`;
// Photos already smaller than this are left alone.
const SKIP_UNDER_BYTES = 250 * 1024;

function mb(bytes: number) {
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

export default function ImageOptimizer({
  products,
  onDone,
}: {
  products: Product[];
  onDone: () => void;
}) {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [log, setLog] = useState<string[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const cancelRef = useRef(false);

  const addLog = (line: string) => setLog((l) => [...l.slice(-40), line]);

  const run = async () => {
    const ok = window.confirm(
      'This will shrink every large product photo and update each product to use the smaller version. ' +
        'Your original files stay in storage untouched. Keep this tab open until it finishes. Continue?',
    );
    if (!ok) return;

    cancelRef.current = false;
    setRunning(true);
    setSummary(null);
    setLog([]);
    setProgress({ done: 0, total: products.length });

    let shrunk = 0;
    let skipped = 0;
    let failed = 0;
    let savedBytes = 0;

    for (let i = 0; i < products.length; i++) {
      if (cancelRef.current) break;
      const p = products[i];
      setProgress({ done: i, total: products.length });

      try {
        if (!p.image_url.includes(MARKER)) {
          skipped++;
          addLog(`Skipped "${p.name}" (image is hosted elsewhere)`);
          continue;
        }

        // Check size first without downloading the whole file
        const head = await fetch(p.image_url, { method: 'HEAD' });
        const size = Number(head.headers.get('content-length') ?? 0);
        if (size && size < SKIP_UNDER_BYTES) {
          skipped++;
          addLog(`Skipped "${p.name}" (already small)`);
          continue;
        }

        const res = await fetch(p.image_url);
        if (!res.ok) throw new Error(`download failed (${res.status})`);
        const original = await res.blob();

        const compressed = await compressImage(
          new File([original], 'photo', { type: original.type || 'image/jpeg' }),
        );
        if (compressed.blob.size >= original.size) {
          skipped++;
          addLog(`Skipped "${p.name}" (couldn't make it smaller)`);
          continue;
        }

        const path = `${crypto.randomUUID()}.${compressed.ext}`;
        const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, compressed.blob, {
          cacheControl: '31536000',
          contentType: compressed.type,
          upsert: false,
        });
        if (upErr) throw new Error(upErr.message);

        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        const { error: dbErr } = await supabase
          .from('products')
          .update({ image_url: data.publicUrl })
          .eq('id', p.id);
        if (dbErr) throw new Error(dbErr.message);

        shrunk++;
        savedBytes += original.size - compressed.blob.size;
        addLog(`Shrunk "${p.name}": ${mb(original.size)} → ${mb(compressed.blob.size)}`);
      } catch (err) {
        failed++;
        addLog(`Failed "${p.name}": ${err instanceof Error ? err.message : 'unknown error'}`);
      }
    }

    setProgress({ done: products.length, total: products.length });
    setSummary(
      `${cancelRef.current ? 'Stopped. ' : 'Done. '}Shrunk ${shrunk}, skipped ${skipped}, failed ${failed}. ` +
        `Saved about ${mb(savedBytes)} per full page load of the shop.`,
    );
    setRunning(false);
    onDone();
  };

  return (
    <div className="mb-8 rounded-2xl bg-sand-50 p-5 ring-1 ring-ink-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium text-ink-900">Shrink existing photos</p>
          <p className="mt-0.5 text-sm text-ink-600">
            Cuts the size of big product photos so the site uses far less bandwidth. Safe to run
            more than once.
          </p>
        </div>
        {running ? (
          <button
            type="button"
            onClick={() => (cancelRef.current = true)}
            className="rounded-full border border-ink-300 px-5 py-2.5 text-sm font-medium text-ink-800 hover:bg-sand-100"
          >
            Stop
          </button>
        ) : (
          <button
            type="button"
            onClick={run}
            disabled={products.length === 0}
            className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-sand-50 transition-colors hover:bg-clay-600 disabled:opacity-50"
          >
            <ImagePlus className="h-4 w-4" /> Shrink photos
          </button>
        )}
      </div>

      {(running || log.length > 0) && (
        <div className="mt-4">
          {running && (
            <p className="flex items-center gap-2 text-sm text-ink-700">
              <Loader2 className="h-4 w-4 animate-spin" />
              Working… {progress.done} of {progress.total}
            </p>
          )}
          <div className="mt-2 max-h-40 overflow-y-auto rounded-xl bg-sand-100 p-3 text-xs text-ink-700">
            {log.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      )}

      {summary && <p className="mt-3 text-sm font-medium text-ink-900">{summary}</p>}
    </div>
  );
}
