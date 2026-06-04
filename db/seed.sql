-- db/seed.sql

INSERT INTO products (product_code, product_name, quantity, unit_price, product_image) VALUES
('PROD-001', 'Kendama',                          14,  800.00, '/assets/kendama_pic.jpg'),
('PROD-002', 'Karuta Cards',                     10,  650.00, '/assets/karuta.jpg'),
('PROD-003', 'Blackbeard (Kurohige Kiki Ippatsu)',15,  750.00, '/assets/blackbeard.jpg'),
('PROD-004', 'Kokeshi Dolls',                     8, 1200.00, '/assets/kokeshi.webp'),
('PROD-005', 'Kabuki Mask',                       5,  550.00, '/assets/kabuki_mask.jpg'),
('PROD-006', 'Daruma Doll',                      20,  400.00, '/assets/daruma.jpg'),
('PROD-007', 'Futon Set',                         4, 4800.00, '/assets/futon.jpg'),
('PROD-008', 'Chopsticks',                       50,  150.00, '/assets/chopsticks.jpg'),
('PROD-009', 'Denden-daiko (Pellet Drum)',        12,  320.00, '/assets/denden-daiko.jpg'),
('PROD-010', 'Take-tombo (Bamboo Dragonfly)',     30,  100.00, '/assets/take-tombo.jpg'),
('PROD-011', 'Beigoma (Spinning Tops)',           25,  200.00, '/assets/beigoma.jpg'),
('PROD-012', 'Folding Fan',                      18,  450.00, '/assets/fans.jpg'),
('PROD-013', 'Doraemon',                         10,  950.00, '/assets/doraemon.jpg'),
('PROD-014', 'One Piece Manga',                  40,  215.00, '/assets/manga.jpg'),
('PROD-015', 'Bento Box',                        22,  600.00, '/assets/bento.jpg'),
('PROD-016', 'Mamachari Bicycle',                 3, 7500.00, '/assets/bike.jpg'),
('PROD-017', 'Tatami Mat',                        6, 1800.00, '/assets/tatami-mat.jpg'),
('PROD-018', 'Yukata',                            7, 2200.00, '/assets/yukata.jpg'),
('PROD-019', 'Edo Furin Wind Chime',             15,  550.00, '/assets/furin.jpg'),
('PROD-020', 'Pikachu Plush Toy',                12,  880.00, '/assets/pikachu.jpg'),
('PROD-021', 'Sample Product with No Image',      2,   10.00, '')
ON CONFLICT (product_code) DO NOTHING;