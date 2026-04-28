require('dotenv').config(); // load env vars from .env (MONGODB_URI)
const mongoose = require('mongoose');
const Product = require('./app/models/Product'); // import the Product model

const products = [
    {
        productCode: 'PROD-001',
        productName: 'Kendama',
        quantity: 14,
        unitPrice: 800.00,
        productImage: '/assets/kendama_pic.jpg'
    },
    {
        productCode: 'PROD-002',
        productName: 'Karuta Cards',
        quantity: 10,
        unitPrice: 650.00,
        productImage: '/assets/karuta.jpg'
    },
    {
        productCode: 'PROD-003',
        productName: 'Blackbeard (Kurohige Kiki Ippatsu)',
        quantity: 15,
        unitPrice: 750.00,
        productImage: '/assets/blackbeard.jpg'
    },
    {
        productCode: 'PROD-004',
        productName: 'Kokeshi Dolls',
        quantity: 8,
        unitPrice: 1200.00,
        productImage: '/assets/kokeshi.webp'
    },
    {
        productCode: 'PROD-005',
        productName: 'Kabuki Mask',
        quantity: 5,
        unitPrice: 550.00,
        productImage: '/assets/kabuki_mask.jpg'
    },
    {
        productCode: 'PROD-006',
        productName: 'Daruma Doll',
        quantity: 20,
        unitPrice: 400.00,
        productImage: '/assets/daruma.jpg'
    },
    {
        productCode: 'PROD-007',
        productName: 'Futon Set',
        quantity: 4,
        unitPrice: 4800.00,
        productImage: '/assets/futon.jpg'
    },
    {
        productCode: 'PROD-008',
        productName: 'Chopsticks',
        quantity: 50,
        unitPrice: 150.00,
        productImage: '/assets/chopsticks.jpg'
    },
    {
        productCode: 'PROD-009',
        productName: 'Denden-daiko (Pellet Drum)',
        quantity: 12,
        unitPrice: 320.00,
        productImage: '/assets/denden-daiko.jpg'
    },
    {
        productCode: 'PROD-010',
        productName: 'Take-tombo (Bamboo Dragonfly)',
        quantity: 30,
        unitPrice: 100.00,
        productImage: '/assets/take-tombo.jpg'
    },
    {
        productCode: 'PROD-011',
        productName: 'Beigoma (Spinning Tops)',
        quantity: 25,
        unitPrice: 200.00,
        productImage: '/assets/beigoma.jpg'
    },
    {
        productCode: 'PROD-012',
        productName: 'Folding Fan',
        quantity: 18,
        unitPrice: 450.00,
        productImage: '/assets/fans.jpg'
    },
    {
        productCode: 'PROD-013',
        productName: 'Doraemon',
        quantity: 10,
        unitPrice: 950.00,
        productImage: '/assets/doraemon.jpg'
    },
    {
        productCode: 'PROD-014',
        productName: 'One Piece Manga',
        quantity: 40,
        unitPrice: 215.00,
        productImage: '/assets/manga.jpg'
    },
    {
        productCode: 'PROD-015',
        productName: 'Bento Box',
        quantity: 22,
        unitPrice: 600.00,
        productImage: '/assets/bento.jpg'
    },
    {
        productCode: 'PROD-016',
        productName: 'Mamachari Bicycle',
        quantity: 3,
        unitPrice: 7500.00,
        productImage: '/assets/bike.jpg'
    },
    {
        productCode: 'PROD-017',
        productName: 'Tatami Mat',
        quantity: 6,
        unitPrice: 1800.00,
        productImage: '/assets/tatami-mat.jpg'
    },
    {
        productCode: 'PROD-018',
        productName: 'Yukata',
        quantity: 7,
        unitPrice: 2200.00,
        productImage: '/assets/yukata.jpg'
    },
    {
        productCode: 'PROD-019',
        productName: 'Edo Furin Wind Chime',
        quantity: 15,
        unitPrice: 550.00,
        productImage: '/assets/furin.jpg'
    },
    {
        productCode: 'PROD-020',
        productName: 'Pikachu Plush Toy',
        quantity: 12,
        unitPrice: 880.00,
        productImage: '/assets/pikachu.jpg'
    },
    {
        productCode: 'PROD-021',
        productName: 'Sample Product with No Image',
        quantity: 2,
        unitPrice: 10.00,
        productImage: ''
    }
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {

    for (const productData of products) {
        const result = await Product.findOneAndUpdate(
            { productCode: productData.productCode }, // find by this
            { $set: productData },                    // apply these changes
            { upsert: true, new: true }               // create if not found
        );
        console.log(`Upserted: ${result.productCode} — ${result.productName}`);
    }

    mongoose.disconnect();
}).catch(err => console.error('Seed error:', err));
