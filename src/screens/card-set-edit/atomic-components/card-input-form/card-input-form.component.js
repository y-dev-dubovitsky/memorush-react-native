import React, { useRef } from "react";
import { View, Text, StyleSheet, Animated, PanResponder, Alert } from "react-native";
import { TextInput } from 'react-native-paper';

const CardInputForm = ({ id, item, cardSetEntity, setCardSetEntity }) => {
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const showDelete = useRef(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 10;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx < -20) {
        swipeAnim.setValue(gestureState.dx);
        showDelete.current = true;
      } else if (gestureState.dx > 20) {
        swipeAnim.setValue(0);
        showDelete.current = false;
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -100) {
        Animated.timing(swipeAnim, {
          toValue: -80,
          duration: 200,
          useNativeDriver: true,
        }).start();
        showDeleteConfirmation();
      } else {
        resetPosition();
      }
    },
  });

  const showDeleteConfirmation = () => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: resetPosition,
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: deleteCard,
        },
      ]
    );
  };

  const deleteCard = () => {
    const updatedFlashCardArray = { ...cardSetEntity.flashCardArray };
    delete updatedFlashCardArray[id];
    
    const renumberedArray = {};
    Object.values(updatedFlashCardArray).forEach((card, index) => {
      renumberedArray[index] = card;
    });

    setCardSetEntity({
      ...cardSetEntity,
      flashCardArray: renumberedArray,
    });
  };

  const resetPosition = () => {
    Animated.timing(swipeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    showDelete.current = false;
  };

  const updateCardField = (field, value) => {
    setCardSetEntity({
      ...cardSetEntity,
      flashCardArray: {
        ...cardSetEntity.flashCardArray,
        [id]: {
          ...cardSetEntity.flashCardArray[id],
          [field]: value
        }
      }
    });
  };

  const handleInputFocus = () => {
    resetPosition();
  };

  return (
    <View style={styles.cardContainer}>
      {/* Иконка корзины всегда видна при свайпе */}
      <Animated.View 
        style={[
          styles.deleteIconContainer,
          {
            opacity: swipeAnim.interpolate({
              inputRange: [-80, 0],
              outputRange: [1, 0],
              extrapolate: 'clamp',
            }),
            transform: [{
              scale: swipeAnim.interpolate({
                inputRange: [-80, -40, 0],
                outputRange: [1, 0.8, 0],
                extrapolate: 'clamp',
              })
            }]
          }
        ]}
      >
        <Text style={styles.deleteIcon}>🗑️</Text>
        <Text style={styles.deleteText}>Delete</Text>
      </Animated.View>
      
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateX: swipeAnim }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardNumberContainer}>
            <Text style={styles.cardNumber}>Card #{Number(id) + 1}</Text>
            <View style={styles.swipeHint}>
              <Text style={styles.swipeHintText}>← Swipe to delete</Text>
            </View>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Question</Text>
              <Text style={styles.characterCount}>
                {item.frontSide?.length || 0}/200
              </Text>
            </View>
            <TextInput
              mode="outlined"
              style={styles.input}
              value={item.frontSide || ''}
              onChangeText={text => updateCardField('frontSide', text)}
              onFocus={handleInputFocus}
              outlineColor="#E2E8F0"
              activeOutlineColor="#6366F1"
              multiline={true}
              numberOfLines={3}
              maxLength={200}
              theme={{ 
                colors: { 
                  primary: '#6366F1', 
                  background: '#FFFFFF',
                  surface: '#FFFFFF',
                  onSurfaceVariant: '#6B7280',
                },
                roundness: 12
              }}
              placeholder="Enter your question..."
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.separator} />
          
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Answer</Text>
              <Text style={styles.characterCount}>
                {item.backSide?.length || 0}/200
              </Text>
            </View>
            <TextInput
              mode="outlined"
              style={styles.input}
              value={item.backSide || ''}
              onChangeText={text => updateCardField('backSide', text)}
              onFocus={handleInputFocus}
              outlineColor="#E2E8F0"
              activeOutlineColor="#6366F1"
              multiline={true}
              numberOfLines={3}
              maxLength={200}
              theme={{ 
                colors: { 
                  primary: '#6366F1', 
                  background: '#FFFFFF',
                  surface: '#FFFFFF',
                  onSurfaceVariant: '#6B7280',
                },
                roundness: 12
              }}
              placeholder="Enter the answer..."
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.separator} />
          
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Hint (Optional)</Text>
              <Text style={styles.characterCount}>
                {item.hint?.length || 0}/100
              </Text>
            </View>
            <TextInput
              mode="outlined"
              style={styles.input}
              value={item.hint || ''}
              onChangeText={text => updateCardField('hint', text)}
              onFocus={handleInputFocus}
              outlineColor="#E2E8F0"
              activeOutlineColor="#10B981"
              multiline={true}
              numberOfLines={2}
              maxLength={100}
              theme={{ 
                colors: { 
                  primary: '#10B981', 
                  background: '#FFFFFF',
                  surface: '#FFFFFF',
                  onSurfaceVariant: '#6B7280',
                },
                roundness: 12
              }}
              placeholder="Add a helpful hint..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.footerText}>
            💡 Question and Answer are required, Hint is optional
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    overflow: 'hidden',
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: -0.5,
  },
  swipeHint: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  swipeHintText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 4,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    letterSpacing: -0.3,
  },
  characterCount: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },
  cardFooter: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  deleteIconContainer: {
    position: 'absolute',
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    backgroundColor: '#EF4444',
    borderRadius: 16,
    zIndex: -1,
  },
  deleteIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  deleteText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});

export default CardInputForm;