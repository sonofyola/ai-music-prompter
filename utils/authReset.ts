export const performCompleteAuthReset = async () => {
  try {
    // Clear all possible storage locations
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
    
    // Clear AsyncStorage
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.clear();
    } catch (e) {
      // AsyncStorage not available
    }
    
    // Clear any cookies
    if (typeof document !== 'undefined') {
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
    }
    
    console.log('🧹 Complete auth reset performed');
    
    // Force reload
    if (typeof window !== 'undefined' && window.location) {
      window.location.href = window.location.origin;
    }
    
  } catch (error) {
    console.error('❌ Error during auth reset:', error);
  }
};