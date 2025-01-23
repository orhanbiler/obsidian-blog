const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to check Git status
function checkGitStatus() {
    try {
        const status = execSync('git status --porcelain').toString();
        return status.length > 0;
    } catch (error) {
        console.error('Error checking git status:', error);
        return false;
    }
}

// Function to sync changes
async function syncChanges() {
    try {
        // Pull latest changes
        console.log('Pulling latest changes...');
        execSync('git pull --rebase');

        // Check if there are changes to commit
        if (checkGitStatus()) {
            console.log('Changes detected, committing...');
            execSync('git add .');
            execSync('git commit -m "Mobile sync: ' + new Date().toISOString() + '"');
            
            console.log('Pushing changes...');
            execSync('git push');
            console.log('Successfully pushed changes!');
        } else {
            console.log('No changes to sync.');
        }
    } catch (error) {
        console.error('Error during sync:', error);
        throw error;
    }
}

// Add this to package.json scripts
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = require(packageJsonPath);

if (!packageJson.scripts['mobile-sync']) {
    packageJson.scripts['mobile-sync'] = 'node scripts/mobile-sync.js';
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Added mobile-sync script to package.json');
}

// Run sync if called directly
if (require.main === module) {
    syncChanges().catch(console.error);
} 