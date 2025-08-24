import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  style?: any;
  className?: string;
}

export default function AdSenseAd({ 
  adSlot, 
  adFormat = 'auto', 
  style,
  className = 'adsbygoogle'
}: AdSenseAdProps) {
  useEffect(() => {
    // Only run on web
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, []);

  // Only render on web
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <View style={[styles.adContainer, style]}>
      <ins
        className={className}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
        }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID" // Replace with your AdSense publisher ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  adContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    minHeight: 100,
  },
});