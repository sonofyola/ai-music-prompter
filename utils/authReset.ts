export const performCompleteAuthReset = async () => {
  try {
    console.log('🧹 Starting complete auth reset...');
    
    // Clear all possible storage locations
    if (typeof localStorage !== 'undefined') {
      console.log('🧹 Clearing localStorage...');
      localStorage.clear();
    }
    
    if (typeof sessionStorage !== 'undefined') {
      console.log('🧹 Clearing sessionStorage...');
      sessionStorage.clear();
    }
    
    // Clear AsyncStorage
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      console.log('🧹 Clearing AsyncStorage...');
      await AsyncStorage.clear();
    } catch (e) {
      console.log('🧹 AsyncStorage not available or already cleared');
    }
    
    // Clear IndexedDB (where Basic Tech might store data)
    if (typeof window !== 'undefined' && window.indexedDB) {
      try {
        console.log('🧹 Clearing IndexedDB...');
        const databases = await window.indexedDB.databases();
        await Promise.all(
          databases.map(db => {
            if (db.name) {
              return new Promise((resolve, reject) => {
                const deleteReq = window.indexedDB.deleteDatabase(db.name!);
                deleteReq.onsuccess = () => resolve(true);
                deleteReq.onerror = () => reject(deleteReq.error);
              });
            }
          })
        );
      } catch (e) {
        console.log('🧹 IndexedDB clear failed:', e);
      }
    }
    
    // Clear all cookies more aggressively
    if (typeof document !== 'undefined') {
      console.log('🧹 Clearing cookies...');
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
        // Clear for multiple domains and paths
        const domains = ['', '.localhost', 'localhost', window.location.hostname];
        const paths = ['/', '/auth', '/login'];
        
        domains.forEach(domain => {
          paths.forEach(path => {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}${domain ? `;domain=${domain}` : ''}`;
          });
        });
      });
    }
    
    // Clear any Basic Tech specific storage - EXPANDED LIST
    const basicTechKeys = [
      'basic-auth',
      'basic-token', 
      'basic-user',
      'basic-session',
      'kiki-auth',
      'kiki-token',
      'kiki-user', 
      'kiki-session',
      'auth-token',
      'user-session',
      'login-data',
      // Additional Basic Tech keys
      'basic_auth_token',
      'basic_user_data',
      'basic_session_data',
      'basictech-auth',
      'basictech-user',
      'basictech-session',
      'bt-auth',
      'bt-user',
      'bt-session',
      // Expo SecureStore keys that might be used
      'expo-auth-session',
      'expo-secure-store-auth'
    ];
    
    if (typeof localStorage !== 'undefined') {
      // Clear all localStorage keys that might contain auth data
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        if (key.toLowerCase().includes('auth') || 
            key.toLowerCase().includes('user') || 
            key.toLowerCase().includes('session') ||
            key.toLowerCase().includes('basic') ||
            key.toLowerCase().includes('kiki') ||
            key.toLowerCase().includes('token')) {
          localStorage.removeItem(key);
          console.log(`🧹 Removed suspicious key: ${key}`);
        }
      });
      
      basicTechKeys.forEach(key => {
        localStorage.removeItem(key);
        console.log(`🧹 Removed ${key} from localStorage`);
      });
    }
    
    if (typeof sessionStorage !== 'undefined') {
      // Clear all sessionStorage keys that might contain auth data
      const allKeys = Object.keys(sessionStorage);
      allKeys.forEach(key => {
        if (key.toLowerCase().includes('auth') || 
            key.toLowerCase().includes('user') || 
            key.toLowerCase().includes('session') ||
            key.toLowerCase().includes('basic') ||
            key.toLowerCase().includes('kiki') ||
            key.toLowerCase().includes('token')) {
          sessionStorage.removeItem(key);
          console.log(`🧹 Removed suspicious key: ${key}`);
        }
      });
      
      basicTechKeys.forEach(key => {
        sessionStorage.removeItem(key);
        console.log(`🧹 Removed ${key} from sessionStorage`);
      });
    }
    
    // Clear Expo SecureStore if available
    try {
      const SecureStore = require('expo-secure-store');
      const secureStoreKeys = [
        'auth-token',
        'user-data', 
        'session-data',
        'basic-auth',
        'kiki-auth'
      ];
      
      for (const key of secureStoreKeys) {
        try {
          await SecureStore.deleteItemAsync(key);
          console.log(`🧹 Removed ${key} from SecureStore`);
        } catch (e) {
          // Key might not exist, that's fine
        }
      }
    } catch (e) {
      console.log('🧹 SecureStore not available');
    }
    
    console.log('🧹 Complete auth reset performed');
    
    // Force reload after a short delay
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.location) {
        console.log('🧹 Forcing page reload...');
        window.location.href = window.location.origin + '?clear=' + Date.now();
      }
    }, 1000);
    
  } catch (error) {
    console.error('❌ Error during auth reset:', error);
  }
};
