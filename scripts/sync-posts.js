const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configure paths relative to the project root
const OBSIDIAN_DIR = path.join(__dirname, '../ObsidianVault/posts/OrhanBiler.us'); // Where you write in Obsidian
const PUBLIC_DIR = path.join(__dirname, '../public/posts'); // Where the website reads from
const ASSETS_DIR = path.join(OBSIDIAN_DIR, 'assets'); // Where images are stored
const PUBLIC_STATIC_DIR = path.join(__dirname, '../public/static'); // For static assets
const PUBLIC_ASSETS_DIR = path.join(PUBLIC_STATIC_DIR, 'assets'); // Where images will be copied to

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
    .normalize('NFD') // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/(^-|-$)+/g, ''); // Remove leading/trailing hyphens
}

function isMediaFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return MEDIA_EXTENSIONS.includes(ext);
}

function syncAssets() {
  // Create static assets directory if it doesn't exist
  [PUBLIC_STATIC_DIR, PUBLIC_ASSETS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });

  // Copy all files from assets directory
  if (fs.existsSync(ASSETS_DIR)) {
    const files = fs.readdirSync(ASSETS_DIR);
    files.forEach(file => {
      if (isMediaFile(file)) {
        const sourcePath = path.join(ASSETS_DIR, file);
        const targetPath = path.join(PUBLIC_ASSETS_DIR, file);
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`Copied asset: ${file} to ${PUBLIC_ASSETS_DIR}`);
      }
    });
  }
}

function processMarkdownContent(content) {
  let updatedContent = content;

  // Handle Obsidian-style image/media embeds: ![[filename]]
  updatedContent = updatedContent.replace(/!\[\[(.*?)\]\]/g, (match, filename) => {
    const cleanFilename = filename.split('|')[0].trim();
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
    return match;
  });

  // Handle standard Markdown image syntax: ![alt](path) including URL-encoded paths
  updatedContent = updatedContent.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, filepath) => {
    if (filepath.startsWith('assets/') || filepath.startsWith('./assets/')) {
      // Decode the URL-encoded filename first
      const decodedPath = decodeURIComponent(filepath);
      const filename = path.basename(decodedPath);
      if (isMediaFile(filename)) {
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

function syncAuthors() {
  const authorsDir = path.join(OBSIDIAN_DIR, 'authors');
  const publicAuthorsDir = path.join(PUBLIC_STATIC_DIR, 'authors');

  console.log('Syncing authors from:', authorsDir);
  console.log('To:', publicAuthorsDir);

  // Create public authors directory if it doesn't exist
  if (!fs.existsSync(publicAuthorsDir)) {
    fs.mkdirSync(publicAuthorsDir, { recursive: true });
    console.log('Created public authors directory');
  }

  // Array to store author data for index.json
  const authorsList = [];

  // Copy author directories if they exist
  if (fs.existsSync(authorsDir)) {
    console.log('Found authors directory');
    const authors = fs.readdirSync(authorsDir);
    console.log('Found authors:', authors);
    
    authors.forEach(authorDir => {
      const authorPath = path.join(authorsDir, authorDir);
      const publicAuthorPath = path.join(publicAuthorsDir, authorDir);
      
      // Create author directory in public if it doesn't exist
      if (!fs.existsSync(publicAuthorPath)) {
        fs.mkdirSync(publicAuthorPath, { recursive: true });
        console.log('Created directory for author:', authorDir);
      }

      // Copy all files from author directory
      const files = fs.readdirSync(authorPath);
      console.log(`Files for ${authorDir}:`, files);
      
      // Process bio.md to extract author information
      const bioFile = files.find(file => file.toLowerCase() === 'bio.md');
      if (bioFile) {
        const bioContent = fs.readFileSync(path.join(authorPath, bioFile), 'utf8');
        const { data: frontmatter, content } = matter(bioContent);
        
        // Add author to the list
        authorsList.push({
          name: frontmatter.name || authorDir,
          role: frontmatter.role || '',
          bio: content || '', // Include the full content of bio.md
          areas: frontmatter.areas || [],
          social: frontmatter.social || {}
        });
      }
      
      files.forEach(file => {
        const sourcePath = path.join(authorPath, file);
        const targetPath = path.join(publicAuthorPath, file);
        
        // Handle different file types
        if (file.toLowerCase().endsWith('.png') || 
            file.toLowerCase().endsWith('.jpg') || 
            file.toLowerCase().endsWith('.jpeg')) {
          // Copy image files directly
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`Copied author image: ${file} to ${publicAuthorPath}`);
          
          // Also copy to the author's name-based path for the profile image
          const authorName = authorDir; // This is already in the correct format (e.g., OrhanBiler)
          const ext = path.extname(file);
          const newFileName = `${authorName}${ext}`;
          const authorImagePath = path.join(publicAuthorPath, newFileName);
          
          // Only copy if the target file doesn't exist or is different
          if (!fs.existsSync(authorImagePath) || 
              !fs.readFileSync(sourcePath).equals(fs.readFileSync(authorImagePath))) {
            fs.copyFileSync(sourcePath, authorImagePath);
            console.log(`Copied author image as: ${newFileName} to ${publicAuthorPath}`);
          }
          
          // Remove any old hyphenated versions if they exist
          const hyphenatedName = authorDir.split(/(?=[A-Z])/).join('-');
          const oldFileName = `${hyphenatedName}${ext}`;
          const oldFilePath = path.join(publicAuthorPath, oldFileName);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
            console.log(`Removed old hyphenated author image: ${oldFileName}`);
          }
        } else if (file.toLowerCase().endsWith('.md')) {
          // Process markdown files
          const content = fs.readFileSync(sourcePath, 'utf8');
          const processedContent = processMarkdownContent(content);
          fs.writeFileSync(targetPath, processedContent);
          console.log(`Processed and copied markdown: ${file} to ${publicAuthorPath}`);
        } else {
          // Copy other files directly
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`Copied file: ${file} to ${publicAuthorPath}`);
        }
      });
    });

    // Write index.json with author information
    fs.writeFileSync(
      path.join(publicAuthorsDir, 'index.json'),
      JSON.stringify({ authors: authorsList }, null, 2)
    );
    console.log('Generated authors index.json');
  } else {
    console.log('Authors directory not found at:', authorsDir);
  }

  // Remove the duplicate authors directory in public/authors if it exists
  const oldAuthorsDir = path.join(__dirname, '../public/authors');
  if (fs.existsSync(oldAuthorsDir)) {
    fs.rmSync(oldAuthorsDir, { recursive: true, force: true });
    console.log('Removed duplicate authors directory from public/authors');
  }
}

