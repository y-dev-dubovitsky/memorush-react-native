import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { StyleSheet, Animated, Easing, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { invalidateLoggedInUser } from '../../../../redux/features/auth/auth-slice';
import { Icon } from 'react-native-elements';

const { width, height } = Dimensions.get('window');

const FABGroupComponent = ({ navigation, cardViewToggleHandler }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  
  // Анимационные значения
  const fabRotateAnim = useRef(new Animated.Value(0)).current;
  const fabScaleAnim = useRef(new Animated.Value(1)).current;
  const overlayOpacityAnim = useRef(new Animated.Value(0)).current;
  const action1Anim = useRef(new Animated.Value(0)).current;
  const action2Anim = useRef(new Animated.Value(0)).current;
  const action3Anim = useRef(new Animated.Value(0)).current;

  const invalidateUserHandler = () => {
    dispatch(invalidateLoggedInUser());
    navigation.navigate("OfflineSignInScreen");
  }

  const toggleFAB = () => {
    if (isOpen) {
      closeFAB();
    } else {
      openFAB();
    }
  };

  const openFAB = () => {
    setIsOpen(true);
    Animated.parallel([
      Animated.timing(fabRotateAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacityAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(action1Anim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(action2Anim, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(action3Anim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeFAB = () => {
    Animated.parallel([
      Animated.timing(fabRotateAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacityAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(action1Anim, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(action2Anim, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(action3Anim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsOpen(false);
    });
  };

  const handleActionPress = (action) => {
    if (typeof action !== 'function') {
      console.error('Action is not a function:', action);
      closeFAB();
      return;
    }

    // Анимация нажатия на действие
    Animated.sequence([
      Animated.timing(fabScaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fabScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      action();
      closeFAB();
    });
  };

  const handleOverlayPress = () => {
    closeFAB();
  };

  // Определяем действия как функции
  const actions = {
    createSet: () => {
      navigation.navigate("CardSetEditScreen");
    },
    toggleView: () => {
      if (typeof cardViewToggleHandler === 'function') {
        cardViewToggleHandler();
      }
    },
    logout: () => {
      dispatch(invalidateLoggedInUser());
      navigation.navigate("OfflineSignInScreen");
    }
  };

  // Интерполяции для анимаций
  const rotate = fabRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '135deg'],
  });

  const action1Translate = action1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -120],
  });

  const action2Translate = action2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80],
  });

  const action3Translate = action3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40],
  });

  const actionOpacity = action1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      {/* Overlay - теперь всегда рендерится, но управляется opacity */}
      <Animated.View 
        style={[
          styles.overlay,
          { 
            opacity: overlayOpacityAnim,
            display: isOpen ? 'flex' : 'none'
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.overlayTouchable}
          onPress={handleOverlayPress}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Action Buttons */}
      {isOpen && (
        <>
          {/* Create Set - первый */}
          <Animated.View 
            style={[
              styles.actionButton,
              styles.action1,
              {
                opacity: actionOpacity,
                transform: [{ translateY: action1Translate }]
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.actionTouchable}
              onPress={() => handleActionPress(actions.createSet)}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#F59E0B' }]}>
                <Icon name="plus" type="font-awesome" color="#FFFFFF" size={16} />
              </View>
              <View style={styles.actionLabelContainer}>
                <Text style={styles.actionLabel}>Create Set</Text>
                <Text style={styles.actionSubLabel}>New flashcard set</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Toggle View - второй */}
          <Animated.View 
            style={[
              styles.actionButton,
              styles.action2,
              {
                opacity: actionOpacity,
                transform: [{ translateY: action2Translate }]
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.actionTouchable}
              onPress={() => handleActionPress(actions.toggleView)}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#8B5CF6' }]}>
                <Icon name="view-agenda" type="material" color="#FFFFFF" size={16} />
              </View>
              <View style={styles.actionLabelContainer}>
                <Text style={styles.actionLabel}>Toggle View</Text>
                <Text style={styles.actionSubLabel}>Change layout</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Log Out - последний */}
          <Animated.View 
            style={[
              styles.actionButton,
              styles.action3,
              {
                opacity: actionOpacity,
                transform: [{ translateY: action3Translate }]
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.actionTouchable}
              onPress={() => handleActionPress(actions.logout)}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#EF4444' }]}>
                <Icon name="sign-out" type="font-awesome" color="#FFFFFF" size={16} />
              </View>
              <View style={styles.actionLabelContainer}>
                <Text style={styles.actionLabel}>Log Out</Text>
                <Text style={styles.actionSubLabel}>Sign out of account</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}

      {/* Main FAB Button */}
      <Animated.View 
        style={[
          styles.fabContainer,
          {
            transform: [
              { scale: fabScaleAnim },
              { rotate: rotate }
            ]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.fab}
          onPress={toggleFAB}
          activeOpacity={0.8}
        >
          <Icon 
            name={isOpen ? "close" : "plus"}
            type="font-awesome" 
            color="#FFFFFF" 
            size={24} 
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    top: -height,
    left: -width,
    right: -width,
    bottom: -height,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  overlayTouchable: {
    flex: 1,
  },
  fabContainer: {
    shadowColor: '#18BBF1',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#18BBF1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButton: {
    position: 'absolute',
    right: 0,
    bottom: 80,
  },
  action1: {
    bottom: 140,
  },
  action2: {
    bottom: 90,
  },
  action3: {
    bottom: 30,
  },
  actionTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    minWidth: 180,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionLabelContainer: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  actionSubLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
});

export default FABGroupComponent;