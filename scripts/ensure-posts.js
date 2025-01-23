const fs = require('fs');
const path = require('path');

// Configure paths
const PUBLIC_POSTS_DIR = path.join(__dirname, '../public/posts');
const OBSIDIAN_DIR = path.join(__dirname, '../ObsidianVault/posts/OrhanBiler.us');

// Ensure the public/posts directory exists
if (!fs.existsSync(PUBLIC_POSTS_DIR)) {
    console.log('Creating public/posts directory...');
    fs.mkdirSync(PUBLIC_POSTS_DIR, { recursive: true });
}

// Check if we're in a Vercel build environment
const isVercelBuild = process.env.VERCEL === '1';

// Copy posts from git if we're in Vercel
if (isVercelBuild && fs.existsSync(OBSIDIAN_DIR)) {
    console.log('Copying posts from Obsidian vault to public/posts...');
    
    // Read all markdown files from Obsidian directory
    const files = fs.readdirSync(OBSIDIAN_DIR)
        .filter(file => file.endsWith('.md') && !file.toLowerCase().includes('template'));
    
    // Copy each file
    files.forEach(file => {
        const sourcePath = path.join(OBSIDIAN_DIR, file);
        const targetPath = path.join(PUBLIC_POSTS_DIR, file);
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`Copied ${file}`);
    });
}

// Check if index.json exists, if not create an empty one
const indexPath = path.join(PUBLIC_POSTS_DIR, 'index.json');
if (!fs.existsSync(indexPath)) {
    console.log('Creating empty index.json...');
    fs.writeFileSync(indexPath, JSON.stringify({ posts: [] }, null, 2));
}

// List the contents of the posts directory
console.log('\nContents of public/posts directory:');
const files = fs.readdirSync(PUBLIC_POSTS_DIR);
files.forEach(file => {
    const stats = fs.statSync(path.join(PUBLIC_POSTS_DIR, file));
    console.log(`- ${file} (${stats.size} bytes)`);
});

console.log('\nPosts directory setup complete!'); 