import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createPreviewImage() {
  try {
    console.log('🎨 Creating social media preview image (1200x630)...\n');

    const sourceImage = path.join(__dirname, 'public/IIITians-Network-Logo-Blue.png');
    const outputPath = path.join(__dirname, 'public/og-image.png');

    // Create 1200x630 preview image with blue gradient background
    const width = 1200;
    const height = 630;

    // Create SVG background with gradient and logo
    const svgBackground = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0066cc;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#004499;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>
      <text x="${width / 2}" y="${height / 2 - 80}" font-size="72" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial, sans-serif">
        IIITians Network
      </text>
      <text x="${width / 2}" y="${height / 2 + 40}" font-size="36" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif">
        Connect • Collaborate • Grow
      </text>
      <text x="${width / 2}" y="${height - 60}" font-size="28" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif">
        Student-led Community Connecting All IIITs Across India
      </text>
    </svg>
    `;

    // Create the preview image from SVG
    await sharp(Buffer.from(svgBackground))
      .png()
      .toFile(outputPath);

    console.log('✅ Created og-image.png (1200x630)');
    console.log(`📍 Location: public/og-image.png`);
    console.log(`📊 Dimensions: ${width}x${height}`);
    console.log(`🔗 URL: https://iiitiansnetwork.in/og-image.png\n`);

  } catch (error) {
    console.error('❌ Error creating preview image:', error.message);
    process.exit(1);
  }
}

createPreviewImage();
