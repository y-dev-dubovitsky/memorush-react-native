import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { cardByIdSelector } from '../../redux/features/card-set/card-set.slice';
import ImgBackgroundComponent from '../../common/components/img-background/img-background.component';
import { Ionicons } from '@expo/vector-icons';

const CardSetInfoScreen = ({ route, navigation }) => {
  const { cardSetId } = route.params;
  const cardSet = useSelector(state => cardByIdSelector(state, cardSetId));

  if (!cardSet) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ImgBackgroundComponent>
          <View style={styles.centeredContainer}>
            <View style={styles.errorCard}>
              <Ionicons name='warning-outline' size={48} color='#F59E0B' />
              <Text style={styles.errorTitle}>Card Set Not Found</Text>
              <Text style={styles.errorText}>
                The card set you're looking for doesn't exist or has been
                removed.
              </Text>
            </View>
          </View>
        </ImgBackgroundComponent>
      </SafeAreaView>
    );
  }

  const {
    name,
    categoryName = 'General',
    isFavorite,
    createdAt,
    updatedAt,
    flashCardArray,
    description,
    tags,
  } = cardSet;

  const navigateToLearning = () => {
    navigation.navigate('CardLearning', { cardSetId });
  };

  const navigateToCards = () => {
    navigation.navigate('CardSetDetailsTabNavigation', {
      cardSetId,
      cardSetName: name,
    });
  };

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCardCount = () => {
    if (!flashCardArray) return 0;
    return Array.isArray(flashCardArray)
      ? flashCardArray.length
      : Object.keys(flashCardArray).length;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainCard}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.titleIconContainer}>
              <View style={styles.iconBackground}>
                <Ionicons name='library' size={32} color='#FFFFFF' />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={2}>
                  {name}
                </Text>
                <View style={styles.favoriteContainer}>
                  <View
                    style={[
                      styles.favoriteBadge,
                      isFavorite && styles.favoriteActive,
                    ]}
                  >
                    <Ionicons
                      name={isFavorite ? 'heart' : 'heart-outline'}
                      size={16}
                      color={isFavorite ? '#FFFFFF' : '#94A3B8'}
                    />
                    <Text
                      style={[
                        styles.favoriteText,
                        isFavorite && styles.favoriteTextActive,
                      ]}
                    >
                      {isFavorite ? 'Favorite' : 'Add to favorites'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Description */}
          {description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionLabel}>Description</Text>
              <View style={styles.descriptionBox}>
                <Ionicons
                  name='document-text-outline'
                  size={16}
                  color='#64748B'
                  style={styles.descriptionIcon}
                />
                <Text style={styles.descriptionText}>{description}</Text>
              </View>
            </View>
          )}

          {/* Stats Cards */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionLabel}>Overview</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: '#E0F7FA' }]}>
                  <Ionicons
                    name='documents-outline'
                    size={24}
                    color='#18BBF1'
                  />
                </View>
                <Text style={styles.statNumber}>{getCardCount()}</Text>
                <Text style={styles.statLabel}>Total Cards</Text>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: '#F0FDF4' }]}>
                  <Ionicons name='time-outline' size={24} color='#10B981' />
                </View>
                <Text style={styles.statNumber}>
                  {Math.floor(getCardCount() * 1.5)}
                </Text>
                <Text style={styles.statLabel}>Est. Minutes</Text>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons
                    name='stats-chart-outline'
                    size={24}
                    color='#F59E0B'
                  />
                </View>
                <Text style={styles.statNumber}>
                  {getCardCount() > 0 ? 'Ready' : 'Empty'}
                </Text>
                <Text style={styles.statLabel}>Status</Text>
              </View>
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionLabel}>Details</Text>
            <View style={styles.detailsList}>
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name='folder-outline' size={20} color='#18BBF1' />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailValue}>{categoryName}</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name='calendar-outline' size={20} color='#18BBF1' />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Created</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(createdAt)}
                  </Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name='refresh-outline' size={20} color='#18BBF1' />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Last Updated</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(updatedAt)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Tags Section */}
          {tags && tags.length > 0 && (
            <View style={styles.tagsSection}>
              <Text style={styles.sectionLabel}>Tags</Text>
              <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Ionicons
                      name='pricetag-outline'
                      size={12}
                      color='#6366F1'
                    />
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={navigateToLearning}
            >
              <Ionicons name='play-circle' size={20} color='#FFFFFF' />
              <Text style={styles.primaryButtonText}>Start Learning</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={navigateToCards}
            >
              <Ionicons name='list' size={20} color='white' />
              <Text style={styles.secondaryButtonText}>View Cards</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  mainCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignSelf: 'center',
  },
  headerSection: {
    marginBottom: 24,
  },
  titleIconContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBackground: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#18BBF1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#18BBF1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  favoriteContainer: {
    flexDirection: 'row',
  },
  favoriteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  favoriteActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  favoriteText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  favoriteTextActive: {
    color: '#FFFFFF',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  descriptionBox: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#18BBF1',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  descriptionIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  descriptionText: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    fontWeight: '500',
  },
  statsSection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailsList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 2,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  tagsSection: {
    marginBottom: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    gap: 4,
  },
  tagText: {
    fontSize: 11,
    color: '#4338CA',
    fontWeight: '600',
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#18BBF1',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#18BBF1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    gap: 6,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7B42',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#FF7B42',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 6,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    maxWidth: 400,
    width: '100%',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default CardSetInfoScreen;
