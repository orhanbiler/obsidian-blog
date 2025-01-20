# Personal Blog with Obsidian Integration

A modern, React-based blog that seamlessly integrates with Obsidian for content management. Write your blog posts in Obsidian and automatically sync them to your website.

## Features

- 🌓 Dark/Light mode support
- ✨ Modern and clean UI using Chakra UI
- 📝 Write posts in Markdown using Obsidian
- 🎨 Syntax highlighting for code blocks
- 🏷️ Tag-based post organization
- 🔍 Search functionality
- 📱 Fully responsive design
- 🔄 Automatic post syncing

## Tech Stack

- React
- Chakra UI
- React Router
- Prism.js for syntax highlighting
- Marked for Markdown parsing
- Date-fns for date formatting

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Obsidian (for content management)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

2. Install dependencies:
```bash
npm install
```

3. Set up your Obsidian vault:
   - Create a new Obsidian vault or open an existing one
   - Create a folder named `OrhanBiler.us` in your vault
   - Use the provided template for new posts (see below)

4. Start the development server:
```bash
npm start
```

5. Start the post sync watcher:
```bash
npm run watch-posts
```

## Blog Post Template

Each blog post should include YAML frontmatter with the following structure:

```yaml
---
title: Your Post Title
date: YYYY-MM-DD
tags: [tag1, tag2]
excerpt: A brief description of your post
draft: true/false
---
```

## Project Structure

```
├── public/
├── src/
│   ├── components/
│   │   ├── BlogList.js
│   │   ├── BlogPost.js
│   │   └── Layout.js
│   ├── utils/
│   │   └── blogUtils.js
│   └── App.js
├── ObsidianVault/
│   └── posts/
│       └── OrhanBiler.us/
├── scripts/
│   └── sync-posts.js
└── package.json
```

## Scripts

- `npm start`: Start the development server
- `npm run build`: Build the project for production
- `npm run sync-posts`: Manually sync Obsidian posts
- `npm run watch-posts`: Watch for changes in Obsidian posts and sync automatically

## Customization

### Theme

The blog uses Chakra UI's theming system. You can customize colors, fonts, and other design tokens in the theme configuration.

### Post Styling

Code blocks support syntax highlighting for:
- JavaScript/JSX
- HTML
- CSS
- Markdown
- YAML
- JSON

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Obsidian](https://obsidian.md/) for the amazing note-taking experience
- [Chakra UI](https://chakra-ui.com/) for the component library
- [Prism.js](https://prismjs.com/) for syntax highlighting 