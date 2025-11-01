import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchDataService from '../../../service/fetchDataService';
import { BASE_URL } from '../../const/url-endpoints.const';

// -------------------------------------- AsyncThunk --------------------------------------

export const registration = createAsyncThunk(
  'auth/registration',
  async data => {
    const payload = {
      method: 'POST',
      url: `${BASE_URL}/api/v1/user/registration`,
      data,
    };
    const response = await fetchDataService(payload);
    return response.data;
  }
);

export const login = createAsyncThunk('auth/login', async data => {
  const payload = {
    method: 'POST',
    url: `${BASE_URL}/login`,
    data,
  };
  const response = await fetchDataService(payload);
  return response.data;
});

export const updateUserData = createAsyncThunk(
  'auth/updateUserData',
  async (arg, { getState }) => {
    const state = getState();
    const token = state.auth.authEntity.token;

    const response = await axios.put(`${BASE_URL}/api/v1/user/updateUserData`, {
      data: {
        ...arg,
        username: state.auth.authEntity.username,
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token,
      },
    });

    return response.data;
  }
);

// -------------------------------------- Slice --------------------------------------

const initialState = {
  authEntity: {
    username: null,
    token: null,
    isGuest: false,
  },
  status: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    invalidateLoggedInUser: {
      reducer(state) {
        return initialState;
      },
    },
    guestLogin: {
      reducer(state) {
        state.authEntity = {
          username: 'guest',
          token: '123',
          isGuest: true,
        };
        state.status = 'login';
        state.error = null;
      },
    },
  },
  extraReducers(builder) {
    builder
      //! Registration
      .addCase(registration.pending, state => {
        state.status = 'loading';
      })
      .addCase(registration.fulfilled, (state, action) => {
        state.status = 'register';
      })
      .addCase(registration.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      //! Login
      .addCase(login.pending, state => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'login';
        state.authEntity = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      //! Update user data
      .addCase(updateUserData.pending, state => {
        state.status = 'loading';
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.status = 'updated';
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.status = 'failed';
      });
  },
});

export const { invalidateLoggedInUser, guestLogin } = authSlice.actions;

export default authSlice.reducer;

// -------------------------------------- Selectors --------------------------------------

export const authSelector = state => state.auth;
export const isGuestSelector = state => state.auth.authEntity.isGuest;
export const selectUserIsExist = state => (state.auth.error ? true : false);
export const authEntitySelector = state => state.auth.authEntity;
export const authStatusSelector = state => state.auth.status;
export const authErrorSelector = state => state.auth.error;
