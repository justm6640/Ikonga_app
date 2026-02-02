// Script to replace deprecated IKONGA colors with charter colors
const fs = require('fs');
const path = require('path');

const replacements = [
    // Replace ikonga-pink with ikonga-coral (but not ikonga-pink-accent)
    { from: /\bikonga-pink\b(?!-accent)/g, to: 'ikonga-coral' },

    // Replace ikonga-orange with ikonga-coral or ikonga-pink-accent depending on context
    { from: /\bbg-ikonga-orange\b/g, to: 'bg-ikonga-coral' },
    { from: /\btext-ikonga-orange\b/g, to: 'text-ikonga-coral' },
    { from: /\bborder-ikonga-orange\b/g, to: 'border-ikonga-coral' },
    { from: /\bfrom-ikonga-orange\b/g, to: 'from-ikonga-coral' },
    { from: /\bto-ikonga-orange\b/g, to: 'to-ikonga-pink-accent' },
    { from: /\bhover:bg-ikonga-orange\b/g, to: 'hover:bg-ikonga-pink-accent' },
    { from: /\bhover:text-ikonga-orange\b/g, to: 'hover:text-ikonga-pink-accent' },
];

function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        replacements.forEach(({ from, to }) => {
            if (from.test(content)) {
                content = content.replace(from, to);
                modified = true;
            }
        });

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Updated: ${path.relative(process.cwd(), filePath)}`);
            return 1;
        }
        return 0;
    } catch (error) {
        console.error(`✗ Error processing ${filePath}:`, error.message);
        return 0;
    }
}

function walkDir(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Skip node_modules and hidden directories
            if (!file.startsWith('.') && file !== 'node_modules') {
                walkDir(filePath, fileList);
            }
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

console.log('🎨 IKONGA Color Migration Script');
console.log('================================\n');

const componentsDir = path.join(__dirname, 'components');
const appDir = path.join(__dirname, 'app');

let totalFiles = 0;

console.log('📂 Processing components directory...');
const componentFiles = walkDir(componentsDir);
componentFiles.forEach(file => {
    totalFiles += processFile(file);
});

console.log('\n📂 Processing app directory...');
const appFiles = walkDir(appDir);
appFiles.forEach(file => {
    totalFiles += processFile(file);
});

console.log(`\n✅ Migration complete! Updated ${totalFiles} files.`);
