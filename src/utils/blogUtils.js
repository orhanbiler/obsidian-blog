import frontMatter from 'front-matter';

export async function getAllPosts() {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`/posts/index.json?t=${timestamp}`, {
      cache: 'no-store' // Disable caching
    });
    const data = await response.json();
    return data.posts || [];
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
    
    return {
      slug,
      title: attributes.title,
      date: attributes.date,
      tags: attributes.tags || [],
      excerpt: attributes.excerpt || '',
      content: body
    };
  } catch (error) {
    console.error('Error loading post:', error);
    return null;
  }
}