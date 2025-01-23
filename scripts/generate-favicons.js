const { favicons } = require('favicons');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const SVG_SOURCE = path.resolve(__dirname, '../src/assets/logo.svg');
const PNG_SOURCE = path.resolve(__dirname, '../src/assets/logo.png');
const TARGET = path.resolve(__dirname, '../public');

const configuration = {
  path: '/', // Path for overriding default icons path
  appName: "Orhan Biler's Blog",
  appShortName: 'Orhan Biler',
  appDescription: 'Exploring technology, software development, and sharing knowledge through detailed articles and tutorials.',
  background: '#ffffff',
  theme_color: '#319795',
  lang: 'en-US',
  loadManifestWithCredentials: false,
  manifestRelativePaths: true,
  icons: {
    // Platform-specific icons
    android: {
      manifestRelativePaths: true,
      background: '#FFFFFF'
    },
    appleIcon: {
      background: '#FFFFFF'
    },
    appleStartup: true,
    favicons: {
      manifestRelativePaths: true,
      background: '#FFFFFF'
    },
    windows: {
      manifestRelativePaths: true,
      background: '#FFFFFF'
    },
    yandex: false,
  },
  files: {
    android: {
      manifestFileName: 'manifest.json',
      manifestRelativePaths: true
    },
    favicons: true,
    windows: true
  },
  shortcuts: [],
  pixel_art: false,
  manifest: {
    name: "Orhan Biler's Blog",
    short_name: 'Orhan Biler',
    description: 'Exploring technology, software development, and sharing knowledge through detailed articles and tutorials.',
    theme_color: '#319795',
    background_color: '#ffffff',
    display: 'standalone',
    orientation: 'any',
    scope: '/',
    start_url: '/',
    prefer_related_applications: false
  }
};

const generateFavicons = async () => {
  try {
    console.log('🎨 Converting SVG to PNG...');
    
    // Read the SVG file
    const svgBuffer = await fs.readFile(SVG_SOURCE);
    
    // Convert SVG to PNG with high quality
    await sharp(svgBuffer)
      .resize(512, 512, {
        kernel: sharp.kernel.lanczos3,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png({ quality: 100 })
      .toFile(PNG_SOURCE);
    
    console.log('🎨 Generating favicons...');
    
    const response = await favicons(PNG_SOURCE, configuration);
    
    // Create the target directory if it doesn't exist
    await fs.mkdir(TARGET, { recursive: true });
    
    // Save the generated files
    await Promise.all([
      ...response.images.map((image) => 
        fs.writeFile(path.join(TARGET, image.name), image.contents)
      ),
      ...response.files.map((file) =>
        fs.writeFile(path.join(TARGET, file.name), file.contents)
      ),
    ]);
    
    // Clean up the temporary PNG file
    await fs.unlink(PNG_SOURCE);
    
    console.log('✅ Favicons generated successfully!');
    console.log(`📁 Files saved to: ${TARGET}`);
    
  } catch (error) {
    console.error('❌ Error generating favicons:', error);
    process.exit(1);
  }
};

generateFavicons(); 