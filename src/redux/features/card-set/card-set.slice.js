import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import fetchDataService from '../../../service/fetchDataService';
import {
  loadGuestCardSets,
  saveGuestCardSets,
} from '../../../utils/storage.utils';
import { BASE_URL } from '../../const/url-endpoints.const';
import { isGuestSelector } from '../auth/auth-slice';
import { useSelector } from 'react-redux';

// -------------------------------------- AsyncThunk --------------------------------------

export const getAllCardSets = createAsyncThunk(
  'card/getAllCardSets',
  async (arg, { getState }) => {
    const state = getState();
    const token = state.auth.authEntity.token;
    const isGuest = useSelector(isGuestSelector);

    if (isGuest) {
      const guestCardSets = await loadGuestCardSets();
      return guestCardSets;
    }

    const payload = {
      method: 'GET',
      url: `${BASE_URL}/api/v1/card-set/all`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token,
      },
    };
    const response = await fetchDataService(payload);
    return response.data;
  }
);

export const createNewCardSet = createAsyncThunk(
  'card/create',
  async (arg, { getState }) => {
    const state = getState();
    const token = state.auth.authEntity.token;
    const isGuest = isGuestSelector(state);

    const newCardSet = {
      ...arg,
      tags: arg.tags.split(','),
      flashCardArray: Object.values(arg.flashCardArray),
      id: Date.now().toString(), // Генерируем ID для гостевого режима
      isFavorite: false,
    };

    if (isGuest) {
      const currentCardSets = await loadGuestCardSets();
      const updatedCardSets = [...currentCardSets, newCardSet];
      await saveGuestCardSets(updatedCardSets);
      return newCardSet;
    }

    const payload = {
      method: 'POST',
      url: `${BASE_URL}/api/v1/card-set/add`,
      data: newCardSet,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token,
      },
    };
    const response = await fetchDataService(payload);
    return response.data;
  }
);

