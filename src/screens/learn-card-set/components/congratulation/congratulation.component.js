import React from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import ButtonComponent from '../../atomic-components/button/button.component';

const DEFAULT_IMAGE_PATH = './images/10519-confetti-customized.gif';

const CongratulationComponent = ({
  setInitialStateHandler,
  navigateToCardListHandler,
}) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require(DEFAULT_IMAGE_PATH)}
        resizeMode='cover'
        style={styles.background}
      >
        {/* Overlay */}
        <View style={styles.overlay} />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.celebrationEmoji}>🎉</Text>
          <Text style={styles.title}>Amazing Work!</Text>
          <Text style={styles.subtitle}>
            You've mastered all cards in this set!
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <ButtonComponent
            style={[styles.button, styles.secondaryButton]}
            name='Back to Sets'
            onClickHandler={navigateToCardListHandler}
          />
          <ButtonComponent
            style={[styles.button, styles.primaryButton]}
            name='Practice Again'
            onClickHandler={setInitialStateHandler}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  background: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  celebrationEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#18BBF1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingTop: 0,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    marginHorizontal: 6, // Добавляем отступ по бокам
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButton: {
    backgroundColor: '#10B981',
  },
  secondaryButton: {
    backgroundColor: '#18BBF1',
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#18BBF1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default CongratulationComponent;
