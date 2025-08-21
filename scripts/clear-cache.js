#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing Expo and Metro cache...');

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

  // Clear Metro cache
  console.log('Clearing Metro cache...');
  execSync('npx expo start --clear', { stdio: 'inherit' });

} catch (error) {
  console.error('Error clearing cache:', error.message);
  process.exit(1);
}