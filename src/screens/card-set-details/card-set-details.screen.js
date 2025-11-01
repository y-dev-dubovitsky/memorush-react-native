import React from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Icon } from 'react-native-elements';
import ImgBackgroundComponent from '../../common/components/img-background/img-background.component';
import CardItemComponent from './components/card-item.component';
import { cardByIdSelector } from '../../redux/features/card-set/card-set.slice';
import AppbarComponent from './components/app-bar.component';
import EmptySetInformerComponent from './components/empty-set-informer.component';

const CardSetDetailsScreen = ({ route, navigation }) => {
  const { cardSetId, cardSetName } = route.params;
  const cardSet = useSelector(state => cardByIdSelector(state, cardSetId));

  const cardCount = cardSet?.flashCardArray?.length || 0;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const navigateBackToCardSetList = () => {
    navigation.navigate('MainTabNavigation', {
      screen: 'Cards',
    });
  };

  const renderCardItem = ({ item, index }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30 * (index + 1), 0],
            }),
          },
        ],
      }}
    >
      <CardItemComponent item={item} navigation={navigation} />
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImgBackgroundComponent>
        <View style={styles.container}>
          <AppbarComponent onBackPress={navigateBackToCardSetList} />

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#E0F2FE' }]}>
                <Icon name="content-copy" type="material" size={20} color="#18BBF1" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>{cardCount}</Text>
                <Text style={styles.statLabel}>Total Cards</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#FEF3C7' }]}>
                <Icon name="category" type="material" size={20} color="#F59E0B" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statCategory}>
                  {cardSet?.categoryName || 'General'}
                </Text>
                <Text style={styles.statLabel}>Category</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#DCFCE7' }]}>
                <Icon name="access-time" type="material" size={20} color="#22C55E" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>
                  {Math.floor(cardCount * 1.5)}min
                </Text>
                <Text style={styles.statLabel}>Est. Time</Text>
              </View>
            </View>
          </View>

          {/* Beautiful Flashcards Header */}
          <View style={styles.flashcardsHeader}>
            <View style={styles.flashcardsTitleSection}>
              <View style={styles.titleIconContainer}>
                <Icon 
                  name="style" 
                  type="material" 
                  size={24} 
                  color="#18BBF1" 
                />
              </View>
              <View style={styles.titleTextContainer}>
                <Text style={styles.flashcardsTitle}>Flashcards</Text>
                <Text style={styles.flashcardsSubtitle}>
                  {cardCount > 0 
                    ? `Explore your ${cardCount} card${cardCount !== 1 ? 's' : ''}` 
                    : 'Create your first card to get started'
                  }
                </Text>
              </View>
            </View>
            
            {cardCount > 0 && (
              <View style={styles.counterBadge}>
                <Text style={styles.counterText}>{cardCount}</Text>
              </View>
            )}
          </View>

          {/* Cards List */}
          <View style={styles.listContainer}>
            {cardSet?.flashCardArray && cardSet.flashCardArray.length > 0 ? (
              <FlatList
                data={cardSet.flashCardArray}
                renderItem={renderCardItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.flatListContent}
              />
            ) : (
              <EmptySetInformerComponent />
            )}
          </View>
        </View>
      </ImgBackgroundComponent>
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
    backgroundColor: '#F8FAFC',
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  setTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    flex: 1,
  },
  favoriteBadge: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  statCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  // Beautiful Flashcards Header
  flashcardsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  flashcardsTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#18BBF1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  titleTextContainer: {
    flex: 1,
  },
  flashcardsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  flashcardsSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    lineHeight: 18,
  },
  counterBadge: {
    backgroundColor: '#18BBF1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#18BBF1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  counterText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  listContainer: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
});

export default CardSetDetailsScreen;