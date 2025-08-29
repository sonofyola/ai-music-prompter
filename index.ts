import "@expo/metro-runtime";
// import './utils/global-error-handler'; // Temporarily disabled
import './polyfills';
import { registerRootComponent } from 'expo';

import App from './App';

// Add temporary error logging
console.log('Index.ts loading...');

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

console.log('Index.ts loaded successfully');