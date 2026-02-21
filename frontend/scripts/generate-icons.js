#!/usr/bin/env node

/**
 * Icon Generator for PWA
 * Generates PNG icons for the PWA manifest using sharp
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// SVG template for the icon
function createSVGIcon(size) {
  const padding = 20;
  const innerSize = size - (padding * 2);
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <!-- Background -->
    <rect width="${size}" height="${size}" fill="#3b82f6"/>
    
    <!-- Main building shape -->
    <g transform="translate(${padding}, ${padding})">
      <!-- Building outline -->
      <rect x="${innerSize * 0.15}" y="${innerSize * 0.25}" width="${innerSize * 0.7}" height="${innerSize * 0.65}" fill="#ffffff" rx="8"/>
      
      <!-- Roof triangle -->
      <polygon points="${innerSize * 0.5},${innerSize * 0.1} ${innerSize * 0.95},${innerSize * 0.25} ${innerSize * 0.05},${innerSize * 0.25}" fill="#ffffff"/>
      
      <!-- Window grid -->
      <g fill="#3b82f6">
        <!-- Top row of windows -->
        <rect x="${innerSize * 0.2}" y="${innerSize * 0.35}" width="${innerSize * 0.1}" height="${innerSize * 0.1}" rx="3"/>
        <rect x="${innerSize * 0.38}" y="${innerSize * 0.35}" width="${innerSize * 0.1}" height="${innerSize * 0.1}" rx="3"/>
        <rect x="${innerSize * 0.56}" y="${innerSize * 0.35}" width="${innerSize * 0.1}" height="${innerSize * 0.1}" rx="3"/>
        <rect x="${innerSize * 0.74}" y="${innerSize * 0.35}" width="${innerSize * 0.1}" height="${innerSize * 0.1}" rx="3"/>
        
        <!-- Middle row of windows -->
        <rect x="${innerSize * 0.2}" y="${innerSize * 0.52}" width="${innerSize * 0.1}" height="${innerSize * 0.1}" rx="3"/>
        <rect x="${innerSize * 0.38}" y="${innerSize * 0.52}" width="${innerSize * 0.1}" height="${innerSize * 0.1}" rx="3"/>
        <rect x="${innerSize * 0.56}" y="${innerSize * 0.52}" width="${innerSize * 0.1}" height="${innerSize * 0.1}" rx="3"/>
        <rect x="${innerSize * 0.74}" y="${innerSize * 0.52}" width="${innerSize * 0.1}" height="${innerSize * 0.1}" rx="3"/>
      </g>
      
      <!-- Door -->
      <rect x="${innerSize * 0.4}" y="${innerSize * 0.72}" width="${innerSize * 0.2}" height="${innerSize * 0.22}" fill="#3b82f6" rx="4"/>
      <circle cx="${innerSize * 0.55}" cy="${innerSize * 0.83}" r="${innerSize * 0.02}" fill="#ffffff"/>
    </g>
  </svg>`;
}

async function generateIcons() {
  try {
    console.log('🎨 Generating PWA icons...\n');
    
    const sizes = [
      { size: 192, file: 'icon-192.png' },
      { size: 512, file: 'icon-512.png' },
      { size: 192, file: 'icon-192-maskable.png' },
      { size: 512, file: 'icon-512-maskable.png' }
    ];
    
    for (const { size, file } of sizes) {
      const svg = createSVGIcon(size);
      const outputPath = path.join(publicDir, file);
      
      await sharp(Buffer.from(svg))
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Created ${file} (${size}x${size})`);
    }
    
    console.log('\n✅ All PWA icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

generateIcons();
