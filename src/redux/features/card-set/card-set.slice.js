import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import fetchDataService from '../../../service/fetchDataService';
import { BASE_URL } from '../../const/url-endpoints.const';
import cardSetsDB from '../../../utils/sqliteDatabase';

// -------------------------------------- AsyncThunk --------------------------------------

export const getAllCardSets = createAsyncThunk(
  'card/getAllCardSets',
  async (arg, { getState }) => {
    const state = getState();
    const token = state.auth.authEntity.token;
    const isGuest = state.auth.authEntity.isGuest;

    console.log("=== GET ALL CARD SETS ===");
    console.log("isGuest:", isGuest);

    if (isGuest) {
      // Используем SQLite вместо AsyncStorage
      const guestCardSets = await cardSetsDB.getAllCardSets();
      console.log("✅ Guest card sets loaded from SQLite:", guestCardSets.length);
      return guestCardSets;
    }

    // Режим пользователя - API вызов
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
  async (cardSetEntity, { getState }) => {
    const state = getState();
    const token = state.auth.authEntity.token;
    const isGuest = state.auth.authEntity.isGuest;

    console.log("=== CREATE CARD SET ===");
    console.log("isGuest:", isGuest);
    console.log("CardSet data:", cardSetEntity);

    const newCardSet = {
      ...cardSetEntity,
      tags: Array.isArray(cardSetEntity.tags) 
        ? cardSetEntity.tags 
        : (cardSetEntity.tags?.split(',') || []),
      flashCardArray: cardSetEntity.flashCardArray || {},
      id: Date.now().toString(),
      isFavorite: false,
    };

    if (isGuest) {
      // Сохраняем в SQLite
      const createdSet = await cardSetsDB.createCardSet(newCardSet);
      console.log("✅ Guest card set created in SQLite:", createdSet.id);
      return createdSet;
    }

    // Режим пользователя - API вызов
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
      console.log("=== UPDATE CARD SET ===");
      
      const state = getState();
      const token = state.auth.authEntity.token;
      const isGuest = state.auth.authEntity.isGuest;
      const { cardSetId, cardSetEntity } = arg;

      console.log("isGuest:", isGuest);
      console.log("CardSetId:", cardSetId);

      // Обрабатываем tags
      let processedTags = cardSetEntity.tags;
      if (typeof cardSetEntity.tags === 'string') {
        processedTags = cardSetEntity.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      } else if (Array.isArray(cardSetEntity.tags)) {
        processedTags = cardSetEntity.tags.filter(tag => tag.length > 0);
      } else {
        processedTags = [];
      }

      const updatedCardSet = {
        ...cardSetEntity,
        tags: processedTags,
        flashCardArray: cardSetEntity.flashCardArray || {},
      };

      if (isGuest) {
        // Обновляем в SQLite
        const result = await cardSetsDB.updateCardSet(cardSetId, updatedCardSet);
        console.log("✅ Guest card set updated in SQLite");
        return result;
      }

      // Режим пользователя - API вызов
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
      
      const response = await fetchDataService(payload);
      return response.data;
    } catch (error) {
      console.log("❌ ERROR in updateCardSet:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCardSet = createAsyncThunk(
  'card/delete',
  async ({ cardSetId }, { getState }) => {
    const state = getState();
    const token = state.auth.authEntity.token;
    const isGuest = state.auth.authEntity.isGuest;

    console.log("=== DELETE CARD SET ===");
    console.log("isGuest:", isGuest);

    if (isGuest) {
      // Удаляем из SQLite
      await cardSetsDB.deleteCardSet(cardSetId);
      console.log("✅ Guest card set deleted from SQLite");
      return { id: cardSetId };
    }

    // Режим пользователя - API вызов
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
  async (cardSetId, { getState }) => {
    const state = getState();
    const token = state.auth.authEntity.token;
    const isGuest = state.auth.authEntity.isGuest;

    console.log("=== TOGGLE FAVORITE ===");
    console.log("isGuest:", isGuest);

    if (isGuest) {
      // Обновляем в SQLite
      const updatedCard = await cardSetsDB.toggleFavorite(cardSetId);
      console.log("✅ Guest favorite toggled in SQLite");
      return updatedCard;
    }

    // Режим пользователя - API вызов
    const card = state.cardSet.cardEntity.find(card => card.id === cardSetId);
    const payload = {
      method: 'PUT',
      url: `${BASE_URL}/api/v1/card-set/update/${cardSetId}`,
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
      .addCase(deleteCardSet.fulfilled, (state, action) => {
        state.cardEntity = state.cardEntity.filter(
          card => card.id !== action.payload.id
        );
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

export const cardEntitySelector = state => state.cardSet.cardEntity;
export const cardByIdSelector = (state, id) =>
  state.cardSet.cardEntity.find(card => id === card.id);
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