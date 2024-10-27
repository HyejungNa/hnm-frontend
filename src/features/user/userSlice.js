import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      // 성공
      // 토큰저장 1. local storage 2. session storage
      sessionStorage.setItem("token", response.data.token);
      // Login page 성공시 navigate처리
      return response.data;
    } catch (error) {
      // 실패시 생긴 에러값을 reducer에 저장
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {}
);

export const logout = createAsyncThunk(
  "user/logout",
  async (_, { dispatch }) => {
    try {
      // 로컬 스토리지의 토큰 제거
      sessionStorage.removeItem("token");

      dispatch(
        showToastMessage({
          message: "로그아웃 되었습니다.",
          status: "success",
        })
      );

      return null;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post("/user", { email, name, password });
      // 성공
      // 1. 성공 토스트 메시지 보여주기
      dispatch(
        showToastMessage({
          message: "Congratulations on signing up!",
          status: "success",
        })
      );
      // 2. 로그인 페이지로 리다이렉트
      navigate("/login");
      return response.data.data;
    } catch (error) {
      // 실패
      // 1, 실패 토스트 메시지 보여주기
      dispatch(
        showToastMessage({
          message: "Failed to sign up, please try again.",
          status: "error",
        })
      );
      // 2. 에러값을 저장한다
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {
    // api.js에서 이미 토큰값을 session storage에 저장하도록 설정해둠, 그래서 토큰값을 따로 가져오지않아도됨
    try {
      const response = await api.get("/user/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register reducer
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationError = action.payload;
      })
      // Login reducer
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.loginError = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      })
      // Token Login reducer
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.user = action.payload.user; // Store user data from token
      })
      // 로그인했는지 안했는지를 로딩스피너로 보여줄필요가없기에 삭제 .addCase(loginWithToken.pending)
      // 로그인한 유저가 없다는걸 보여줄필요가 없기에 삭제  .addCase(loginWithToken.rejected)
      // Logout 리듀서
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.loginError = null;
        state.registrationError = null;
        state.success = false;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
      });
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
