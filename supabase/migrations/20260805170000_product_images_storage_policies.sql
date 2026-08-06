/*
# Allow anon uploads to the product-images storage bucket

Matches the existing no-auth storefront model: anon can read, upload,
and delete files in the product-images bucket, same as the products table.
Create the "product-images" bucket as Public in the Storage UI first.
*/

DROP POLICY IF EXISTS "anon_select_product_images" ON storage.objects;
CREATE POLICY "anon_select_product_images" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "anon_insert_product_images" ON storage.objects;
CREATE POLICY "anon_insert_product_images" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "anon_update_product_images" ON storage.objects;
CREATE POLICY "anon_update_product_images" ON storage.objects FOR UPDATE
  TO anon, authenticated USING (bucket_id = 'product-images') WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "anon_delete_product_images" ON storage.objects;
CREATE POLICY "anon_delete_product_images" ON storage.objects FOR DELETE
  TO anon, authenticated USING (bucket_id = 'product-images');
