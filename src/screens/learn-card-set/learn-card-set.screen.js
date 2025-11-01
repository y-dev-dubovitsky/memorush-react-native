import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import ImgBackgroundComponent from '../../common/components/img-background/img-background.component';
import ButtonComponent from './atomic-components/button/button.component';
import CardSetItemComponent from './components/card-set-item/card-set-item.component';
import CongratulationComponent from './components/congratulation/congratulation.component';
import ProgressBarComponent from './components/progress-bar/progress-bar.component';
import TipComponent from './components/tip/tip.component';
import { cardByIdSelector } from '../../redux/features/card-set/card-set.slice';

const LearnCardSetScreen = ({ route, navigation }) => {
  const { cardSetId } = route.params;

  const [isHintVisible, setIsHintVisible] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [progress, setProgress] = useState(0);

  // Temp array with learned words
  let learned = [];

  const cardSet = useSelector(state => cardByIdSelector(state, cardSetId));
  const [cards, setCards] = useState(cardSet?.flashCardArray || []);

  const nextCardHandler = () => {
    currentPosition < cards.length - 1
      ? setCurrentPosition(currentPosition + 1)
      : setCurrentPosition(0);
  };

  const knowCardActionHandler = () => {
    if (cards.length > 0) {
      learned.push(cards[currentPosition]);
      setCards(cards.filter(card => !learned.includes(card)));
      calculateCurrentProgress();
    }
  };

  const calculateCurrentProgress = () => {
    setProgress((cards.length - learned.length) / cards.length);
  };

  const setInitialStateHandler = () => {
    setIsStarted(false);
    learned = [];
    setCards(cardSet?.flashCardArray || []);
  };

  const navigateToCardListHandler = () => {
    navigation.goBack();
  };

  const showLearnCardViewElement = () =>
    cards.length !== 0 ? (
      <View style={styles.learnViewContainer}>
        {/* Header with progress and stats */}
        <View style={styles.header}>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{currentPosition + 1}</Text>
              <Text style={styles.statLabel}>Current</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{cards.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{learned.length}</Text>
              <Text style={styles.statLabel}>Learned</Text>
            </View>
          </View>
          <ProgressBarComponent progress={progress} />
        </View>

        {/* Card Area */}
        <View style={styles.cardArea}>
          <View style={styles.cardContainer}>
            <CardSetItemComponent
              item={cards[currentPosition]}
              isHintVisible={isHintVisible}
            />
          </View>

          {/* Hint Toggle */}
          <View style={styles.hintSection}>
            <Text>💡 Show Hint</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <ButtonComponent
            style={[styles.actionButton, styles.knowButton]}
            onClickHandler={knowCardActionHandler}
            name='✅ I Know It'
          />
          <ButtonComponent
            style={[styles.actionButton, styles.dontKnowButton]}
            name="❌ Don't Know"
            onClickHandler={nextCardHandler}
          />
        </View>
      </View>
    ) : (
      <CongratulationComponent
        setInitialStateHandler={setInitialStateHandler}
        navigateToCardListHandler={navigateToCardListHandler}
      />
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImgBackgroundComponent>
        <View style={styles.container}>
          {isStarted ? (
            showLearnCardViewElement()
          ) : (
            <TipComponent
              setIsStarted={setIsStarted}
              navigateToCardListHandler={navigateToCardListHandler}
            />
          )}
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
  learnViewContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#18BBF1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  cardArea: {
    flex: 1,
    padding: 20,
  },
  cardContainer: {
    flex: 1,
    marginBottom: 16,
  },
  hintSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  hintButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 150,
  },
  hintButtonActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginHorizontal: 6, // Добавляем отступ по бокам
  },
  knowButton: {
    backgroundColor: '#10B981',
  },
  dontKnowButton: {
    backgroundColor: '#EF4444',
  },
});

export default LearnCardSetScreen;
