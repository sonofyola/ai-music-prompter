// Platform polyfill for web compatibility
import { Platform as RNPlatform } from 'react-native';

const Platform = {
  ...RNPlatform,
  OS: typeof window !== 'undefined' ? 'web' : RNPlatform.OS,
  select: (obj) => {
    if (typeof window !== 'undefined') {
      return obj.web || obj.default;
    }
    return RNPlatform.select(obj);
  }
};

export default Platform;