export const performCompleteAuthReset = async () => {
  try {
    console.log('🧹 Starting complete auth reset...');
    
    // Clear all browser storage
    if (typeof window !== 'undefined') {
      // Clear localStorage - be extra aggressive with Basic Tech keys
      if (window.localStorage) {
        console.log('🧹 Clearing localStorage...');
        
        // Get all keys first
        const allKeys = Object.keys(window.localStorage);
        console.log('🔍 Found localStorage keys:', allKeys);
        
        // Clear everything
        window.localStorage.clear();
        
        // Double-check by removing specific keys that might persist
        const basicTechKeys = [
          'basic-auth', 'basic-token', 'basic-user', 'basic-session',
          'kiki-auth', 'kiki-token', 'kiki-user', 'kiki-session',
          'auth-token', 'user-session', 'login-data',
          'basic_auth_token', 'basic_user_data', 'basic_session_data',
          'basictech-auth', 'basictech-user', 'basictech-session',
          'bt-auth', 'bt-user', 'bt-session',
          // Add more specific keys that might contain "sonofyola"
          'sonofyola', 'user-sonofyola', 'auth-sonofyola',
          // Basic Tech specific patterns
          'basic-pds', 'basic-did', 'basic-handle',
          'kiki-pds', 'kiki-did', 'kiki-handle',
          // OAuth and session keys
          'oauth-state', 'oauth-token', 'oauth-user',
          'session-state', 'session-token', 'session-user'
        ];
        
        basicTechKeys.forEach(key => {
          window.localStorage.removeItem(key);
          console.log(`🧹 Removed ${key} from localStorage`);
        });
      }
      
      // Clear sessionStorage
      if (window.sessionStorage) {
        console.log('🧹 Clearing sessionStorage...');
        const allKeys = Object.keys(window.sessionStorage);
        console.log('🔍 Found sessionStorage keys:', allKeys);
        window.sessionStorage.clear();
      }
      
      // Clear IndexedDB more aggressively
      if (window.indexedDB) {
        try {
          console.log('🧹 Clearing IndexedDB...');
          
          // Get all databases
          const databases = await window.indexedDB.databases();
          console.log('🔍 Found IndexedDB databases:', databases.map(db => db.name));
          
          // Delete each database
          for (const db of databases) {
            if (db.name) {
              try {
                await new Promise((resolve, reject) => {
                  const deleteReq = window.indexedDB.deleteDatabase(db.name!);
                  deleteReq.onsuccess = () => {
                    console.log(`🧹 Deleted IndexedDB: ${db.name}`);
                    resolve(true);
                  };
                  deleteReq.onerror = () => reject(deleteReq.error);
                  deleteReq.onblocked = () => {
                    console.log(`⚠️ IndexedDB deletion blocked: ${db.name}`);
                    resolve(false);
                  };
                });
              } catch (e) {
                console.log(`❌ Failed to delete IndexedDB ${db.name}:`, e);
              }
            }
          }
        } catch (e) {
          console.log('🧹 IndexedDB clear failed:', e);
        }
      }
      
      // Clear cookies more aggressively - target specific domains
      if (document && document.cookie) {
        console.log('🧹 Clearing cookies...');
        const cookies = document.cookie.split(";");
        console.log('🔍 Found cookies:', cookies);
        
        for (let cookie of cookies) {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          
          // Clear for multiple domain and path combinations
          const domains = [
            '',
            window.location.hostname,
            `.${window.location.hostname}`,
            'localhost',
            '.localhost',
            '.basictech.com',
            '.kiki.ai',
            '.expo.dev'
          ];
          
          const paths = ['/', '/auth', '/login', '/oauth'];
          
          domains.forEach(domain => {
            paths.forEach(path => {
              const cookieString = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}${domain ? `;domain=${domain}` : ''}`;
              document.cookie = cookieString;
            });
          });
          
          console.log(`🧹 Cleared cookie: ${name}`);
        }
      }
      
      // Clear service workers
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
            console.log('🧹 Unregistered service worker:', registration.scope);
          }
        } catch (e) {
          console.log('🧹 Service worker clear failed:', e);
        }
      }
      
      // Clear caches
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys();
          console.log('🔍 Found caches:', cacheNames);
          for (const name of cacheNames) {
            await caches.delete(name);
            console.log(`🧹 Deleted cache: ${name}`);
          }
        } catch (e) {
          console.log('🧹 Cache clear failed:', e);
        }
      }
    }
    
    // Clear React Native AsyncStorage
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      console.log('🧹 Clearing AsyncStorage...');
      
      // Get all keys first to see what's there
      const allKeys = await AsyncStorage.getAllKeys();
      console.log('🔍 Found AsyncStorage keys:', allKeys);
      
      // Clear everything
      await AsyncStorage.clear();
      console.log('✅ AsyncStorage cleared');
    } catch (e) {
      console.log('🧹 AsyncStorage not available or already cleared');
    }
    
    // Clear Expo SecureStore
    try {
      const SecureStore = require('expo-secure-store');
      const secureStoreKeys = [
        'auth-token', 'user-data', 'session-data',
        'basic-auth', 'kiki-auth', 'basic_auth_token',
        'basic_user_data', 'basic_session_data',
        'sonofyola', 'user-sonofyola', 'auth-sonofyola',
        'basic-pds', 'basic-did', 'basic-handle',
        'kiki-pds', 'kiki-did', 'kiki-handle',
        'oauth-state', 'oauth-token', 'oauth-user'
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
    
    // Force reload with aggressive cache busting
    if (typeof window !== 'undefined' && window.location) {
      setTimeout(() => {
        console.log('🔄 Forcing page reload with cache busting...');
        
        // Clear any remaining browser cache
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
          });
        }
        
        // Force hard reload with multiple cache busting parameters
        const url = new URL(window.location.href);
        url.searchParams.set('reset', Date.now().toString());
        url.searchParams.set('clear', 'true');
        url.searchParams.set('auth', 'reset');
        url.searchParams.set('user', 'clear');
        
        // Use replace to avoid back button issues
        window.location.replace(url.toString());
      }, 1500);
    }
    
  } catch (error) {
    console.error('❌ Error during auth reset:', error);
    
    // Fallback: try to reload anyway
    if (typeof window !== 'undefined' && window.location) {
      setTimeout(() => {
        console.log('🔄 Fallback reload...');
        window.location.reload();
      }, 2000);
    }
  }
};

// Quick reset function for less aggressive clearing
export const performQuickAuthReset = async () => {
  try {
    console.log('🔄 Starting quick auth reset...');
    
    // Clear only auth-related items but be thorough about sonofyola
    if (typeof window !== 'undefined') {
      const authKeys = [
        'basic-auth', 'basic-token', 'basic-user', 'basic-session',
        'kiki-auth', 'kiki-token', 'kiki-user', 'kiki-session',
        'auth-token', 'user-session', 'login-data',
        // Specifically target sonofyola
        'sonofyola', 'user-sonofyola', 'auth-sonofyola',
        // Basic Tech PDS/DID keys
        'basic-pds', 'basic-did', 'basic-handle',
        'kiki-pds', 'kiki-did', 'kiki-handle'
      ];
      
      authKeys.forEach(key => {
        if (window.localStorage) {
          window.localStorage.removeItem(key);
          console.log(`🔄 Removed ${key} from localStorage`);
        }
        if (window.sessionStorage) {
          window.sessionStorage.removeItem(key);
          console.log(`🔄 Removed ${key} from sessionStorage`);
        }
      });
      
      // Also check for any keys containing "sonofyola"
      if (window.localStorage) {
        const allKeys = Object.keys(window.localStorage);
        allKeys.forEach(key => {
          if (key.toLowerCase().includes('sonofyola') || 
              key.toLowerCase().includes('basic') ||
              key.toLowerCase().includes('kiki') ||
              key.toLowerCase().includes('auth')) {
            window.localStorage.removeItem(key);
            console.log(`🔄 Removed suspicious key: ${key}`);
          }
        });
      }
    }
    
    // Clear AsyncStorage auth items
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const authKeys = [
        'basic-auth', 'basic-token', 'basic-user', 'basic-session',
        'auth-token', 'user-session', 'login-data',
        'sonofyola', 'user-sonofyola', 'auth-sonofyola'
      ];
      
      await AsyncStorage.multiRemove(authKeys);
      console.log('🔄 AsyncStorage auth keys cleared');
    } catch (e) {
      console.log('🔄 AsyncStorage quick clear completed');
    }
    
    console.log('✅ Quick auth reset completed');
    
  } catch (error) {
    console.error('❌ Error during quick auth reset:', error);
  }
};

// Nuclear option - clears EVERYTHING and forces multiple reloads
export const performNuclearReset = async () => {
  try {
    console.log('💥 NUCLEAR RESET - This will clear EVERYTHING');
    
    // First, perform complete reset
    await performCompleteAuthReset();
    
    // Additional nuclear options
    if (typeof window !== 'undefined') {
      // Clear ALL localStorage and sessionStorage keys
      if (window.localStorage) {
        const allLocalKeys = Object.keys(window.localStorage);
        console.log('💥 Nuking all localStorage keys:', allLocalKeys);
        allLocalKeys.forEach(key => window.localStorage.removeItem(key));
        // Double-check with clear()
        window.localStorage.clear();
      }
      
      if (window.sessionStorage) {
        const allSessionKeys = Object.keys(window.sessionStorage);
        console.log('💥 Nuking all sessionStorage keys:', allSessionKeys);
        allSessionKeys.forEach(key => window.sessionStorage.removeItem(key));
        // Double-check with clear()
        window.sessionStorage.clear();
      }
      
      // Clear ALL cookies more aggressively
      if (document && document.cookie) {
        console.log('💥 Nuclear cookie destruction...');
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        
        // Also try clearing with different domain combinations
        const hostname = window.location.hostname;
        const domains = ['', hostname, `.${hostname}`, 'localhost', '.localhost'];
        
        document.cookie.split(";").forEach(function(c) {
          const cookieName = c.replace(/^ +/, "").replace(/=.*/, "");
          domains.forEach(domain => {
            document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domain}`;
            document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          });
        });
      }
      
      // Force multiple reloads with different cache busting
      setTimeout(() => {
        console.log('💥 Nuclear reload sequence initiated...');
        // First reload with nuclear flag
        window.location.href = window.location.origin + '?nuclear=1&sonofyola=clear&auth=reset&t=' + Date.now();
      }, 2000);
      
      // Backup reload in case the first one fails
      setTimeout(() => {
        console.log('💥 Backup nuclear reload...');
        window.location.replace(window.location.origin + '?nuclear=2&force=true&t=' + Date.now());
      }, 4000);
    }
    
  } catch (error) {
    console.error('💥 Nuclear reset error:', error);
    // Emergency fallback
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        try {
          window.location.reload();
        } catch (e) {
          window.location.href = window.location.href;
        }
      }, 3000);
    }
  }
};

