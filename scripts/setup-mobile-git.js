const fs = require('fs');
const path = require('path');

// Create a .gitconfig file for mobile use
const gitConfigContent = `[core]
    autocrlf = input
[user]
    name = Orhan Biler
    email = your.email@example.com
[credential]
    helper = store
[init]
    defaultBranch = main
[pull]
    rebase = true`;

const mobileSetupInstructions = `
Mobile Git Setup Instructions:
============================

1. In Obsidian mobile app:
   - Go to Settings → Community plugins
   - Enable "Obsidian Git"
   - Click on "Options" for Obsidian Git

2. Configure these settings:
   - Vault backup interval: 1
   - Auto pull interval: 1
   - Disable "Pull changes before push"
   - Enable "Push on backup"
   - Set Commit message format: "vault backup: {{date}}"

3. Authentication:
   - Create a Personal Access Token on GitHub:
     * Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
     * Generate new token
     * Give it 'repo' access
     * Copy the token

4. First-time setup on phone:
   - Open your vault
   - Click "Initialize repository" in Obsidian Git
   - When prompted for credentials:
     * Username: your GitHub username
     * Password: use the personal access token you created

Common Issues:
-------------
1. If push fails:
   - Check the Obsidian Git plugin settings
   - Verify your personal access token hasn't expired
   - Try manually pulling before pushing

2. If changes aren't syncing:
   - Check if auto backup is enabled
   - Verify the backup interval is set to 1 minute
   - Check if "Push on backup" is enabled

3. Network issues:
   - Ensure you have a stable internet connection
   - Try manually pushing using the command palette (Cmd/Ctrl + P)

Need help? Contact support@orhanbiler.us
`;

// Write the instructions
fs.writeFileSync(
    path.join(__dirname, '../mobile-setup.md'),
    mobileSetupInstructions,
    'utf8'
);

console.log('Mobile setup instructions created at mobile-setup.md');
console.log('Please follow the instructions in the file to complete mobile setup.'); 