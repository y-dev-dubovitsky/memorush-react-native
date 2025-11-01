import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import ImgBackgroundComponent from '../../common/components/img-background/img-background.component';
import {
  cardByIdSelector,
  createNewCardSet,
  deleteCardSet,
  updateCardSet,
} from '../../redux/features/card-set/card-set.slice';
import ButtonComponent from './atomic-components/button/button.component';
import CardInputForm from './atomic-components/card-input-form/card-input-form.component';
import CardSetInputForm from './atomic-components/card-set-input-form/card-set-input-form.component';
import { authEntitySelector } from '../../redux/features/auth/auth-slice';

const INIT_CARD_SET_STATE = {
  name: '',
  tags: '',
  categoryName: '',
  description: '',
  flashCardArray: {},
};

const CardSetEditScreen = props => {
  const cardSetId = props.route.params?.cardSetId;
  const dispatch = useDispatch();
  const [cardSetEntity, setCardSetEntity] = useState(INIT_CARD_SET_STATE);
  const [isSetInfoExpanded, setIsSetInfoExpanded] = useState(false);
  const cardSetById = useSelector(state => cardByIdSelector(state, cardSetId));
  const authEntity = useSelector(authEntitySelector);

  useEffect(() => {
    console.log(authEntity)
    if (cardSetId != null && cardSetById != null) {
      setCardSetEntity({
        name: cardSetById.name,
        tags: cardSetById.tags,
        categoryName: cardSetById.categoryName,
        description: cardSetById.description,
        flashCardArray: { ...cardSetById.flashCardArray },
      });
    }
  }, []);

  const cardSetEntityFormInputHandler = (name, value) => {
    setCardSetEntity({
      ...cardSetEntity,
      [name]: value,
    });
  };

  const addFlashCardElement = () => {
    setCardSetEntity({
      ...cardSetEntity,
      flashCardArray: {
        ...cardSetEntity.flashCardArray,
        [Object.keys(cardSetEntity.flashCardArray)?.length]: {},
      },
    });
  };

  const isCardSetValidDataHandler = () => {
    if (
      cardSetEntity.name?.length > 0 &&
      cardSetEntity.categoryName?.length > 0
    ) {
      return false;
    }
    return true;
  };

  const showCardItemCreateFormListEl = () => {
    const el = Object.entries(cardSetEntity.flashCardArray);

    if (el.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emoji}>📝</Text>
          <Text style={styles.emptyTitle}>No Cards Yet</Text>
          <Text style={styles.emptySubtitle}>
            Add your first card to get started with this set
          </Text>
        </View>
      );
    }

    return el.map((_, idx) => (
      <CardInputForm
        key={idx}
        id={idx}
        item={el[idx][1]}
        cardSetEntity={cardSetEntity}
        setCardSetEntity={setCardSetEntity}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImgBackgroundComponent>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.titleRow}>
                <View style={styles.iconBadge}>
                  <Text style={styles.headerIcon}>
                    {cardSetId ? '📝' : '✨'}
                  </Text>
                </View>
                <View style={styles.titleContainer}>
                  <Text style={styles.headerTitle}>
                    {cardSetId ? 'Edit Card Set' : 'Create New Set'}
                  </Text>
                  <Text style={styles.headerSubtitle}>
                    {cardSetId
                      ? 'Update your flashcard collection'
                      : 'Start building your learning materials'}
                  </Text>
                </View>
              </View>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {Object.keys(cardSetEntity.flashCardArray).length}
                  </Text>
                  <Text style={styles.statLabel}>Cards</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              {/* Set Information */}
              <View style={styles.section}>
                <TouchableOpacity 
                  style={styles.sectionHeader}
                  onPress={() => setIsSetInfoExpanded(!isSetInfoExpanded)}
                  activeOpacity={0.7}
                >
                  <View style={styles.sectionIconContainer}>
                    <Text style={styles.sectionIcon}>📋</Text>
                  </View>
                  <View style={styles.sectionTextContainer}>
                    <Text style={styles.sectionTitle}>Set Information</Text>
                    <Text style={styles.sectionSubtitle}>
                      {isSetInfoExpanded 
                        ? 'Basic details about your card set' 
                        : 'Tap to add set details'
                      }
                    </Text>
                  </View>
                  <View style={styles.expandIconContainer}>
                    <Text style={[
                      styles.expandIcon,
                      isSetInfoExpanded && styles.expandIconRotated
                    ]}>
                      ⌄
                    </Text>
                  </View>
                </TouchableOpacity>

                {isSetInfoExpanded && (
                  <CardSetInputForm
                    values={cardSetEntity}
                    cardSetEntityFormInputHandler={cardSetEntityFormInputHandler}
                  />
                )}

                {!isSetInfoExpanded && (
                  <View style={styles.hintContainer}>
                    <View style={styles.hintIcon}>
                      <Text style={styles.hintEmoji}>👉</Text>
                    </View>
                    <View style={styles.hintTextContainer}>
                      <Text style={styles.hintTitle}>Set Information Required</Text>
                      <Text style={styles.hintDescription}>
                        Tap above to add title, category, and description for your flashcard set
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Cards */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionIconContainer}>
                    <Text style={styles.sectionIcon}>🎴</Text>
                  </View>
                  <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>Flashcards</Text>
                    <Text style={styles.sectionSubtitle}>
                      Add questions and answers
                    </Text>
                  </View>
                  <View style={styles.cardsCountBadge}>
                    <Text style={styles.cardsCount}>
                      {Object.keys(cardSetEntity.flashCardArray).length}
                    </Text>
                  </View>
                </View>
                {showCardItemCreateFormListEl()}
              </View>
            </ScrollView>
          </View>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <View style={styles.buttonRow}>
              <ButtonComponent
                style={[styles.button, styles.addButton]}
                onClickHandler={addFlashCardElement}
                name='New Card'
                color='#18BBF1'
              />
              {cardSetId != undefined ? (
                <ButtonComponent
                  style={[styles.button, styles.updateButton]}
                  isDisabled={isCardSetValidDataHandler()}
                  onClickHandler={() =>
                    dispatch(updateCardSet({ cardSetId, cardSetEntity }))
                  }
                  name='Update Set'
                  color='#FF7B42'
                />
              ) : (
                <ButtonComponent
                  style={[styles.button, styles.saveButton]}
                  isDisabled={isCardSetValidDataHandler()}
                  onClickHandler={() =>
                    dispatch(createNewCardSet(cardSetEntity))
                  }
                  name='Create Set'
                  color='#FF7B42'
                />
              )}
              <ButtonComponent
                style={[styles.button, styles.backButton]}
                onClickHandler={() =>
                  props.navigation.navigate('MainTabNavigation')
                }
                name='Go Back'
                color='#94A3B8'
              />
            </View>
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
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  headerIcon: {
    fontSize: 24,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
    letterSpacing: -0.8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
    lineHeight: 22,
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#18BBF1',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#18BBF1',
  },
  sectionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTextContainer: {
    flex: 1,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  expandIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  expandIcon: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: 'bold',
    transform: [{ rotate: '0deg' }],
  },
  expandIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderStyle: 'dashed',
  },
  hintIcon: {
    marginRight: 16,
  },
  hintEmoji: {
    fontSize: 24,
  },
  hintTextContainer: {
    flex: 1,
  },
  hintTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0369A1',
    marginBottom: 4,
  },
  hintDescription: {
    fontSize: 14,
    color: '#0C4A6E',
    lineHeight: 20,
  },
  cardsCountBadge: {
    backgroundColor: '#18BBF1',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  cardsCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F1F5F9',
    borderStyle: 'dashed',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    minHeight: 52,
    justifyContent: 'center',
    borderRadius: 14,
  },
  addButton: {
    shadowColor: '#18BBF1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginRight: 12,
  },
  saveButton: {
    shadowColor: '#3AE2CE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginRight: 12,
  },
  updateButton: {
    shadowColor: '#5EBD6D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginRight: 12,
  },
  backButton: {
    backgroundColor: '#F1F5F9',
  },
});

export default CardSetEditScreen;