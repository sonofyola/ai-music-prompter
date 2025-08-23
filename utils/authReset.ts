export const performCompleteAuthReset = async () => {
  try {
    console.log('🧹 Starting complete auth reset...');
    
    // Clear all browser storage
    if (typeof window !== 'undefined') {
      // Clear localStorage
      if (window.localStorage) {
        console.log('🧹 Clearing localStorage...');
        window.localStorage.clear();
      }
      
      // Clear sessionStorage
      if (window.sessionStorage) {
        console.log('🧹 Clearing sessionStorage...');
        window.sessionStorage.clear();
      }
      
      // Clear IndexedDB
      if (window.indexedDB) {
        try {
          console.log('🧹 Clearing IndexedDB...');
          const databases = await window.indexedDB.databases();
          await Promise.all(
            databases.map(db => {
              if (db.name) {
                return new Promise((resolve) => {
                  const deleteReq = window.indexedDB.deleteDatabase(db.name!);
                  deleteReq.onsuccess = () => resolve(true);
                  deleteReq.onerror = () => resolve(false); // Don't fail on error
                  deleteReq.onblocked = () => resolve(false);
                });
              }
            })
          );
        } catch (e) {
          console.log('🧹 IndexedDB clear failed (this is often normal):', e);
        }
      }
      
      // Clear cookies more thoroughly
      if (document && document.cookie) {
        console.log('🧹 Clearing cookies...');
        const cookies = document.cookie.split(";");
        
        for (let cookie of cookies) {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          
          // Clear for current domain and path
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
        }
      }
      
      // Clear service workers
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map(registration => registration.unregister()));
          console.log('🧹 Service workers cleared');
        } catch (e) {
          console.log('🧹 Service worker clear failed:', e);
        }
      }
      
      // Clear caches
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
          console.log('🧹 Caches cleared');
        } catch (e) {
          console.log('🧹 Cache clear failed:', e);
        }
      }
    }
    
    // Clear React Native AsyncStorage
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      console.log('🧹 Clearing AsyncStorage...');
      await AsyncStorage.clear();
    } catch (e) {
      console.log('🧹 AsyncStorage not available or already cleared');
    }
    
    // Clear Expo SecureStore
    try {
      const SecureStore = require('expo-secure-store');
      const secureStoreKeys = [
        'auth-token',
        'user-data', 
        'session-data',
        'basic-auth',
        'kiki-auth',
        'basic_auth_token',
        'basic_user_data',
        'basic_session_data'
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
    
    console.log('✅ Complete auth reset performed');
    
    // Force reload with cache busting
    if (typeof window !== 'undefined' && window.location) {
      setTimeout(() => {
        console.log('🔄 Forcing page reload...');
        const url = new URL(window.location.href);
        url.searchParams.set('reset', Date.now().toString());
        window.location.href = url.toString();
      }, 1000);
    }
    
  } catch (error) {
    console.error('❌ Error during auth reset:', error);
    
    // Fallback: try to reload anyway
    if (typeof window !== 'undefined' && window.location) {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }
};

// Quick reset function for less aggressive clearing
export const performQuickAuthReset = async () => {
  try {
    console.log('🔄 Starting quick auth reset...');
    
    // Clear only auth-related items
    if (typeof window !== 'undefined') {
      const authKeys = [
        'basic-auth', 'basic-token', 'basic-user', 'basic-session',
        'kiki-auth', 'kiki-token', 'kiki-user', 'kiki-session',
        'auth-token', 'user-session', 'login-data'
      ];
      
      authKeys.forEach(key => {
        if (window.localStorage) window.localStorage.removeItem(key);
        if (window.sessionStorage) window.sessionStorage.removeItem(key);
      });
    }
    
    // Clear AsyncStorage auth items
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const authKeys = [
        'basic-auth', 'basic-token', 'basic-user', 'basic-session',
        'auth-token', 'user-session', 'login-data'
      ];
      
      await AsyncStorage.multiRemove(authKeys);
    } catch (e) {
      console.log('🔄 AsyncStorage quick clear completed');
    }
    
    console.log('✅ Quick auth reset completed');
    
  } catch (error) {
    console.error('❌ Error during quick auth reset:', error);
  }
};
