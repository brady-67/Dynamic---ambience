/**
 * Shrinks an image in the browser before it is uploaded.
 * Resizes so the longest side is at most `maxSize` px and re-encodes as WebP
 * (falls back to JPEG if the browser can't encode WebP).
 * SVGs and GIFs are returned untouched.
 */
export async function compressImage(
  file: File,
  maxSize = 1200,
  quality = 0.8,
): Promise<{ blob: Blob; ext: string; type: string }> {
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    const ext = file.type === 'image/gif' ? 'gif' : 'svg';
    return { blob: file, ext, type: file.type };
  }

  // imageOrientation keeps phone photos the right way up
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not process image');
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const toBlob = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

  const webp = await toBlob('image/webp');
  if (webp && webp.type === 'image/webp') {
    return { blob: webp, ext: 'webp', type: 'image/webp' };
  }
  const jpeg = await toBlob('image/jpeg');
  if (!jpeg) throw new Error('Could not compress image');
  return { blob: jpeg, ext: 'jpg', type: 'image/jpeg' };
}
