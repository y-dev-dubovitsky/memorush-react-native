import React, { useEffect, useState, useRef } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import ImgBackgroundComponent from '../../common/components/img-background/img-background.component';
import {
  cardEntitySelector,
  getAllCardSets,
  filterCardSetByNameSelector,
} from '../../redux/features/card-set/card-set.slice';
import FABGroupComponent from './components/FAB-group/FAB-group.component';
import AppbarComponent from './components/app-bar/app-bar.component';
import CardSetListItem from './components/card-set-list-item/card-set-list-item.component';
import CardSetTableComponent from './components/card-set-table/card-set-table.component';
import { useIsFocused } from '@react-navigation/native';
import { Icon } from 'react-native-elements';

const CardSetListScreen = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [searchTextString, setSearchTextString] = useState('');
  const cardEntity = useSelector(state =>
    filterCardSetByNameSelector(state, searchTextString)
  );
  const [toggleCardsView, setToggleCardsView] = useState(true);
  const [showTips, setShowTips] = useState(true);

  // Анимационные значения
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const tipsHeightAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    dispatch(getAllCardSets());

    // Анимация появления контента
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();

    // Пульсация для привлечения внимания к подсказкам
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [isFocused]);

  const fetchCardSetsDataHandler = () => {
    dispatch(getAllCardSets());
  };

  const toggleTips = () => {
    Animated.timing(tipsHeightAnim, {
      toValue: showTips ? 0 : 1,
      duration: 400,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
    setShowTips(!showTips);
  };

  const showCardsElement = () => (
    <Animated.View
      style={[
        styles.cardsContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {toggleCardsView ? (
        <FlatList
          data={cardEntity}
          renderItem={({ item, index }) => (
            <CardSetListItem
              item={item}
              navigation={props.navigation}
              index={index}
            />
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <CardSetTableComponent
          navigation={props.navigation}
          cardEntity={cardEntity}
        />
      )}
    </Animated.View>
  );

  const tipsHeight = tipsHeightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 140],
  });

  const tipsOpacity = tipsHeightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* AppBar */}
        <AppbarComponent
          searchTextString={searchTextString}
          setSearchTextString={setSearchTextString}
        />

        {/* Tips Section */}
        <Animated.View
          style={[
            styles.tipsContainer,
            {
              height: tipsHeight,
              opacity: tipsOpacity,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.tipsHeader}
            onPress={toggleTips}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[styles.tipsIcon, { transform: [{ scale: pulseAnim }] }]}
            >
              <Text style={styles.tipsIconText}>💡</Text>
            </Animated.View>
            <View style={styles.tipsTitleContainer}>
              <Text style={styles.tipsTitle}>Quick Tips</Text>
              <Text style={styles.tipsSubtitle}>
                {showTips ? 'Tap to hide tips' : 'Tap to show tips'}
              </Text>
            </View>
            <Icon
              name={showTips ? 'chevron-up' : 'chevron-down'}
              type='font-awesome'
              color='#18BBF1'
              size={16}
            />
          </TouchableOpacity>

          <View style={styles.tipsContent}>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Use search to find specific card sets
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Switch between list and grid views
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Create new sets with the + button below
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Stats Header */}
        <Animated.View
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{cardEntity.length}</Text>
            <Text style={styles.statLabel}>Total Sets</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {cardEntity.reduce(
                (total, set) => total + (set.flashCardArray?.length || 0),
                0
              )}
            </Text>
            <Text style={styles.statLabel}>Total Cards</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {cardEntity.filter(set => set.isFavorite).length}
            </Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
        </Animated.View>

        {/* Cards List */}
        <View style={styles.cardSetListContainer}>
          {cardEntity.length === 0 ? (
            <Animated.View
              style={[
                styles.emptyState,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.emptyEmoji}>📚</Text>
              <Text style={styles.emptyTitle}>No Card Sets Yet</Text>
              <Text style={styles.emptySubtitle}>
                {searchTextString
                  ? 'No sets match your search. Try different keywords.'
                  : 'Create your first card set to get started!'}
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => props.navigation.navigate('CardSetEditScreen')}
              >
                <Text style={styles.emptyButtonText}>Create First Set</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            showCardsElement()
          )}
        </View>

        {/* FAB */}
        <FABGroupComponent
          navigation={props.navigation}
          cardViewToggleHandler={() => setToggleCardsView(!toggleCardsView)}
          fetchCardSetsDataHandler={fetchCardSetsDataHandler}
        />
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
  },
  tipsContainer: {
    backgroundColor: '#F0F9FF',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    overflow: 'hidden',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  tipsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#18BBF1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipsIconText: {
    fontSize: 18,
  },
  tipsTitleContainer: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 2,
  },
  tipsSubtitle: {
    fontSize: 12,
    color: '#0C4A6E',
  },
  tipsContent: {
    padding: 16,
    paddingTop: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    color: '#18BBF1',
    fontWeight: 'bold',
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    color: '#0C4A6E',
    lineHeight: 20,
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#18BBF1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#F1F5F9',
  },
  cardSetListContainer: {
    flex: 1,
  },
  cardsContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#18BBF1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#18BBF1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default CardSetListScreen;
