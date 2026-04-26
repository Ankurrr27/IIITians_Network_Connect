import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceImage = path.join(__dirname, 'public/IIITians-Network-Logo-Light.png');
const publicDir = path.join(__dirname, 'public');

async function createFavicons() {
  try {
    console.log('🎨 Creating favicon files from source image...\n');

    // Create 32x32 PNG favicon
    await sharp(sourceImage)
      .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'favicon-32x32.png'));
    console.log('✅ Created favicon-32x32.png');

    // Create 180x180 Apple touch icon
    await sharp(sourceImage)
      .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('✅ Created apple-touch-icon.png');

    // Create 192x192 Android icon
    await sharp(sourceImage)
      .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'favicon-192x192.png'));
    console.log('✅ Created favicon-192x192.png');

    // Create 512x512 icon (for PWA manifest)
    await sharp(sourceImage)
      .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'favicon-512x512.png'));
    console.log('✅ Created favicon-512x512.png');

    // Create favicon.ico (32x32)
    const icoBuffer = await sharp(sourceImage)
      .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toBuffer();

    // Simple ICO format creation (32x32, 24-bit RGB)
    // ICO header + DIB header + pixel data
    const width = 32;
    const height = 32;
    const bitCount = 24;
    const dibHeader = Buffer.alloc(40);
    dibHeader.writeUInt32LE(40, 0);
    dibHeader.writeInt32LE(width, 4);
    dibHeader.writeInt32LE(height * 2, 8); // Height is doubled for ICO format
    dibHeader.writeUInt16LE(1, 12);
    dibHeader.writeUInt16LE(bitCount, 14);
    dibHeader.writeUInt32LE(0, 16);

    const imageSize = width * height * 3;
    dibHeader.writeUInt32LE(imageSize, 20);

    const iconDir = Buffer.alloc(6);
    iconDir.writeUInt16LE(0, 0);
    iconDir.writeUInt16LE(1, 2);
    iconDir.writeUInt16LE(1, 4);

    const iconDirEntry = Buffer.alloc(16);
    iconDirEntry.writeUInt8(width, 0);
    iconDirEntry.writeUInt8(height, 1);
    iconDirEntry.writeUInt8(0, 2);
    iconDirEntry.writeUInt8(0, 3);
    iconDirEntry.writeUInt16LE(1, 4);
    iconDirEntry.writeUInt16LE(bitCount, 6);
    iconDirEntry.writeUInt32LE(dibHeader.length, 8);
    iconDirEntry.writeUInt32LE(iconDir.length + 16 + iconDirEntry.length, 12);

    const icoFile = Buffer.concat([iconDir, iconDirEntry, dibHeader, icoBuffer]);
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoFile);
    console.log('✅ Created favicon.ico');

    console.log('\n✨ All favicons created successfully!\n');
    console.log('📁 Files created in public/:');
    console.log('   - favicon.ico');
    console.log('   - favicon-32x32.png');
    console.log('   - favicon-192x192.png');
    console.log('   - apple-touch-icon.png');
    console.log('   - favicon-512x512.png');

  } catch (error) {
    console.error('❌ Error creating favicons:', error.message);
    process.exit(1);
  }
}

createFavicons();
