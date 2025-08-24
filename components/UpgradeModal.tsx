import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, AccessibilityInfo } from 'react-native';

export default function UpgradeModal({ visible, onClose, onUpgrade }: UpgradeModalProps) {
  const modalRef = useRef<View>(null);

  // Announce modal opening to screen readers
  useEffect(() => {
    if (visible) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        AccessibilityInfo.announceForAccessibility(
          'Upgrade to premium modal opened. Swipe to explore premium features and pricing.'
        );
      }, 100);
    }
  }, [visible]);

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="fade"
      accessibilityViewIsModal={true}
      onRequestClose={onClose}
    >
      <View 
        style={styles.overlay}
        accessible={true}
        accessibilityLabel="Modal overlay"
        accessibilityRole="button"
        onTouchEnd={onClose}
      >
        <View 
          ref={modalRef}
          style={styles.modal}
          accessible={false} // Let children handle accessibility
          onTouchEnd={(e) => e.stopPropagation()} // Prevent closing when touching modal content
        >
          {/* Header with close button */}
          <View style={styles.header}>
            <Text 
              style={styles.title}
              accessibilityRole="header"
              accessibilityLevel={1}
            >
              🚀 Upgrade to Premium
            </Text>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
              accessible={true}
              accessibilityLabel="Close upgrade modal"
              accessibilityHint="Returns to the main screen"
              accessibilityRole="button"
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.content}
            accessible={false}
            showsVerticalScrollIndicator={false}
          >
            {/* Subtitle */}
            <Text 
              style={styles.subtitle}
              accessibilityRole="text"
            >
              Unlock unlimited music prompt generations and premium features
            </Text>

            {/* Features list with proper list semantics */}
            <View 
              style={styles.featuresContainer}
              accessible={true}
              accessibilityLabel="Premium features list"
              accessibilityRole="list"
            >
              <Text 
                style={styles.featuresTitle}
                accessibilityRole="header"
                accessibilityLevel={2}
              >
                What you get:
              </Text>

              <View 
                style={styles.feature}
                accessible={true}
                accessibilityRole="listitem"
                accessibilityLabel="Unlimited prompt generations - no daily limits"
              >
                <Text style={styles.checkmark} accessible={false}>✓</Text>
                <Text style={styles.featureText} accessible={false}>
                  Unlimited prompt generations
                </Text>
              </View>

              <View 
                style={styles.feature}
                accessible={true}
                accessibilityRole="listitem"
                accessibilityLabel="Priority customer support - faster response times"
              >
                <Text style={styles.checkmark} accessible={false}>✓</Text>
                <Text style={styles.featureText} accessible={false}>
                  Priority customer support
                </Text>
              </View>

              <View 
                style={styles.feature}
                accessible={true}
                accessibilityRole="listitem"
                accessibilityLabel="Advanced prompt templates - professional quality prompts"
              >
                <Text style={styles.checkmark} accessible={false}>✓</Text>
                <Text style={styles.featureText} accessible={false}>
                  Advanced prompt templates
                </Text>
              </View>

              <View 
                style={styles.feature}
                accessible={true}
                accessibilityRole="listitem"
                accessibilityLabel="Export and save prompts - download your creations"
              >
                <Text style={styles.checkmark} accessible={false}>✓</Text>
                <Text style={styles.featureText} accessible={false}>
                  Export & save prompts
                </Text>
              </View>

              <View 
                style={styles.feature}
                accessible={true}
                accessibilityRole="listitem"
                accessibilityLabel="Early access to new features - be the first to try updates"
              >
                <Text style={styles.checkmark} accessible={false}>✓</Text>
                <Text style={styles.featureText} accessible={false}>
                  Early access to new features
                </Text>
              </View>
            </View>

            {/* Pricing section */}
            <View 
              style={styles.pricingContainer}
              accessible={true}
              accessibilityLabel="Pricing information"
              accessibilityRole="region"
            >
              <Text 
                style={styles.price}
                accessibilityRole="text"
                accessibilityLabel="Price: $5.99 per month"
              >
                $5.99<Text style={styles.pricePeriod}>/month</Text>
              </Text>
              <Text 
                style={styles.priceNote}
                accessibilityRole="text"
              >
                Cancel anytime • 7-day free trial
              </Text>
            </View>

            {/* Action buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.upgradeButton}
                onPress={onUpgrade}
                accessible={true}
                accessibilityLabel="Start 7-day free trial"
                accessibilityHint="Begin premium subscription with 7-day free trial. You can cancel anytime."
                accessibilityRole="button"
              >
                <Text style={styles.upgradeButtonText}>
                  Start Free Trial
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={onClose}
                accessible={true}
                accessibilityLabel="Maybe later"
                accessibilityHint="Close this modal and continue with free plan"
                accessibilityRole="button"
              >
                <Text style={styles.cancelButtonText}>
                  Maybe Later
                </Text>
              </TouchableOpacity>
            </View>

            {/* Terms and privacy */}
            <Text 
              style={styles.termsText}
              accessibilityRole="text"
            >
              By subscribing, you agree to our Terms of Service and Privacy Policy. 
              Subscription automatically renews unless cancelled.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: 'black',
  },
  content: {
    flex: 1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginBottom: 16,
    textAlign: 'center',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 8,
  },
  pricePeriod: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginBottom: 24,
  },
  priceNote: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginBottom: 24,
  },
  featuresContainer: {
    marginTop: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginBottom: 16,
    textAlign: 'center',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkmark: {
    fontSize: 18,
    color: 'black',
    marginRight: 12,
    width: 20,
  },
  featureText: {
    fontSize: 16,
    color: 'black',
    flex: 1,
  },
  pricingContainer: {
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  upgradeButton: {
    backgroundColor: 'blue',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  upgradeButtonText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 16,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  termsText: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    marginBottom: 24,
  },
});
