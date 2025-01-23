const fs = require('fs');
const path = require('path');

// Ensure the public/posts directory exists
const PUBLIC_POSTS_DIR = path.join(__dirname, '../public/posts');

if (!fs.existsSync(PUBLIC_POSTS_DIR)) {
    console.log('Creating public/posts directory...');
    fs.mkdirSync(PUBLIC_POSTS_DIR, { recursive: true });
}

// Check if index.json exists, if not create an empty one
const indexPath = path.join(PUBLIC_POSTS_DIR, 'index.json');
if (!fs.existsSync(indexPath)) {
    console.log('Creating empty index.json...');
    fs.writeFileSync(indexPath, JSON.stringify({ posts: [] }, null, 2));
}

console.log('Posts directory setup complete!'); 