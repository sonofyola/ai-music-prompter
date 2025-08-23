#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Clear Expo cache directories
const cacheDirs = [
  '.expo/cache',
  '.expo/web/cache',
  'node_modules/.cache',
];

function clearDirectory(dir) {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`✅ Cleared: ${dir}`);
    } catch (error) {
      console.log(`❌ Failed to clear ${dir}:`, error.message);
    }
  } else {
    console.log(`⚠️  Directory not found: ${dir}`);
  }
}

console.log('🧹 Clearing Expo cache directories...');
cacheDirs.forEach(clearDirectory);

console.log('✨ Cache clearing complete!');
console.log('💡 You may also want to:');
console.log('   - Clear your browser cache');
console.log('   - Try incognito/private browsing mode');
console.log('   - Disable browser extensions temporarily');
