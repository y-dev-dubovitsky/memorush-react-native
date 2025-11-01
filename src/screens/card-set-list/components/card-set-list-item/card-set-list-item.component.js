import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated, Easing } from 'react-native';
import { Icon } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import { setFavoriteCardSet } from '../../../../redux/features/card-set/card-set.slice';

const CardSetListItem = ({ item, navigation, index }) => {
  const {
    id,
    name,
    categoryName,
    flashCardArray,
    description,
    isFavorite,
    createdAt
  } = item;

  const dispatch = useDispatch();
  
  // Анимационные значения
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const favoriteScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Анимация появления с задержкой для каждого элемента
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleFavoritePress = () => {
    // Анимация нажатия на избранное
    Animated.sequence([
      Animated.timing(favoriteScale, {
        toValue: 1.3,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(favoriteScale, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    ]).start();

    dispatch(setFavoriteCardSet(id));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Mathematics': '#FF6B6B',
      'Science': '#4ECDC4',
      'History': '#45B7D1',
      'Language': '#96CEB4',
      'Technology': '#FFEAA7',
      'Art': '#DDA0DD',
      'Music': '#98D8C8',
      'Default': '#18BBF1'
    };
    return colors[category] || colors.Default;
  };

  // Расчет времени изучения
  const calculateStudyTime = (cardCount) => {
    if (cardCount === 0) return { time: 0, unit: 'min', label: 'Empty set' };
    
    const totalMinutes = cardCount * 2; // 2 минуты на карточку в среднем
    const totalHours = cardCount * 0.1; // 6 минут на карточку = 0.1 часа
    
    if (totalMinutes < 60) {
      return { 
        time: Math.ceil(totalMinutes / 5) * 5, // Округляем до ближайших 5 минут
        unit: 'min', 
        label: 'Quick study'
      };
    } else if (totalHours < 2) {
      return { 
        time: Math.round(totalHours * 2) / 2, // Округляем до 0.5 часа
        unit: 'hour', 
        label: 'Study session'
      };
    } else {
      return { 
        time: Math.round(totalHours),
        unit: 'hours', 
        label: 'Deep learning'
      };
    }
  };

  // Получение уровня сложности
  const getDifficultyLevel = (cardCount) => {
    if (cardCount === 0) return { level: 'Empty', color: '#94A3B8' };
    if (cardCount <= 10) return { level: 'Easy', color: '#10B981' };
    if (cardCount <= 25) return { level: 'Medium', color: '#F59E0B' };
    if (cardCount <= 50) return { level: 'Hard', color: '#EF4444' };
    return { level: 'Expert', color: '#7C3AED' };
  };

  const cardCount = flashCardArray?.length || 0;
  const studyTime = calculateStudyTime(cardCount);
  const difficulty = getDifficultyLevel(cardCount);

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => navigation.navigate(
          "CardSetDetailsTabNavigation",
          {
            cardSetId: id,
            cardSetName: name
          })}
        activeOpacity={0.7}
      >
        {/* Header with category and favorite */}
        <View style={styles.header}>
          <View style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(categoryName) }
          ]}>
            <Text style={styles.categoryText}>
              {categoryName || "General"}
            </Text>
          </View>
          
          <Animated.View style={{ transform: [{ scale: favoriteScale }] }}>
            <TouchableOpacity 
              onPress={handleFavoritePress}
              style={styles.favoriteButton}
              activeOpacity={0.7}
            >
              <Icon
                name={isFavorite ? 'heart' : 'heart-o'}
                type='font-awesome'
                color={isFavorite ? '#FF6B6B' : '#CBD5E1'}
                size={20}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title} numberOfLines={2}>
            {name}
          </Text>

          {/* Description */}
          <Text style={styles.description} numberOfLines={2}>
            {description || "No description provided yet. Start adding cards to make this set more descriptive!"}
          </Text>

          {/* Stats Container */}
          <View style={styles.statsContainer}>
            {/* Карточки */}
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Text style={styles.statEmoji}>🎴</Text>
              </View>
              <View style={styles.statTextContainer}>
                <Text style={styles.statNumber}>{cardCount}</Text>
                <Text style={styles.statLabel}>cards</Text>
              </View>
            </View>

            {/* Время изучения */}
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Text style={styles.statEmoji}>⏱️</Text>
              </View>
              <View style={styles.statTextContainer}>
                <Text style={styles.statNumber}>
                  {studyTime.time}
                </Text>
                <Text style={styles.statLabel}>{studyTime.unit}</Text>
              </View>
            </View>

            {/* Сложность */}
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Text style={styles.statEmoji}>📊</Text>
              </View>
              <View style={styles.statTextContainer}>
                <View style={[styles.difficultyBadge, { backgroundColor: difficulty.color }]}>
                  <Text style={styles.difficultyText}>{difficulty.level}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Study Time Label */}
          <View style={styles.timeLabelContainer}>
            <Text style={styles.timeLabel}>{studyTime.label}</Text>
            <Text style={styles.date}>
              <Icon name="calendar" type="font-awesome" size={10} color="#94A3B8" /> 
              {' '}{formatDate(createdAt)}
            </Text>
          </View>
        </View>

        {/* Footer with arrow */}
        <View style={styles.footer}>
          <View style={styles.cardScale}>
            <View style={styles.scaleLabels}>
              <Text style={styles.scaleLabel}>Small</Text>
              <Text style={styles.scaleLabel}>Large</Text>
            </View>
            <View style={styles.scaleBar}>
              <View 
                style={[
                  styles.scaleIndicator,
                  { 
                    width: `${Math.min((cardCount / 50) * 100, 100)}%`,
                    backgroundColor: cardCount === 0 ? '#CBD5E1' : 
                                   cardCount <= 10 ? '#10B981' : 
                                   cardCount <= 25 ? '#F59E0B' : 
                                   cardCount <= 50 ? '#EF4444' : '#7C3AED'
                  }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.arrowContainer}>
            <Icon
              name="chevron-right"
              type="font-awesome"
              color="#18BBF1"
              size={16}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#F8FAFC",
    overflow: 'hidden',
  },
  touchable: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#18BBF1',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
    lineHeight: 26,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statEmoji: {
    fontSize: 16,
  },
  statTextContainer: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  timeLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
  },
  date: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardScale: {
    flex: 1,
    marginRight: 12,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  scaleLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  scaleBar: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  scaleIndicator: {
    height: '100%',
    borderRadius: 3,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
});

export default CardSetListItem;