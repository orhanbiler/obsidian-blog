---
title: Getting Started with Obsidian Bloggings
date: 2024-01-19
tags:
  - obsidian
  - blogging
  - markdown
excerpt: Learn how to use Obsidian as a powerful blogging platform with automatic syncing to your website.
draft: false
---

# Getting Started with Obsidian Blogging

Obsidian is a powerful knowledge management tool that can also serve as an excellent blogging platform. In this post, I'll share my experience setting up Obsidian for managing my blog posts.

## Why Use Obsidian for Blogging

1. **Powerful Markdown Editor**: Obsidian provides a fantastic Markdown editing experience with live preview.
2. **Local File Storage**: All your posts are stored as local Markdown files.
3. **Linking Between Posts**: Easily create connections between related posts.
4. **Version Control**: Works great with Git for version control.

## Key Features

### Frontmatter Support
Each post starts with YAML frontmatter that includes:
```yaml
---
title: Your Post Title
date: 2024-01-19
tags: [markdown, tutorial]
excerpt: A brief description of your post
draft: true
---
```

### Markdown Examples

#### Basic Formatting
```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
~~Strikethrough~~

> This is a blockquote
```

#### Lists
```markdown
- Unordered list item 1
- Unordered list item 2
  - Nested item
  - Another nested item

1. Ordered list item 1
2. Ordered list item 2
   1. Nested ordered item
   2. Another nested item
```

#### Code Blocks
```markdown
\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

Inline code: \`const name = "John"\`
```

#### Links and Images
```markdown
[Link text](https://example.com)
![Alt text](path/to/image.jpg)

[[Internal Obsidian link]]
![[Embedded image]]
```

### Automatic Syncing
When you save a post in Obsidian, it automatically:
1. Generates a URL-friendly slug
2. Updates the post index
3. Makes it available on your website

## Getting Started

To create a new post:
1. Use the blog post template
2. Fill in the frontmatter
3. Write your content
4. Set `draft: false` when ready to publish

## References and Links
- [Obsidian Documentation](https://help.obsidian.md)
- [Markdown Guide](https://www.markdownguide.org)

## Related Posts
- Coming soon! 


```js

console.log('Hello world');

```

Thanks!