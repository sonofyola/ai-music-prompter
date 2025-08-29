import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface BreadcrumbItem {
  label: string;
  url?: string;
  onPress?: () => void;
}

interface BreadcrumbSEOProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbSEO({ items }: BreadcrumbSEOProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.url || `https://aimusicpromptr.com${item.url || ''}`
    }))
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Visual Breadcrumb */}
      <View style={styles.container}>
        {items.map((item, index) => (
          <View key={index} style={styles.breadcrumbItem}>
            {index > 0 && (
              <MaterialIcons 
                name="chevron-right" 
                size={16} 
                color="#888888" 
                style={styles.separator}
              />
            )}
            {item.onPress ? (
              <TouchableOpacity onPress={item.onPress}>
                <Text style={[
                  styles.breadcrumbText,
                  index === items.length - 1 ? styles.currentPage : styles.linkPage
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={[
                styles.breadcrumbText,
                index === items.length - 1 ? styles.currentPage : styles.linkPage
              ]}>
                {item.label}
              </Text>
            )}
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2a2a2a',
    borderBottomWidth: 1,
    borderBottomColor: '#444444',
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    marginHorizontal: 8,
  },
  breadcrumbText: {
    fontSize: 14,
  },
  linkPage: {
    color: '#4CAF50',
  },
  currentPage: {
    color: '#ffffff',
    fontWeight: '600',
  },
});