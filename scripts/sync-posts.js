const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configure paths relative to the project root
const OBSIDIAN_DIR = path.join(__dirname, '../ObsidianVault/posts/OrhanBiler.us'); // Where you write in Obsidian
const PUBLIC_DIR = path.join(__dirname, '../public/posts'); // Where the website reads from
const ASSETS_DIR = path.join(OBSIDIAN_DIR, 'assets'); // Where images are stored
const PUBLIC_ASSETS_DIR = path.join(__dirname, '../public/assets'); // Where images will be copied to

// Supported media file extensions
const MEDIA_EXTENSIONS = [
  // Images
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif',
  // Videos
  '.mp4', '.webm', '.ogg',
  // Audio
  '.mp3', '.wav',
  // Documents
  '.pdf'
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function isMediaFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return MEDIA_EXTENSIONS.includes(ext);
}

function copyMediaFile(filename) {
  const sourcePath = path.join(ASSETS_DIR, filename);
  const targetPath = path.join(PUBLIC_ASSETS_DIR, filename);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    return true;
  }
  return false;
}

function syncAssets() {
  // Create assets directory if it doesn't exist
  if (!fs.existsSync(PUBLIC_ASSETS_DIR)) {
    fs.mkdirSync(PUBLIC_ASSETS_DIR, { recursive: true });
  }

  // Copy all files from assets directory
  if (fs.existsSync(ASSETS_DIR)) {
    const files = fs.readdirSync(ASSETS_DIR);
    files.forEach(file => {
      if (isMediaFile(file)) {
        const sourcePath = path.join(ASSETS_DIR, file);
        const targetPath = path.join(PUBLIC_ASSETS_DIR, file);
        fs.copyFileSync(sourcePath, targetPath);
      }
    });
  }
}

function processMarkdownContent(content) {
  let updatedContent = content;

  // Handle Obsidian-style image/media embeds: ![[filename]]
  updatedContent = updatedContent.replace(/!\[\[(.*?)\]\]/g, (match, filename) => {
    const cleanFilename = filename.split('|')[0].trim();
    if (copyMediaFile(cleanFilename)) {
      if (isMediaFile(cleanFilename)) {
        const ext = path.extname(cleanFilename).toLowerCase();
        const encodedFilename = encodeURIComponent(cleanFilename);
        // Handle different media types
        if (ext === '.mp4' || ext === '.webm' || ext === '.ogg') {
          return `<video controls><source src="/assets/${encodedFilename}" type="video/${ext.slice(1)}"></video>`;
        } else if (ext === '.mp3' || ext === '.wav') {
          return `<audio controls><source src="/assets/${encodedFilename}" type="audio/${ext.slice(1)}"></audio>`;
        } else if (ext === '.pdf') {
          return `<embed src="/assets/${encodedFilename}" type="application/pdf" width="100%" height="600px" />`;
        }
        return `![](/assets/${encodedFilename})`;
      }
    }
    return match;
  });

  // Handle standard Markdown image syntax: ![alt](path) including URL-encoded paths
  updatedContent = updatedContent.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, filepath) => {
    if (filepath.startsWith('assets/') || filepath.startsWith('./assets/')) {
      // Decode the URL-encoded filename first
      const decodedPath = decodeURIComponent(filepath);
      const filename = path.basename(decodedPath);
      if (copyMediaFile(filename)) {
        const encodedFilename = encodeURIComponent(filename);
        return `![${alt}](/assets/${encodedFilename})`;
      }
    }
    return match;
  });

  // Handle Obsidian internal links: [[page]] or [[page|alias]]
  updatedContent = updatedContent.replace(/\[\[(.*?)\]\]/g, (match, link) => {
    const [pageName, alias] = link.split('|').map(s => s.trim());
    const displayText = alias || pageName;
    const slug = slugify(pageName);
    return `[${displayText}](/posts/${slug})`;
  });

  // Handle code blocks with syntax highlighting
  updatedContent = updatedContent.replace(/```(\w+)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `\`\`\`${lang}\n${code.trim()}\n\`\`\``;
  });

  // Handle math equations (if you use them)
  updatedContent = updatedContent.replace(/\$\$([\s\S]*?)\$\$/g, (match, equation) => {
    return `<div class="math math-display">\n${equation.trim()}\n</div>`;
  });
  updatedContent = updatedContent.replace(/\$(.*?)\$/g, (match, equation) => {
    return `<span class="math math-inline">${equation.trim()}</span>`;
  });

  return updatedContent;
}

function syncPosts() {
  // Create directories if they don't exist
  [OBSIDIAN_DIR, PUBLIC_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Sync assets first
  syncAssets();

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
    
    // Process the content
    const updatedContent = processMarkdownContent(content);

    // Copy file to public directory
    fs.writeFileSync(
      path.join(PUBLIC_DIR, `${slug}.md`),
      updatedContent
    );

    // Add to posts list
    posts.push({
      title: data.title || path.basename(file, '.md'),
      subtitle: data.subtitle || '',
      date: data.date || new Date().toISOString().split('T')[0],
      slug,
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      author: data.author || 'Orhan Biler',
      banner: data.banner || null
    });
  });

  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Write index file
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'index.json'),
    JSON.stringify({ posts }, null, 2)
  );

}

// Export the syncPosts function
module.exports = {
  syncPosts
};

// Run sync if called directly
if (require.main === module) {
  syncPosts();
} 