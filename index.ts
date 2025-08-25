// Load constants polyfill FIRST - before any other imports
import './constants-polyfill.js';

import "@expo/metro-runtime";
import './polyfills'; // Load polyfills second
import './utils/global-error-handler';
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);