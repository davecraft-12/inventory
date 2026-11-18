import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from '../../../db/connection.js';
import Product from '../../../models/Product.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

async function findProducts() {
  try {
    await connectDB();
    
    const products = await Product.find({}, 'name stock').limit(10);
    
    console.log('=== ALL PRODUCTS ===');
    products.forEach(product => {
      console.log(`${product.name}: ${product.stock} units`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

findProducts();