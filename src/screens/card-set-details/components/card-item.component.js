import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated, Easing } from 'react-native';
import { Icon } from 'react-native-elements';
import SpeakerIconComponent from '../../../common/components/speaker-icon/speaker-icon.component';

const CardItemComponent = ({ item, navigation, index }) => {
  const [isFrontSide, setIsFrontSide] = React.useState(true);
  const flipAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // Безопасное получение ID карточки
  const getCardId = () => {
    if (!item) return '0000';
    if (item.id) {
      return typeof item.id === 'string' ? item.id.slice(0, 4) : '0000';
    }
    return '0000';
  };

  // Безопасное получение текста для сторон карточки
  const getFrontText = () => {
    return item?.frontSide || 'No question available';
  };

  const getBackText = () => {
    return item?.backSide || 'No answer available';
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 89, 90],
    outputRange: [1, 0.5, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 89, 90],
    outputRange: [0, 0.5, 1],
  });

  const changeCardSideHandler = () => {
    // Анимация нажатия
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 80,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 80,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Анимация переворота
    Animated.timing(flipAnim, {
      toValue: isFrontSide ? 180 : 0,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setIsFrontSide(!isFrontSide);
    });
  };

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
    opacity: frontOpacity,
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
    opacity: backOpacity,
  };

  // Если item не определен, показываем пустую карточку
  if (!item) {
    return (
      <View style={[styles.container, styles.emptyCard]}>
        <View style={styles.cardSide}>
          <View style={styles.cardContent}>
            <Icon name="error-outline" type="material" size={32} color="#9CA3AF" />
            <Text style={styles.emptyText}>Card not available</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.cardTouchable}
        onPress={changeCardSideHandler}
        activeOpacity={0.9}
      >
        {/* Front Side */}
        <Animated.View style={[styles.cardSide, styles.cardFront, frontAnimatedStyle]}>
          <View style={styles.cardHeader}>
            <View style={styles.sideIndicator}>
              <Icon name="help-outline" type="material" size={14} color="#6B7280" />
              <Text style={styles.sideText}>QUESTION</Text>
            </View>
            <View style={styles.cardNumber}>
              <Text style={styles.cardNumberText}>#{getCardId()}</Text>
            </View>
          </View>
          
          <View style={styles.cardContent}>
            <Text style={styles.cardText} numberOfLines={4}>
              {getFrontText()}
            </Text>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.hintContainer}>
              <Icon name="touch-app" type="material" size={16} color="#9CA3AF" />
              <Text style={styles.hintText}>Tap to flip</Text>
            </View>
            <SpeakerIconComponent text={getFrontText()} size={20} />
          </View>
        </Animated.View>

        {/* Back Side */}
        <Animated.View style={[styles.cardSide, styles.cardBack, backAnimatedStyle]}>
          <View style={styles.cardHeader}>
            <View style={styles.sideIndicator}>
              <Icon name="lightbulb-outline" type="material" size={14} color="#6B7280" />
              <Text style={styles.sideText}>ANSWER</Text>
            </View>
            <View style={styles.cardNumber}>
              <Text style={styles.cardNumberText}>#{getCardId()}</Text>
            </View>
          </View>
          
          <View style={styles.cardContent}>
            <Text style={styles.cardText} numberOfLines={6}>
              {getBackText()}
            </Text>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.hintContainer}>
              <Icon name="touch-app" type="material" size={16} color="#9CA3AF" />
              <Text style={styles.hintText}>Tap to flip back</Text>
            </View>
            <SpeakerIconComponent text={getBackText()} size={20} />
          </View>
        </Animated.View>

        {/* Flip Indicator */}
        <View style={styles.flipIndicator}>
          <Icon 
            name="autorenew" 
            type="material" 
            size={16} 
            color="#18BBF1" 
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    minWidth: 88,
  },
  emptyCard: {
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTouchable: {
    flex: 1,
    minHeight: 220,
  },
  cardSide: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backfaceVisibility: 'hidden',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardFront: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F3F4F6',
  },
  cardBack: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E0F2FE',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sideIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  sideText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  cardNumber: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardNumberText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  cardText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hintText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  flipIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#18BBF1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#F8FAFC',
  },
});

export default CardItemComponent;