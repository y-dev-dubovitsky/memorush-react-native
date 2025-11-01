import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ButtonComponent from '../../atomic-components/button/button.component';

const TipComponent = ({ setIsStarted, navigateToCardListHandler }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.emoji}>🎯</Text>
        <Text style={styles.title}>Ready to Learn?</Text>
        <Text style={styles.subtitle}>
          Here's how to get the most out of your flashcards
        </Text>
      </View>

      {/* Steps */}
      <View style={styles.stepsContainer}>
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Study the Question</Text>
            <Text style={styles.stepDescription}>
              Look at the front of the card and try to recall the answer
            </Text>
          </View>
        </View>

        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Reveal the Answer</Text>
            <Text style={styles.stepDescription}>
              Tap the card or click "See Answer" to check if you were right
            </Text>
          </View>
        </View>

        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Rate Your Knowledge</Text>
            <Text style={styles.stepDescription}>
              Mark if you <Text style={styles.highlight}>"Know it"</Text> or{' '}
              <Text style={styles.highlight}>"Need practice"</Text>
            </Text>
          </View>
        </View>

        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Track Progress</Text>
            <Text style={styles.stepDescription}>
              Complete all cards to see your achievement and stats
            </Text>
          </View>
        </View>

        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>5</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Review & Repeat</Text>
            <Text style={styles.stepDescription}>
              Practice again or explore other card sets
            </Text>
          </View>
        </View>
      </View>

      {/* Tip Box */}
      <View style={styles.tipBox}>
        <Text style={styles.tipEmoji}>💡</Text>
        <Text style={styles.tipText}>
          <Text style={styles.tipHighlight}>Pro tip:</Text> Be honest with your
          self-assessment for better learning results!
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <ButtonComponent
          name='Start Learning 🚀'
          style={styles.primaryButton}
          onClickHandler={() => setIsStarted(true)}
        />
        <ButtonComponent
          name='Not Now'
          style={styles.secondaryButton}
          onClickHandler={navigateToCardListHandler}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    margin: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  stepsContainer: {
    flex: 1,
    marginBottom: 24,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#18BBF1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 4,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  highlight: {
    color: '#18BBF1',
    fontWeight: '600',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EBF8FF',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3182CE',
    marginBottom: 24,
  },
  tipEmoji: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#2C5282',
    lineHeight: 20,
  },
  tipHighlight: {
    fontWeight: '600',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryButton: {
    backgroundColor: '#18BBF1',
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#18BBF1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryButton: {
    backgroundColor: '#FF7B42',
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#FF7B42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default TipComponent;
