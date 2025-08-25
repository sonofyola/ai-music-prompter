import "@expo/metro-runtime";
import './utils/global-error-handler';
import './polyfills';
import { registerRootComponent } from 'expo';

import TestApp from './App.test';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(TestApp);
