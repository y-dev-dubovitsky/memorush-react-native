import React from "react";
import { StyleSheet, View, Text, Linking, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import ImgBackgroundComponent from "../../common/components/img-background/img-background.component";
import { Ionicons } from '@expo/vector-icons';

const WEBSITE_URL = "https://memorush.ru";

const InfoScreen = () => {
  const handlePressLink = () => {
    Linking.openURL(WEBSITE_URL).catch(err =>
      console.warn("Не удалось открыть URL:", err)
    );
  };

  const features = [
    {
      icon: "⚡",
      title: "Learn Faster",
      description: "Optimized learning algorithms help you retain information more efficiently"
    },
    {
      icon: "🎯",
      title: "Smart Focus",
      description: "Concentrate on difficult cards while maintaining what you already know"
    },
    {
      icon: "📊",
      title: "Track Progress",
      description: "Monitor your learning journey with detailed statistics and insights"
    },
    {
      icon: "🌟",
      title: "Adaptive Learning",
      description: "The app adjusts to your pace and learning style for optimal results"
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImgBackgroundComponent>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Main Card */}
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logo}>
                <Text style={styles.logoIcon}>🧠</Text>
              </View>
              <Text style={styles.title}>Welcome to Memorush</Text>
              <Text style={styles.subtitle}>
                Revolutionizing the way you learn and memorize
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Main Description */}
            <View style={styles.descriptionSection}>
              <Text style={styles.paragraph}>
                Memorush are <Text style={styles.highlight}>effective tools</Text> for both learning and studying when they're used correctly. Whether it's memorizing for a test or learning a new language, our app helps you learn better, not longer.
              </Text>
              
              <Text style={styles.paragraph}>
                Whether you're a student or a life-long learner, flashcards are a <Text style={styles.highlight}>terrific way</Text> to remember information and keep the mind sharp while making the learning process engaging and efficient.
              </Text>
            </View>

            {/* Features Grid */}
            <View style={styles.featuresSection}>
              <Text style={styles.featuresTitle}>Why Choose Memorush?</Text>
              <View style={styles.featuresGrid}>
                {features.map((feature, index) => (
                  <View key={index} style={styles.featureCard}>
                    <Text style={styles.featureIcon}>{feature.icon}</Text>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* CTA Section */}
            <View style={styles.ctaSection}>
              <View style={styles.ctaCard}>
                <Text style={styles.ctaTitle}>Ready to Learn More?</Text>
                <Text style={styles.ctaText}>
                  Visit our website for detailed guides, tips, and additional resources to maximize your learning potential.
                </Text>
                
                <TouchableOpacity 
                  style={styles.linkButton}
                  onPress={handlePressLink}
                  activeOpacity={0.7}
                >
                  <Ionicons name="globe-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.linkButtonText}>Visit Memorush.ru</Text>
                  <Ionicons name="open-outline" size={16} color="#FFFFFF" />
                </TouchableOpacity>
                
                <Text style={styles.websiteText}>www.memorush.ru</Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Made with ❤️ for learners worldwide
              </Text>
            </View>
          </View>
        </ScrollView>
      </ImgBackgroundComponent>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: "#18BBF1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logoIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
    backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  divider: {
    height: 2,
    backgroundColor: '#F1F5F9',
    marginBottom: 28,
    borderRadius: 1,
  },
  descriptionSection: {
    marginBottom: 32,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'left',
    color: '#475569',
  },
  highlight: {
    fontWeight: '600',
    color: '#18BBF1',
  },
  featuresSection: {
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#18BBF1',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  ctaSection: {
    marginBottom: 24,
  },
  ctaCard: {
    backgroundColor: '#18BBF1',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: "#18BBF1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 14,
    color: '#E0E7FF',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 12,
    gap: 8,
  },
  linkButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  websiteText: {
    fontSize: 14,
    color: '#E0E7FF',
    fontStyle: 'italic',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});

export default InfoScreen;