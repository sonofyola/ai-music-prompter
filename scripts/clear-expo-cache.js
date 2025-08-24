const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing Expo and Metro caches...');

try {
  // Clear Expo cache
  if (fs.existsSync('.expo')) {
    console.log('Clearing .expo directory...');
    execSync('rm -rf .expo', { stdio: 'inherit' });
  }

  // Clear node_modules/.cache
  const cacheDir = path.join('node_modules', '.cache');
  if (fs.existsSync(cacheDir)) {
    console.log('Clearing node_modules/.cache...');
    execSync('rm -rf node_modules/.cache', { stdio: 'inherit' });
  }

  console.log('✅ Cache clearing complete');
  console.log('Please restart your Expo dev server');
} catch (error) {
  console.error('❌ Error clearing cache:', error.message);
}