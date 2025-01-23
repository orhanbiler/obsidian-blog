const { favicons } = require('favicons');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const SVG_SOURCE = path.resolve(__dirname, '../src/assets/logo.svg');
const PNG_SOURCE = path.resolve(__dirname, '../src/assets/logo.png');
const TARGET = path.resolve(__dirname, '../public');

const configuration = {
  path: '/', // Path for overriding default icons path
  appName: "Orhan Biler's Blog", // Your application's name
  appShortName: 'Orhan Biler', // Your application's short name
  appDescription: 'Exploring technology, software development, and sharing knowledge through detailed articles and tutorials.',
  background: '#ffffff', // Background colour for flattened icons
  theme_color: '#319795', // Theme color for browser chrome
  lang: 'en-US', // Primary language for name and short_name
  icons: {
    // Platform-specific icons
    android: true,
    appleIcon: true,
    appleStartup: true,
    favicons: true,
    windows: true,
    yandex: false,
  },
};

const generateFavicons = async () => {
  try {
    console.log('🎨 Converting SVG to PNG...');
    
    // Read the SVG file
    const svgBuffer = await fs.readFile(SVG_SOURCE);
    
    // Convert SVG to PNG
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
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