import frontMatter from 'front-matter';

// Format tags by removing spaces and special characters while preserving Turkish characters
const formatTag = (tag) => {
  const turkishCharMap = {
    'ı': 'i', 'İ': 'i',
    'ğ': 'g', 'Ğ': 'g',
    'ü': 'u', 'Ü': 'u',
    'ş': 's', 'Ş': 's',
    'ö': 'o', 'Ö': 'o',
    'ç': 'c', 'Ç': 'c'
  };

  const urlFriendly = tag
    .trim()
    .toLowerCase()
    .split('')
    .map(char => turkishCharMap[char] || char)
    .join('')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return {
    original: tag.trim(),
    urlFriendly
  };
};

export async function getAllPosts() {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`/posts/index.json?t=${timestamp}`, {
      cache: 'no-store' // Disable caching
    });
    const data = await response.json();
    
    // Format the posts to ensure tags are properly structured
    const formattedPosts = (data.posts || []).map(post => ({
      ...post,
      tags: post.tags.map(tag => ({
        original: tag,
        urlFriendly: tag.toLowerCase().replace(/\s+/g, '-')
      }))
    }));
    
    return formattedPosts;
  } catch (error) {
    console.error('Error loading posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug) {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`/posts/${slug}.md?t=${timestamp}`, {
      cache: 'no-store' // Disable caching
    });
    const markdown = await response.text();
    const { attributes, body } = frontMatter(markdown);
    
    // Format tags if they exist
    const tags = attributes.tags ? attributes.tags.map(tag => formatTag(tag)) : [];
    
    return {
      slug,
      title: attributes.title,
      subtitle: attributes.subtitle || '',
      date: attributes.date,
      tags,
      excerpt: attributes.excerpt || '',
      content: body,
      author: attributes.author || 'Orhan Biler',
      banner: attributes.banner || null
    };
  } catch (error) {
    console.error('Error loading post:', error);
    return null;
  }
}