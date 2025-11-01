import AsyncStorage from '@react-native-async-storage/async-storage';

const CARD_SETS_KEY = 'guest_card_sets';

export const saveGuestCardSets = async (cardSets) => {
  try {
    await AsyncStorage.setItem(CARD_SETS_KEY, JSON.stringify(cardSets));
  } catch (e) {
    console.warn('Failed to save guest card sets', e);
  }
};

export const loadGuestCardSets = async () => {
  try {
    const json = await AsyncStorage.getItem(CARD_SETS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.warn('Failed to load guest card sets', e);
    return [];
  }
};