function syncPosts() {
  // Create directories if they don't exist
  [OBSIDIAN_DIR, PUBLIC_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Clean up public directory first (only .md files)
  if (fs.existsSync(PUBLIC_DIR)) {
    const existingFiles = fs.readdirSync(PUBLIC_DIR)
      .filter(file => file.endsWith('.md'));
    existingFiles.forEach(file => {
      if (file !== 'index.json') {
        fs.unlinkSync(path.join(PUBLIC_DIR, file));
      }
    });
  }

  // Sync assets first
  syncAssets();

  // Sync authors
  syncAuthors();

  // Read all markdown files from Obsidian directory
  const files = fs.readdirSync(OBSIDIAN_DIR)
    .filter(file => file.endsWith('.md') && !file.toLowerCase().includes('template'));

  const posts = [];

  // Process each file
  files.forEach(file => {
    const content = fs.readFileSync(path.join(OBSIDIAN_DIR, file), 'utf8');
    const { data, content: markdown } = matter(content);
    
    // Skip drafts and templates
    if (data.draft === true || file.toLowerCase().includes('template')) return;

    // Generate slug consistently from title or filename
    let slug;
    if (data.slug) {
      // Use explicit slug if provided
      slug = slugify(data.slug);
    } else if (data.title) {
      // Generate from title
      slug = slugify(data.title);
    } else {
      // Generate from filename
      const filename = path.basename(file, '.md');
      slug = slugify(filename);
    }

    // Ensure the slug has no spaces
    slug = slug.replace(/\s+/g, '-');
    
    // Process the content
    const updatedContent = processMarkdownContent(content);

    // Copy file to public directory with proper slug
    fs.writeFileSync(
      path.join(PUBLIC_DIR, `${slug}.md`),
      updatedContent
    );

    // Add to posts list with consistent metadata
    posts.push({
      title: data.title || path.basename(file, '.md'),
      subtitle: data.subtitle || '',
      date: data.date || new Date().toISOString().split('T')[0],
      slug,
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      author: data.author || 'Orhan Biler',
      banner: data.banner || null,
      language: data.language || 'en',
      translations: data.translations || {},
      series: data.series || '',
      seriesOrder: data.seriesOrder || 0,
      lastModified: data.lastModified || new Date().toISOString().split('T')[0]
    });
  });

  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Write index file
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'index.json'),
    JSON.stringify({ posts }, null, 2)
  );

  console.log(`Synced ${posts.length} posts to ${PUBLIC_DIR}`);
  posts.forEach(post => {
    console.log(`- ${post.slug}`);
  });
}

// Export the syncPosts function
module.exports = {
  syncPosts
};

// Run sync if called directly
if (require.main === module) {
  syncPosts();
} 