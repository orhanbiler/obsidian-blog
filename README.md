# Obsidian Blog

A React-based blog that automatically syncs content from an Obsidian vault. Write your blog posts in Obsidian and have them automatically published to your website.

## Features

- Automatic syncing from Obsidian vault to blog
- Markdown support with full Obsidian compatibility
- Image and media handling
- Clean, modern UI
- Fast and responsive

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your Obsidian vault path in `config.js`
4. Start the development server:
   ```bash
   npm start
   ```
5. Start the watch script to sync posts:
   ```bash
   npm run watch-posts
   ```

## Development

- `npm start` - Start the development server
- `npm run watch-posts` - Watch for changes in Obsidian vault and sync to blog
- `npm run build` - Build for production
- `npm test` - Run tests

## License

MIT 