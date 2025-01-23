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

// Cache management
const CACHE_VERSION = 'v1';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let postsCache = {
  data: null,
  timestamp: 0,
  version: CACHE_VERSION
};

// Utility to check if cache is valid
const isCacheValid = () => {
  const now = Date.now();
  return (
    postsCache.data &&
    postsCache.version === CACHE_VERSION &&
    now - postsCache.timestamp < CACHE_DURATION
  );
};

// Enhanced post loading with caching and error handling
export async function getAllPosts() {
  try {
    // Check cache first
    if (isCacheValid()) {
      return postsCache.data;
    }

    const timestamp = new Date().getTime();
    const response = await fetch(`/posts/index.json?t=${timestamp}`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Format and enhance the posts
    const formattedPosts = (data.posts || []).map(post => {
      // Ensure date is in correct format
      const date = new Date(post.date);
      const formattedDate = isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
      
      return {
        ...post,
        date: formattedDate,
        tags: post.tags.map(formatTag),
        readingTime: calculateReadingTime(post.excerpt || ''),
        publishedAt: formattedDate,
        lastModified: post.lastModified ? new Date(post.lastModified).toISOString() : null,
        // Ensure banner path is correct
        banner: post.banner || null
      };
    });

    // Sort posts by date before caching
    const sortedPosts = formattedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Update cache
    postsCache = {
      data: sortedPosts,
      timestamp: Date.now(),
      version: CACHE_VERSION
    };
    
    return sortedPosts;
  } catch (error) {
    console.error('Error loading posts:', error);
    // Return cached data if available, even if expired
    return postsCache.data || [];
  }
}

// Calculate estimated reading time
function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

// Enhanced post retrieval with better error handling and caching
export async function getPostBySlug(slug) {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`/posts/${slug}.md?t=${timestamp}`, {
      headers: {
        'Accept': 'text/markdown, text/plain',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`Post not found: ${slug}`);
    }

    const markdown = await response.text();
    const { attributes, body } = frontMatter(markdown);
    
    // Enhanced post metadata
    const tags = attributes.tags ? attributes.tags.map(formatTag) : [];
    const readingTime = calculateReadingTime(body);
    
    return {
      slug,
      title: attributes.title,
      subtitle: attributes.subtitle || '',
      date: attributes.date,
      lastModified: attributes.lastModified || null,
      tags,
      excerpt: attributes.excerpt || '',
      content: body,
      author: attributes.author || 'Orhan Biler',
      banner: attributes.banner || null,
      readingTime,
      series: attributes.series || null,
      seriesOrder: attributes.seriesOrder || null,
      relatedPosts: attributes.relatedPosts || [],
      canonical: attributes.canonical || null,
      language: attributes.language || 'en',
      translations: attributes.translations || []
    };
  } catch (error) {
    console.error('Error loading post:', error);
    return null;
  }
}

// Get posts by tag with pagination
export async function getPostsByTag(tag, page = 1, limit = 10) {
  try {
    const allPosts = await getAllPosts();
    const filteredPosts = allPosts.filter(post =>
      post.tags.some(t => t.urlFriendly === tag.toLowerCase())
    );
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      posts: filteredPosts.slice(startIndex, endIndex),
      total: filteredPosts.length,
      currentPage: page,
      totalPages: Math.ceil(filteredPosts.length / limit)
    };
}
  catch (error) {
    console.error('Error getting posts by tag:', error);
    return {
      posts: [],
      total: 0,
      currentPage: page,
      totalPages: 0
    };
  }
}

// Get related posts
export async function getRelatedPosts(currentPost, limit = 3) {
  try {
    const allPosts = await getAllPosts();
    const relatedPosts = allPosts
      .filter(post => post.slug !== currentPost.slug) // Exclude current post
      .map(post => ({
        ...post,
        relevanceScore: calculateRelevanceScore(currentPost, post)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);

    return relatedPosts;
  } catch (error) {
    console.error('Error getting related posts:', error);
    return [];
  }
}

// Calculate relevance score between two posts
function calculateRelevanceScore(post1, post2) {
  let score = 0;
  
  // Tag matching
  const commonTags = post1.tags.filter(tag1 =>
    post2.tags.some(tag2 => tag2.urlFriendly === tag1.urlFriendly)
  );
  score += commonTags.length * 2;
  
  // Series matching
  if (post1.series && post2.series && post1.series === post2.series) {
    score += 3;
  }
  
  // Date proximity (posts closer in time might be more related)
  const dateDistance = Math.abs(
    new Date(post1.date).getTime() - new Date(post2.date).getTime()
  );
  const daysDifference = dateDistance / (1000 * 60 * 60 * 24);
  if (daysDifference < 30) {
    score += 1;
  }
  
  return score;
}