-- INSERT INTO products (name, description, price, category, brand, stock, rating, image)
-- VALUES
--   ('Wireless Headphones', 'Noise-cancelling headphones', 129.99, 'Audio', 'SoundPeak', 25, 4.6, 'https://example.com/headphones.jpg'),
--   ('Mechanical Keyboard', 'RGB keyboard with blue switches', 89.99, 'Accessories', 'KeyForge', 40, 4.8, 'https://example.com/keyboard.jpg'),
--   ('USB-C Hub', 'Seven-port USB-C hub', 59.99, 'Adapters', 'PortLink', 22, 4.6, 'https://example.com/hub.jpg');

-- Idempotent: skips any row whose name already exists, so this can be re-run safely.
INSERT INTO products (name, description, price, category, brand, stock, rating, image)
SELECT * FROM (
  VALUES
    ('Ethiopian Yirgacheffe Beans', 'Bright, floral notes with a citrus finish. Single-origin and roasted to order.', 24.99, 'Coffee', 'Bean&Leaf', 50, 4.9, 'https://placehold.co/600x400/6F4E37/FFFFFF?text=Yirgacheffe+Beans'),
    ('Ceremonial Grade Matcha', 'Stone-ground from first-harvest leaves. Perfect for lattes or traditional whisking.', 39.99, 'Matcha', 'Kyoto Farms', 35, 4.8, 'https://placehold.co/600x400/7CB342/FFFFFF?text=Ceremonial+Matcha'),
    ('Handmade Ceramic Mug', 'A beautiful 12oz mug, hand-thrown by local artisans. Perfect for your morning brew.', 29.99, 'Gear', 'Local Artisans', 20, 4.7, 'https://placehold.co/600x400/D7A86E/333333?text=Ceramic+Mug')
) AS v(name, description, price, category, brand, stock, rating, image)
WHERE NOT EXISTS (
  SELECT 1 FROM products p WHERE p.name = v.name
);
