import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../../../models/Product.js';
import connectDB from '../../../db/connection.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Curated/fallback image URLs (reliable Unsplash image links)
const productImages = {
  laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
  smartphone: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
  phone: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
  computer: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
  bicycle: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=300&fit=crop',
  't-shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
  jeans: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop',
  'programming book': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
  book: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
  'garden tools': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
  tool: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
  default: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
};

const getImageForProduct = (productName = '') => {
  const name = String(productName).toLowerCase();
  for (const [key, url] of Object.entries(productImages)) {
    if (key !== 'default' && name.includes(key)) return url;
  }
  return productImages.default;
};

const addImagesToProducts = async () => {
  try {
    await connectDB();
    console.log('Connected to database...');

    const products = await Product.find({
      $or: [
        { images: { $exists: false } },
        { images: { $size: 0 } },
        { images: null },
      ],
    });

    console.log(`Found ${products.length} products without images`);

    for (const product of products) {
      const imageUrl = getImageForProduct(product.name);
      await Product.findByIdAndUpdate(product._id, { images: [imageUrl] });
      console.log(`Added image to: ${product.name}`);
    }

    console.log('Product image update completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error adding images:', error);
    process.exit(1);
  }
};

addImagesToProducts();
