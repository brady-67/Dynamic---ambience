/*
# Create products table for the Dynamic Ambience shop

1. New Tables
- `products`
  - `id` (uuid, primary key)
  - `name` (text, not null) - product name
  - `brand` (text, not null) - "Ramtons" or "Von" (or other brands)
  - `category` (text, not null) - e.g. "Kitchen", "Laundry", "Refrigeration", "Small Appliances"
  - `price` (numeric, not null) - price in KES
  - `old_price` (numeric, nullable) - optional previous price for showing discounts
  - `image_url` (text, not null) - product photo URL
  - `rating` (numeric, default 0) - average rating 0-5
  - `reviews_count` (integer, default 0) - number of reviews
  - `in_stock` (boolean, default true)
  - `featured` (boolean, default false) - show in featured carousel
  - `description` (text, nullable) - short product description
  - `created_at` (timestamptz)

2. Security
- Enable RLS on `products`.
- Allow anon + authenticated CRUD because the shop catalog is intentionally public/shared (no sign-in).

3. Notes
- This is a single-tenant (no-auth) storefront. All visitors browse as anon.
- Prices stored in Kenyan Shillings (KES).
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL,
  category text NOT NULL,
  price numeric(12,2) NOT NULL,
  old_price numeric(12,2),
  image_url text NOT NULL,
  rating numeric(2,1) NOT NULL DEFAULT 0,
  reviews_count integer NOT NULL DEFAULT 0,
  in_stock boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);

-- Seed Ramtons and Von catalog
INSERT INTO products (name, brand, category, price, old_price, image_url, rating, reviews_count, in_stock, featured, description) VALUES
('Ramtons 20L Digital Microwave', 'Ramtons', 'Kitchen', 12999, 15999, 'https://images.pexels.com/photos/16927363/pexels-photo-16927363.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.7, 128, true, true, 'Compact 20-litre digital microwave with 6 power levels and defrost function. Perfect for quick meals.'),
('Ramtons 50/60Hz Cooker Burner', 'Ramtons', 'Kitchen', 24500, NULL, 'https://images.pexels.com/photos/16927367/pexels-photo-16927367.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.5, 64, true, false, '4-burner gas/electric cooker with sturdy cast iron grates and electric oven.'),
('Ramtons 1.7L Electric Kettle', 'Ramtons', 'Small Appliances', 1999, 2499, 'https://images.pexels.com/photos/792615/pexels-photo-792615.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.8, 312, true, true, 'Fast-boil 1.7-litre stainless steel kettle with auto shut-off and boil-dry protection.'),
('Ramtons 3.5L Deep Fryer', 'Ramtons', 'Small Appliances', 5499, NULL, 'https://images.pexels.com/photos/36573009/pexels-photo-36573009.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.4, 47, true, false, '3.5-litre deep fryer with adjustable thermostat and removable non-stick bowl.'),
('Ramtons Twin Tub Washing Machine 7kg', 'Ramtons', 'Laundry', 18999, 21999, 'https://images.pexels.com/photos/28479466/pexels-photo-28479466.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.6, 89, true, true, '7kg twin-tub washing machine with wash and spin cycles. Water and energy efficient.'),
('Ramtons Front Load Washer 8kg', 'Ramtons', 'Laundry', 42500, NULL, 'https://images.pexels.com/photos/28479464/pexels-photo-28479464.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.9, 54, true, false, '8kg front-load automatic washer with 15 programmes and quick wash option.'),
('Ramtons Double Door Fridge 230L', 'Ramtons', 'Refrigeration', 38999, 44999, 'https://images.pexels.com/photos/38289057/pexels-photo-38289057.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.7, 73, true, true, '230-litre double-door refrigerator with no-frost cooling and energy-saving compressor.'),
('Ramtons Stainless Steel Cookware Set', 'Ramtons', 'Cookware', 4999, 5999, 'https://images.pexels.com/photos/36552082/pexels-photo-36552082.png?auto=compress&cs=tinysrgb&h=650&w=940', 4.5, 102, true, false, '5-piece stainless steel pots and pans set with tempered glass lids.'),
('Von 20L Microwave Oven', 'Von', 'Kitchen', 11299, 13999, 'https://images.pexels.com/photos/37552794/pexels-photo-37552794.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.6, 156, true, true, '20-litre microwave oven with grill function, 10 power levels and child lock.'),
('Von 4-Burner Gas Cooker', 'Von', 'Kitchen', 27999, NULL, 'https://images.pexels.com/photos/14445303/pexels-photo-14445303.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.8, 91, true, false, 'Freestanding 4-burner gas cooker with electric oven and automatic ignition.'),
('Von 1.8L Cordless Kettle', 'Von', 'Small Appliances', 1799, 2299, 'https://images.pexels.com/photos/2633404/pexels-photo-2633404.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.7, 278, true, true, '1.8-litre cordless kettle with 360-degree base, auto shut-off and water level window.'),
('Von Hand Blender 3-in-1', 'Von', 'Small Appliances', 3299, NULL, 'https://images.pexels.com/photos/18205656/pexels-photo-18205656.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.4, 61, true, false, '3-in-1 immersion hand blender with whisk and chopper attachments.'),
('Von Twin Tub Washer 9kg', 'Von', 'Laundry', 21500, 24500, 'https://images.pexels.com/photos/5816934/pexels-photo-5816934.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.6, 78, true, true, '9kg twin-tub washing machine with heavy-duty motor and lint filter.'),
('Von Top Load Washer 10kg', 'Von', 'Laundry', 46900, NULL, 'https://images.pexels.com/photos/12104070/pexels-photo-12104070.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.9, 43, true, false, '10kg fully-automatic top-load washer with fuzzy logic and 8 wash programmes.'),
('Von Chest Freezer 195L', 'Von', 'Refrigeration', 35500, 39999, 'https://images.pexels.com/photos/38609262/pexels-photo-38609262.png?auto=compress&cs=tinysrgb&h=650&w=940', 4.7, 67, true, true, '195-litre chest freezer with fast-freeze function and balanced hinge door.'),
('Von Non-Stick Cookware Set', 'Von', 'Cookware', 4299, 5299, 'https://images.pexels.com/photos/8916610/pexels-photo-8916610.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4.5, 94, true, false, '6-piece non-stick cookware set with stay-cool handles and glass lids.')
ON CONFLICT DO NOTHING;