export const updateCardSet = createAsyncThunk(
  'card/update',
  async (arg, { getState, rejectWithValue }) => {
    try {
      console.log("=== UPDATE CARD SET THUNK STARTED ===");
      
      const state = getState();
      const token = state.auth.authEntity.token;
      const isGuest = state.auth.authEntity.isGuest;
      const { cardSetId, cardSetEntity } = arg;

      console.log("Updating card set, isGuest:", isGuest);
      console.log("CardSetId:", cardSetId);
      console.log("CardSetEntity:", cardSetEntity);
      console.log("Tags type:", typeof cardSetEntity.tags, "Value:", cardSetEntity.tags);

      // Исправляем обработку tags
      let processedTags = cardSetEntity.tags;
      
      // Если tags - строка, разбиваем по запятым
      if (typeof cardSetEntity.tags === 'string') {
        processedTags = cardSetEntity.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }
      // Если tags уже массив, оставляем как есть
      else if (Array.isArray(cardSetEntity.tags)) {
        processedTags = cardSetEntity.tags.filter(tag => tag.length > 0);
      }
      // Если tags undefined или null, создаем пустой массив
      else {
        processedTags = [];
      }

      console.log("Processed tags:", processedTags);

      const updatedCardSet = {
        ...cardSetEntity,
        tags: processedTags, // Используем обработанные tags
        flashCardArray: Object.values(cardSetEntity.flashCardArray || {}),
      };

      console.log("Updated card set prepared:", updatedCardSet);

      if (isGuest) {
        console.log("🎯 Guest mode - saving locally");
        const currentCardSets = await loadGuestCardSets();
        console.log("Current guest card sets:", currentCardSets);
        
        const updatedCardSets = currentCardSets.map(cardSet =>
          cardSet.id === cardSetId
            ? { ...updatedCardSet, id: cardSetId }
            : cardSet
        );
        
        console.log("Updated guest card sets:", updatedCardSets);
        await saveGuestCardSets(updatedCardSets);
        console.log("✅ Guest data saved successfully");
        
        return { ...updatedCardSet, id: cardSetId };
      }

      console.log("👤 User mode - making API call");
      
      if (!token) {
        throw new Error('No authentication token');
      }

      const payload = {
        method: 'PUT',
        url: `${BASE_URL}/api/v1/card-set/update/${cardSetId}`,
        data: updatedCardSet,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token,
        },
      };
      
      console.log("API payload:", payload);
      const response = await fetchDataService(payload);
      console.log("✅ API response:", response);
      
      return response.data;
    } catch (error) {
      console.log("❌ ERROR in updateCardSet thunk:", error);
      console.log("Error message:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCardSet = createAsyncThunk(
  'card/delete',
  async ({ cardSetId }, { getState }) => {
    const state = getState();
    const token = state.auth.authEntity.token;
    const isGuest = isGuestSelector(state);

    if (isGuest) {
      const currentCardSets = await loadGuestCardSets();
      const updatedCardSets = currentCardSets.filter(
        cardSet => cardSet.id !== cardSetId
      );
      await saveGuestCardSets(updatedCardSets);
      return { id: cardSetId };
    }

    const payload = {
      method: 'DELETE',
      url: `${BASE_URL}/api/v1/card-set/delete/${cardSetId}`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token,
      },
    };
    const response = await fetchDataService(payload);
    return response.data;
  }
);

export const setFavoriteCardSet = createAsyncThunk(
  'card/setFavorite',
  async (id, { getState }) => {
    const state = getState();
    const token = state.auth.authEntity.token;
    const isGuest = isGuestSelector(state);

    if (isGuest) {
      const currentCardSets = await loadGuestCardSets();
      const card = currentCardSets.find(card => card.id === id);
      if (!card) throw new Error('Card set not found');

      const updatedCard = { ...card, isFavorite: !card.isFavorite };
      const updatedCardSets = currentCardSets.map(cardSet =>
        cardSet.id === id ? updatedCard : cardSet
      );
      await saveGuestCardSets(updatedCardSets);
      return updatedCard;
    }

    const card = state.cardSet.cardEntity.find(card => card.id === id);
    const payload = {
      method: 'PUT',
      url: `${BASE_URL}/api/v1/card-set/update/${id}`,
      data: {
        ...card,
        isFavorite: !card.isFavorite,
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token,
      },
    };
    const response = await fetchDataService(payload);
    return response.data;
  }
);

// -------------------------------------- Slice --------------------------------------

const initialState = {
  cardEntity: [],
  status: null,
  error: null,
};

const cardSetSlice = createSlice({
  name: 'cardSet',
  initialState,
  reducers: {
    clearGuestData: state => {
      state.cardEntity = [];
      state.status = null;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllCardSets.pending, state => {
        state.status = 'loading';
      })
      .addCase(getAllCardSets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cardEntity = action.payload;
      })
      .addCase(getAllCardSets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add new card set
      .addCase(createNewCardSet.pending, state => {
        state.status = 'loading';
      })
      .addCase(createNewCardSet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cardEntity = [...state.cardEntity, action.payload];
      })
      .addCase(createNewCardSet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Update card set
      .addCase(updateCardSet.pending, state => {
        state.status = 'loading';
      })
      .addCase(updateCardSet.fulfilled, (state, action) => {
        state.status = 'updated';
        const idx = state.cardEntity.findIndex(
          card => card.id === action.payload.id
        );
        if (idx !== -1) {
          state.cardEntity[idx] = action.payload;
        }
      })
      .addCase(updateCardSet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Delete card set
      .addCase(deleteCardSet.fulfilled, (state, action) => {
        state.cardEntity = state.cardEntity.filter(
          card => card.id !== action.payload.id
        );
      })
      // Set favorite card set
      .addCase(setFavoriteCardSet.pending, state => {
        state.status = 'loading';
      })
      .addCase(setFavoriteCardSet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const idx = state.cardEntity.findIndex(
          cardSet => cardSet.id === action.payload.id
        );
        if (idx !== -1) {
          state.cardEntity[idx] = action.payload;
        }
      })
      .addCase(setFavoriteCardSet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearGuestData } = cardSetSlice.actions;
export default cardSetSlice.reducer;

// -------------------------------------- Selectors --------------------------------------

export const cardEntitySelector = state => state.cardSet.cardEntity;
export const cardByIdSelector = (state, id) =>
  state.cardSet.cardEntity.find(card => id === card.id);

export const cardEntityByFavoriteAndLearnedSelector = (
  state,
  favorite,
  learned
) => {
  const favoriteCards = state.cardSet.cardEntity.filter(card => {
    return card.favorite === favorite;
  });
  const learnedCards = state.cardSet.cardEntity.filter(card => {
    return card.learned === learned;
  });
  if (favorite === true && learned === false) return favoriteCards;
  if (favorite === false && learned === true) return learnedCards;
  return state.cardSet.cardEntity;
};

export const cardSetByIdSelector = (state, id) =>
  state.cardSet.cardEntity.find(cardSet => id === cardSet.id);

export const getSortedCardByCardSetSelector = state => {
  const sorted = state.cardSet.cardEntity.reduce((result, card) => {
    result[card.cardSet.id] = {
      ...result[card.cardSet.id],
      [card.id]: card,
    };
    return result;
  }, {});

  return sorted;
};

export const cardSetFavoriteSelector = state =>
  state.cardSet.cardEntity.filter(card => card.isFavorite === true);

export const filterCardSetByNameSelector = (state, name) => {
  if (name.length > 0) {
    return state.cardSet.cardEntity.filter(entity =>
      entity.name.includes(name)
    );
  } else {
    return state.cardSet.cardEntity;
  }
};
