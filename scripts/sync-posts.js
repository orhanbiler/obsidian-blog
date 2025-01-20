const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configure paths relative to the project root
const OBSIDIAN_DIR = path.join(__dirname, '../ObsidianVault/posts/OrhanBiler.us'); // Where you write in Obsidian
const PUBLIC_DIR = path.join(__dirname, '../public/posts'); // Where the website reads from

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function syncPosts() {
  // Create directories if they don't exist
  [OBSIDIAN_DIR, PUBLIC_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Read all markdown files from Obsidian directory
  const files = fs.readdirSync(OBSIDIAN_DIR)
    .filter(file => file.endsWith('.md') && !file.includes('template'));

  const posts = [];

  // Process each file
  files.forEach(file => {
    const content = fs.readFileSync(path.join(OBSIDIAN_DIR, file), 'utf8');
    const { data, content: markdown } = matter(content);
    
    // Skip drafts and templates
    if (data.draft || file.toLowerCase().includes('template')) return;

    // Generate slug from filename or title
    const slug = data.slug || slugify(data.title || path.basename(file, '.md'));
    
    // Copy file to public directory
    fs.writeFileSync(
      path.join(PUBLIC_DIR, `${slug}.md`),
      content
    );

    // Add to posts list
    posts.push({
      title: data.title || path.basename(file, '.md'),
      date: data.date || new Date().toISOString().split('T')[0],
      slug,
      excerpt: data.excerpt || '',
      tags: data.tags || []
    });
  });

  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Write index.json
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'index.json'),
    JSON.stringify({ posts }, null, 2)
  );

  console.log(`Synced ${posts.length} posts`);
}

// Run the sync
syncPosts(); 