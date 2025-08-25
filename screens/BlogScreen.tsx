import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { blogPosts, getFeaturedPosts, getAllCategories, searchPosts, type BlogPost } from '../data/blogPosts';

export default function BlogScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const categories = ['All', ...getAllCategories()];
  const featuredPosts = getFeaturedPosts();

  const getFilteredPosts = (): BlogPost[] => {
    let posts = blogPosts;

    // Apply search filter
    if (searchQuery.trim()) {
      posts = searchPosts(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      posts = posts.filter(post => post.category === selectedCategory);
    }

    // Sort by publish date (newest first)
    return posts.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const renderBlogPost = (post: BlogPost) => {
    // Convert markdown-style content to plain text for preview
    const getPlainTextPreview = (content: string, maxLength: number = 200) => {
      const plainText = content
        .replace(/#{1,6}\s+/g, '') // Remove markdown headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
        .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
        .replace(/`(.*?)`/g, '$1') // Remove code markdown
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
        .replace(/\n\s*\n/g, ' ') // Replace double newlines with space
        .replace(/\n/g, ' ') // Replace single newlines with space
        .trim();
      
      return plainText.length > maxLength 
        ? plainText.substring(0, maxLength) + '...'
        : plainText;
    };

    return (
      <ScrollView style={styles.postContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.postHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedPost(null)}
          >
            <MaterialIcons name="arrow-back" size={24} color="#4CAF50" />
            <Text style={styles.backButtonText}>Back to Blog</Text>
          </TouchableOpacity>
        </View>

        {/* Post Content */}
        <View style={styles.postContent}>
          <View style={styles.postMeta}>
            <Text style={styles.postCategory}>{post.category}</Text>
            <Text style={styles.postDate}>{formatDate(post.publishDate)}</Text>
          </View>

          <Text style={styles.postTitle}>{post.title}</Text>

          <View style={styles.postInfo}>
            <Text style={styles.postAuthor}>By {post.author}</Text>
            <Text style={styles.postReadTime}>{post.readTime} min read</Text>
          </View>

          {/* Social Buttons */}
          {renderSocialButtons(post)}

          <View style={styles.postTags}>
            {post.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Content Preview */}
          <View style={styles.contentPreview}>
            <Text style={styles.contentText}>
              {getPlainTextPreview(post.content, 1000)}
            </Text>
          </View>

          {/* Social Buttons Bottom */}
          <View style={styles.socialBottomSection}>
            <Text style={styles.socialBottomTitle}>Found this helpful? Share it!</Text>
            {renderSocialButtons(post)}
          </View>

          {/* Call to Action */}
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Ready to Create Amazing Music?</Text>
            <Text style={styles.ctaDescription}>
              Use our AI Music Prompter to generate professional prompts for your next musical creation.
            </Text>
            <TouchableOpacity style={styles.ctaButton}>
              <MaterialIcons name="music-note" size={20} color="#ffffff" />
              <Text style={styles.ctaButtonText}>Try AI Music Prompter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  if (selectedPost) {
    return (
      <SafeAreaView style={styles.container}>
        {renderBlogPost(selectedPost)}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📚 AI Music Blog</Text>
          <Text style={styles.subtitle}>Tips, tutorials, and insights for AI music creation</Text>
          
          {/* Social Follow Buttons */}
          <View style={styles.followSection}>
            <Text style={styles.followTitle}>Follow us for updates:</Text>
            <View style={styles.followButtons}>
              <TouchableOpacity 
                style={[styles.followButton, styles.twitterButton]}
                onPress={() => Linking.openURL('https://twitter.com/aimusicpromptr')}
              >
                <MaterialIcons name="share" size={16} color="#ffffff" />
                <Text style={styles.followButtonText}>Twitter</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.followButton, styles.facebookButton]}
                onPress={() => Linking.openURL('https://facebook.com/aimusicpromptr')}
              >
                <MaterialIcons name="share" size={16} color="#ffffff" />
                <Text style={styles.followButtonText}>Facebook</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.followButton, styles.linkedinButton]}
                onPress={() => Linking.openURL('https://linkedin.com/company/aimusicpromptr')}
              >
                <MaterialIcons name="business" size={16} color="#ffffff" />
                <Text style={styles.followButtonText}>LinkedIn</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#888888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search articles..."
            placeholderTextColor="#888888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="clear" size={20} color="#888888" />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.activeCategoryButton
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.activeCategoryButtonText
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Posts */}
        {!searchQuery && selectedCategory === 'All' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✨ Featured Articles</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredContainer}
            >
              {featuredPosts.map((post) => (
                <TouchableOpacity
                  key={post.id}
                  style={styles.featuredCard}
                  onPress={() => setSelectedPost(post)}
                >
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredBadgeText}>Featured</Text>
                  </View>
                  <Text style={styles.featuredTitle}>{post.title}</Text>
                  <Text style={styles.featuredExcerpt}>{post.excerpt}</Text>
                  <View style={styles.featuredMeta}>
                    <Text style={styles.featuredCategory}>{post.category}</Text>
                    <Text style={styles.featuredReadTime}>{post.readTime} min</Text>
                  </View>
                  
                  {/* Quick Share Button */}
                  <TouchableOpacity 
                    style={styles.quickShareButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      sharePost('twitter', post);
                    }}
                  >
                    <MaterialIcons name="share" size={16} color="#4CAF50" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* All Posts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? `Search Results (${getFilteredPosts().length})` : 'Latest Articles'}
          </Text>
          
          {getFilteredPosts().length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="search-off" size={48} color="#666666" />
              <Text style={styles.emptyStateText}>No articles found</Text>
              <Text style={styles.emptyStateSubtext}>
                Try adjusting your search or category filter
              </Text>
            </View>
          ) : (
            <View style={styles.postsContainer}>
              {getFilteredPosts().map((post) => (
                <TouchableOpacity
                  key={post.id}
                  style={styles.postCard}
                  onPress={() => setSelectedPost(post)}
                >
                  <View style={styles.postCardHeader}>
                    <View style={styles.postCardMeta}>
                      <Text style={styles.postCardCategory}>{post.category}</Text>
                      <Text style={styles.postCardDate}>{formatDate(post.publishDate)}</Text>
                    </View>
                    <View style={styles.postCardActions}>
                      <View style={styles.postCardReadTime}>
                        <MaterialIcons name="schedule" size={14} color="#888888" />
                        <Text style={styles.postCardReadTimeText}>{post.readTime} min</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.postCardShareButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          sharePost('twitter', post);
                        }}
                      >
                        <MaterialIcons name="share" size={16} color="#888888" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <Text style={styles.postCardTitle}>{post.title}</Text>
                  <Text style={styles.postCardExcerpt}>{post.excerpt}</Text>
                  
                  <View style={styles.postCardTags}>
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <View key={index} style={styles.postCardTag}>
                        <Text style={styles.postCardTagText}>{tag}</Text>
                      </View>
                    ))}
                    {post.tags.length > 3 && (
                      <Text style={styles.postCardMoreTags}>+{post.tags.length - 3}</Text>
                    )}
                  </View>
                  
                  <View style={styles.postCardFooter}>
                    <Text style={styles.postCardAuthor}>By {post.author}</Text>
                    <MaterialIcons name="arrow-forward" size={16} color="#4CAF50" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Newsletter Signup with Social */}
        <View style={styles.newsletterSection}>
          <Text style={styles.newsletterTitle}>Stay Connected</Text>
          <Text style={styles.newsletterDescription}>
            Get the latest AI music tips and tutorials delivered to your inbox
          </Text>
          <TouchableOpacity style={styles.newsletterButton}>
            <MaterialIcons name="email" size={20} color="#ffffff" />
            <Text style={styles.newsletterButtonText}>Subscribe to Newsletter</Text>
          </TouchableOpacity>
          
          {/* Social Links in Newsletter */}
          <View style={styles.newsletterSocial}>
            <Text style={styles.newsletterSocialTitle}>Or follow us:</Text>
            <View style={styles.newsletterSocialButtons}>
              <TouchableOpacity 
                style={[styles.socialIconButton, styles.twitterButton]}
                onPress={() => Linking.openURL('https://twitter.com/aimusicpromptr')}
              >
                <MaterialIcons name="share" size={20} color="#ffffff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.socialIconButton, styles.facebookButton]}
                onPress={() => Linking.openURL('https://facebook.com/aimusicpromptr')}
              >
                <MaterialIcons name="share" size={20} color="#ffffff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.socialIconButton, styles.linkedinButton]}
                onPress={() => Linking.openURL('https://linkedin.com/company/aimusicpromptr')}
              >
                <MaterialIcons name="business" size={20} color="#ffffff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.socialIconButton, styles.redditButton]}
                onPress={() => Linking.openURL('https://reddit.com/r/aimusicpromptr')}
              >
                <MaterialIcons name="forum" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  // Social Follow Buttons
  followSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  followTitle: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 12,
  },
  followButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Social Sharing Buttons
  socialButtons: {
    marginVertical: 20,
    padding: 16,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444444',
  },
  socialTitle: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  socialButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
    minWidth: 80,
    justifyContent: 'center',
  },
  socialButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  twitterButton: {
    backgroundColor: '#1DA1F2',
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  linkedinButton: {
    backgroundColor: '#0077B5',
  },
  redditButton: {
    backgroundColor: '#FF4500',
  },
  copyButton: {
    backgroundColor: '#666666',
  },
  
  // Social Bottom Section
  socialBottomSection: {
    marginTop: 32,
    marginBottom: 24,
  },
  socialBottomTitle: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  
  // Quick Share Buttons
  quickShareButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  postCardShareButton: {
    padding: 4,
    borderRadius: 4,
  },
  
  // Social Icon Buttons
  socialIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Newsletter Social
  newsletterSocial: {
    marginTop: 20,
    alignItems: 'center',
  },
  newsletterSocialTitle: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 12,
  },
  newsletterSocialButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  
  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 20,
    borderWidth: 1,
    borderColor: '#444444',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
  
  // Categories
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#444444',
  },
  activeCategoryButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryButtonText: {
    color: '#cccccc',
    fontSize: 14,
    fontWeight: '500',
  },
  activeCategoryButtonText: {
    color: '#ffffff',
  },
  
  // Sections
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  
  // Featured Posts
  featuredContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  featuredCard: {
    width: 280,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
    position: 'relative',
  },
  featuredBadge: {
    position: 'absolute',
    top: -8,
    right: 12,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featuredBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    marginTop: 8,
  },
  featuredExcerpt: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
    marginBottom: 12,
  },
  featuredMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredCategory: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  featuredReadTime: {
    fontSize: 12,
    color: '#888888',
  },
  
  // Post Cards
  postsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  postCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#444444',
  },
  postCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  postCardCategory: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  postCardDate: {
    fontSize: 12,
    color: '#888888',
  },
  postCardReadTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postCardReadTimeText: {
    fontSize: 12,
    color: '#888888',
  },
  postCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    lineHeight: 24,
  },
  postCardExcerpt: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
    marginBottom: 12,
  },
  postCardTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  postCardTag: {
    backgroundColor: '#444444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  postCardTagText: {
    fontSize: 10,
    color: '#cccccc',
  },
  postCardMoreTags: {
    fontSize: 10,
    color: '#888888',
    alignSelf: 'center',
  },
  postCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postCardAuthor: {
    fontSize: 12,
    color: '#888888',
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
  
  // Newsletter
  newsletterSection: {
    backgroundColor: '#2a2a2a',
    margin: 20,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444444',
  },
  newsletterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  newsletterDescription: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  newsletterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  newsletterButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Post View Styles
  postContainer: {
    flex: 1,
  },
  postHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
  },
  postContent: {
    padding: 20,
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  postCategory: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  postDate: {
    fontSize: 14,
    color: '#888888',
  },
  postTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: 32,
    marginBottom: 16,
  },
  postInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  postAuthor: {
    fontSize: 14,
    color: '#cccccc',
  },
  postReadTime: {
    fontSize: 14,
    color: '#888888',
  },
  postTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    backgroundColor: '#444444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#cccccc',
    fontWeight: '500',
  },
  contentPreview: {
    marginBottom: 32,
  },
  contentText: {
    fontSize: 16,
    color: '#cccccc',
    lineHeight: 24,
  },
  ctaSection: {
    backgroundColor: '#2a2a2a',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444444',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

const renderSocialButtons = (post: BlogPost) => {
  return (
    <View style={styles.socialButtonsRow}>
      <TouchableOpacity 
        style={styles.socialButton}
        onPress={() => Linking.openURL(post.social.twitter)}
      >
        <MaterialIcons name="share" size={16} color="#ffffff" />
        <Text style={styles.socialButtonText}>Twitter</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.socialButton}
        onPress={() => Linking.openURL(post.social.facebook)}
      >
        <MaterialIcons name="share" size={16} color="#ffffff" />
        <Text style={styles.socialButtonText}>Facebook</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.socialButton}
        onPress={() => Linking.openURL(post.social.linkedin)}
      >
        <MaterialIcons name="business" size={16} color="#ffffff" />
        <Text style={styles.socialButtonText}>LinkedIn</Text>
      </TouchableOpacity>
    </View>
  );
};

const sharePost = (platform: string, post: BlogPost) => {
  const title = post.title;
  const url = post.url;
  const description = post.excerpt;
  const image = post.image;

  if (platform === 'twitter') {
    Linking.openURL(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}%20${encodeURIComponent(url)}%20${encodeURIComponent(description)}`);
  } else if (platform === 'facebook') {
    Linking.openURL(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
  }
};