// Super Nuclear - the most aggressive option possible
export const performSuperNuclearReset = async () => {
  try {
    console.log('🚀 SUPER NUCLEAR RESET - MAXIMUM DESTRUCTION MODE');
    
    // Clear everything multiple times
    for (let i = 0; i < 3; i++) {
      console.log(`🚀 Destruction pass ${i + 1}/3`);
      
      if (typeof window !== 'undefined') {
        // Clear storage
        try { window.localStorage.clear(); } catch (e) {}
        try { window.sessionStorage.clear(); } catch (e) {}
        
        // Clear cookies
        if (document && document.cookie) {
          document.cookie.split(";").forEach(function(c) { 
            const cookieName = c.replace(/^ +/, "").replace(/=.*/, "");
            // Clear with every possible combination
            [
              '',
              window.location.hostname,
              `.${window.location.hostname}`,
              'localhost',
              '.localhost',
              '.basictech.com',
              '.kiki.ai',
              '.expo.dev'
            ].forEach(domain => {
              ['/', '/auth', '/login', '/oauth', '/app'].forEach(path => {
                document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path};domain=${domain}`;
                document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}`;
              });
            });
          });
        }
        
        // Clear IndexedDB
        if (window.indexedDB) {
          try {
            const databases = await window.indexedDB.databases();
            for (const db of databases) {
              if (db.name) {
                window.indexedDB.deleteDatabase(db.name);
              }
            }
          } catch (e) {}
        }
        
        // Clear caches
        if ('caches' in window) {
          try {
            const cacheNames = await caches.keys();
            for (const name of cacheNames) {
              await caches.delete(name);
            }
          } catch (e) {}
        }
      }
      
      // Clear AsyncStorage
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.clear();
      } catch (e) {}
      
      // Wait between passes
      if (i < 2) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log('🚀 Super nuclear destruction complete. Initiating reload sequence...');
    
    // Multiple reload attempts with different methods
    if (typeof window !== 'undefined') {
      // Method 1: Replace with cache busting
      setTimeout(() => {
        const url = new URL(window.location.origin);
        url.searchParams.set('supernuclear', '1');
        url.searchParams.set('sonofyola', 'destroyed');
        url.searchParams.set('auth', 'obliterated');
        url.searchParams.set('cache', 'busted');
        url.searchParams.set('t', Date.now().toString());
        url.searchParams.set('r', Math.random().toString());
        window.location.replace(url.toString());
      }, 1000);
      
      // Method 2: Hard reload
      setTimeout(() => {
        try {
          window.location.reload();
        } catch (e) {
          window.location.href = window.location.href;
        }
      }, 3000);
      
      // Method 3: Navigate to origin
      setTimeout(() => {
        window.location.href = window.location.origin + '?final=true&t=' + Date.now();
      }, 5000);
    }
    
  } catch (error) {
    console.error('🚀 Super nuclear reset error:', error);
    // Ultimate fallback
    if (typeof window !== 'undefined') {
      try {
        window.location.reload();
      } catch (e) {
        window.location.href = window.location.href;
      }
    }
  }
};

