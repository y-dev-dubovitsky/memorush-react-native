import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, TouchableOpacity, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {
  authSelector,
  guestLogin,
} from '../../redux/features/auth/auth-slice';

const { width, height } = Dimensions.get('window');

// Компонент для анимированной частицы
const AnimatedParticle = ({ index }) => {
  const translateXAnim = useRef(new Animated.Value(Math.random() * width)).current;
  const translateYAnim = useRef(new Animated.Value(Math.random() * height * 0.4)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Задержка появления для каждой частицы
    const delay = index * 200 + Math.random() * 500;

    // Анимация появления
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ]).start(() => {
      // После появления запускаем движение
      startMovement();
    });
  }, []);

  const startMovement = () => {
    // Случайное движение по X и Y
    const moveX = Animated.timing(translateXAnim, {
      toValue: Math.random() * width,
      duration: 3000 + Math.random() * 4000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    });

    const moveY = Animated.timing(translateYAnim, {
      toValue: Math.random() * height * 0.4,
      duration: 2500 + Math.random() * 3500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    });

    // Пульсация размера
    const pulse = Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 1000 + Math.random() * 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 1000 + Math.random() * 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    // Бесконечная анимация движения и пульсации
    Animated.loop(
      Animated.parallel([moveX, moveY, pulse])
    ).start();
  };

  // Случайный цвет частицы
  const particleColors = ['#18BBF1', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];
  const randomColor = particleColors[Math.floor(Math.random() * particleColors.length)];

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          backgroundColor: randomColor,
          transform: [
            { translateX: translateXAnim },
            { translateY: translateYAnim },
            { scale: scaleAnim }
          ],
          opacity: opacityAnim,
        }
      ]}
    />
  );
};

const OfflineSignInScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { status } = useSelector(authSelector);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);

  // Анимационные значения
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;

  const holdInterval = useRef(null);

  useEffect(() => {
    // Запускаем анимацию появления
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      })
    ]).start();

    // Запускаем пульсацию кнопки
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Запускаем анимацию риплов
    startRippleAnimation();
  }, []);

  useEffect(() => {
    if (status === 'login') {
      navigation.navigate('MainTabNavigation');
    }
  }, [status, navigation]);

  const startRippleAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rippleAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rippleAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handlePressIn = () => {
    console.log('Press IN - Starting hold');
    setIsHolding(true);
    setShowWelcome(true);
    
    // Сбрасываем прогресс
    progressAnim.setValue(0);
    setHoldProgress(0);

    // Запускаем интервал для отслеживания прогресса
    let progress = 0;
    holdInterval.current = setInterval(() => {
      progress += 2; // 100% за 5 секунд (50 интервалов по 100мс)
      console.log('Hold progress:', progress);
      
      setHoldProgress(progress);
      progressAnim.setValue(progress / 100);

      if (progress >= 100) {
        console.log('Hold COMPLETED - Logging in');
        clearInterval(holdInterval.current);
        Vibration.vibrate(100);
        dispatch(guestLogin());
      }
    }, 100);
  };

  const handlePressOut = () => {
    console.log('Press OUT - Canceling hold');
    setIsHolding(false);
    setShowWelcome(false);
    
    if (holdInterval.current) {
      clearInterval(holdInterval.current);
      holdInterval.current = null;
    }
    
    // Сбрасываем анимацию прогресса
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
    
    setHoldProgress(0);
  };

  // Простая функция для входа (альтернатива удержанию)
  const handleQuickLogin = () => {
    console.log('Quick login pressed');
    dispatch(guestLogin());
  };

  const rippleScale = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  const rippleOpacity = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Анимированное приветствие */}
        <Animated.View 
          style={[
            styles.welcomeContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <Text style={styles.welcomeTitle}>Welcome to</Text>
          <Text style={styles.appName}>FlashMind</Text>
          <Text style={styles.welcomeSubtitle}>
            Master your knowledge with smart flashcards
          </Text>
        </Animated.View>

        {/* Анимированные движущиеся частицы */}
        <View style={styles.particlesContainer}>
          {[...Array(15)].map((_, index) => (
            <AnimatedParticle key={index} index={index} />
          ))}
        </View>

        {/* Кнопка входа с анимацией */}
        <View style={styles.buttonContainer}>
          
          {/* Внешние риппл-эффекты */}
          <Animated.View 
            style={[
              styles.ripple,
              {
                transform: [{ scale: rippleScale }],
                opacity: rippleOpacity,
              }
            ]}
          />
          <Animated.View 
            style={[
              styles.ripple,
              {
                transform: [{ scale: rippleScale.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.8]
                }) }],
                opacity: rippleOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.2, 0]
                }),
              }
            ]}
          />

          {/* Основная кнопка - используем TouchableOpacity для лучшей совместимости */}
          <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onLongPress={handleQuickLogin} // Альтернатива для эмулятора
            delayLongPress={500}
            activeOpacity={0.7}
            style={styles.touchableButton}
          >
            <Animated.View 
              style={[
                styles.button,
                {
                  transform: [
                    { scale: isHolding ? 1.1 : pulseAnim }
                  ],
                  backgroundColor: isHolding ? '#F59E0B' : '#18BBF1'
                }
              ]}
            >
              
              {/* Прогресс заполнения */}
              <Animated.View 
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })
                  }
                ]}
              />

              {/* Содержимое кнопки */}
              <View style={styles.buttonContent}>
                {isHolding ? (
                  <>
                    <Text style={styles.buttonTextHold}>
                      {Math.round(holdProgress)}%
                    </Text>
                    <Text style={styles.buttonSubtext}>
                      Keep holding...
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.buttonText}>Hold to Enter</Text>
                    <Text style={styles.buttonSubtext}>
                      Press & hold for 5 seconds
                    </Text>
                  </>
                )}
              </View>

            </Animated.View>
          </TouchableOpacity>

          {/* Индикатор прогресса */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View 
                style={[
                  styles.progressBar,
                  {
                    width: `${holdProgress}%`
                  }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {isHolding ? 
                `${(5 - (holdProgress / 20)).toFixed(1)}s remaining` : 
                '5 seconds required'
              }
            </Text>
          </View>

          {/* Кнопка быстрого входа для отладки */}
          <TouchableOpacity 
            style={styles.quickLoginButton}
            onPress={handleQuickLogin}
          >
            <Text style={styles.quickLoginText}>Quick Login (Debug)</Text>
          </TouchableOpacity>

        </View>

        {/* Приветственное сообщение при удержании */}
        {showWelcome && (
          <Animated.View 
            style={[
              styles.welcomeMessage,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    })
                  }
                ]
              }
            ]}
          >
            <Text style={styles.welcomeMessageText}>
              🎉 Welcome! Getting things ready...
            </Text>
          </Animated.View>
        )}

        {/* Декоративные элементы */}
        <View style={styles.decorativeCircles}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
          <View style={[styles.circle, styles.circle3]} />
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#475569',
    letterSpacing: 2,
    marginBottom: 8,
  },
  appName: {
    fontSize: 48,
    fontWeight: '800',
    color: '#18BBF1',
    letterSpacing: 1,
    marginBottom: 16,
    textShadowColor: 'rgba(24, 187, 241, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  touchableButton: {
    // Убедимся, что TouchableOpacity правильно оборачивает кнопку
  },
  ripple: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#18BBF1',
    borderWidth: 2,
    borderColor: 'rgba(24, 187, 241, 0.3)',
  },
  button: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#18BBF1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#18BBF1',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    left: 0,
    top: 0,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  buttonTextHold: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  buttonSubtext: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    maxWidth: 80,
  },
  progressContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  progressBackground: {
    width: 200,
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  quickLoginButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickLoginText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  welcomeMessage: {
    position: 'absolute',
    bottom: 160,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  welcomeMessageText: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
  decorativeCircles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  circle: {
    position: 'absolute',
    borderRadius: 500,
    borderWidth: 1,
    borderColor: 'rgba(24, 187, 241, 0.1)',
  },
  circle1: {
    width: 200,
    height: 200,
    top: '10%',
    right: '10%',
  },
  circle2: {
    width: 300,
    height: 300,
    bottom: '20%',
    left: '5%',
  },
  circle3: {
    width: 150,
    height: 150,
    bottom: '40%',
    right: '20%',
  },
});

export default OfflineSignInScreen;