// Project-level reset - forces Basic Tech to start completely fresh
export const performProjectReset = async () => {
  try {
    console.log('🏗️ PROJECT RESET - Forcing Basic Tech to start fresh');
    
    // First, perform super nuclear reset to clear all local data
    await performSuperNuclearReset();
    
    // Add project-specific reset parameters to the URL
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        console.log('🏗️ Forcing project-level reset...');
        
        const url = new URL(window.location.origin);
        url.searchParams.set('project_reset', '1');
        url.searchParams.set('force_new_session', 'true');
        url.searchParams.set('clear_project_cache', 'true');
        url.searchParams.set('sonofyola_override', 'true');
        url.searchParams.set('basic_tech_reset', 'true');
        url.searchParams.set('t', Date.now().toString());
        url.searchParams.set('r', Math.random().toString());
        
        console.log('🏗️ Redirecting with project reset parameters...');
        window.location.replace(url.toString());
      }, 2000);
    }
    
  } catch (error) {
    console.error('🏗️ Project reset error:', error);
    // Fallback to super nuclear
    await performSuperNuclearReset();
  }
};

// Ultimate reset - creates a completely new session context
export const performUltimateReset = async () => {
  try {
    console.log('🌟 ULTIMATE RESET - Creating completely new session context');
    
    // Clear everything multiple times
    for (let i = 0; i < 5; i++) {
      console.log(`🌟 Ultimate destruction pass ${i + 1}/5`);
      
      if (typeof window !== 'undefined') {
        // Clear all storage
        try { window.localStorage.clear(); } catch (e) {}
        try { window.sessionStorage.clear(); } catch (e) {}
        
        // Clear all cookies with maximum aggression
        if (document && document.cookie) {
          document.cookie.split(";").forEach(function(c) { 
            const cookieName = c.replace(/^ +/, "").replace(/=.*/, "");
            
            // Clear with every possible domain/path combination
            const domains = [
              '', 
              window.location.hostname,
              `.${window.location.hostname}`,
              'localhost', 
              '.localhost',
              '.basictech.com',
              '.kiki.ai',
              '.kiki.dev',
              '.expo.dev',
              'project-de0e3374.dev.kiki.dev',
              '.project-de0e3374.dev.kiki.dev'
            ];
            
            const paths = ['/', '/auth', '/login', '/oauth', '/app', '/api', '/session'];
            
            domains.forEach(domain => {
              paths.forEach(path => {
                // Multiple expiration strategies
                const expirations = [
                  'Thu, 01 Jan 1970 00:00:00 GMT',
                  'Thu, 01 Jan 1970 00:00:01 GMT',
                  'Wed, 31 Dec 1969 23:59:59 GMT'
                ];
                
                expirations.forEach(expires => {
                  document.cookie = `${cookieName}=;expires=${expires};path=${path};domain=${domain}`;
                  document.cookie = `${cookieName}=;expires=${expires};path=${path}`;
                  document.cookie = `${cookieName}=deleted;expires=${expires};path=${path};domain=${domain}`;
                  document.cookie = `${cookieName}=deleted;expires=${expires};path=${path}`;
                });
              });
            });
          });
        }
        
        // Clear IndexedDB with extreme prejudice
        if (window.indexedDB) {
          try {
            const databases = await window.indexedDB.databases();
            for (const db of databases) {
              if (db.name) {
                // Try multiple deletion methods
                window.indexedDB.deleteDatabase(db.name);
                
                // Force close any open connections
                try {
                  const openReq = window.indexedDB.open(db.name);
                  openReq.onsuccess = () => {
                    openReq.result.close();
                    window.indexedDB.deleteDatabase(db.name);
                  };
                } catch (e) {}
              }
            }
          } catch (e) {}
        }
        
        // Clear all caches
        if ('caches' in window) {
          try {
            const cacheNames = await caches.keys();
            for (const name of cacheNames) {
              await caches.delete(name);
            }
          } catch (e) {}
        }
        
        // Clear service workers
        if ('serviceWorker' in navigator) {
          try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
              await registration.unregister();
            }
          } catch (e) {}
        }
      }
      
      // Clear AsyncStorage
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.clear();
      } catch (e) {}
      
      // Wait between passes
      if (i < 4) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    console.log('🌟 Ultimate destruction complete. Creating new session context...');
    
    // Force complete page reload with maximum cache busting and session reset
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const url = new URL(window.location.origin);
        
        // Add every possible reset parameter
        url.searchParams.set('ultimate_reset', '1');
        url.searchParams.set('new_session', 'true');
        url.searchParams.set('force_fresh', 'true');
        url.searchParams.set('clear_all', 'true');
        url.searchParams.set('sonofyola_destroyed', 'true');
        url.searchParams.set('basic_tech_reset', 'true');
        url.searchParams.set('project_reset', 'true');
        url.searchParams.set('auth_reset', 'true');
        url.searchParams.set('cache_bust', Date.now().toString());
        url.searchParams.set('session_id', Math.random().toString(36));
        url.searchParams.set('reset_id', Math.random().toString(36));
        url.searchParams.set('timestamp', new Date().toISOString());
        
        console.log('🌟 Initiating ultimate reload with new session context...');
        window.location.replace(url.toString());
      }, 1000);
      
      // Backup reload methods
      setTimeout(() => {
        try {
          window.location.reload();
        } catch (e) {
          window.location.href = window.location.origin + '?fallback=true&t=' + Date.now();
        }
      }, 3000);
      
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 5000);
    }
    
  } catch (error) {
    console.error('🌟 Ultimate reset error:', error);
    // Final fallback
    if (typeof window !== 'undefined') {
      window.location.href = window.location.origin + '?emergency=true';
    }
  }
};
