import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

const initialState = {
  loading: false,
  error: "",
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

// Async thunk actions
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, size }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/cart", { productId: id, size, qty: 1 });
      if (response.status !== 200) throw new Error(response.error);
      dispatch(
        showToastMessage({
          message: "Item has been added to the cart.",
          status: "success",
        })
      );
      return response.data.cartItemQty;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: error.message || "The item is already in the cart.",
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue, dispatch }) => {
    // _ 사용 : 모든 아이템 불러오기
    try {
      const response = await api.get("/cart");
      if (response.status !== 200) throw new Error(response.error);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete(`/cart/${id}`);
      dispatch(getCartList());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

// 카트에 있는 개별 아이템 수량 업데이트
export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, value }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cart/${id}`, { qty: value });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

// 카트에 있는 전체 아이템 수량 가져오기
export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/cart/qty");
      return response.data.qty;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
    },
    // You can still add reducers here for non-async actions if necessary
  },
  extraReducers: (builder) => {
    const calculateTotalPrice = (cartList) =>
      cartList.reduce(
        (total, item) => total + item.productId.price * item.qty,
        0
      );
    builder.addCase(addToCart.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.cartItemCount = action.payload;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // 카트 아이템 불러오기
    builder.addCase(getCartList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getCartList.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.cartList = action.payload;
      // state.totalPrice = action.payload.reduce(
      //   // reduce배열함수사용해 카트아이템 계산해주기
      //   (total, item) => total + item.productId.price * item.qty,
      //   0
      // );
      state.totalPrice = calculateTotalPrice(state.cartList);
    });
    builder
      .addCase(getCartList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 카트 아이템 삭제
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItemCount = action.payload.qty;
        // state.totalPrice = action.payload.reduce(
        //   // reduce배열함수사용해 카트아이템 계산해주기
        //   (total, item) => total + item.productId.price * item.qty,
        //   0
        // );
        state.totalPrice = calculateTotalPrice(state.cartList);
        state.error = "";
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 카트에 있는 개별 아이템 수량 업데이트
      .addCase(updateQty.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateQty.fulfilled, (state, action) => {
        state.loading = false;
        state.cartList = action.payload.data;
        // state.totalPrice = action.payload.reduce(
        //   // reduce배열함수사용해 카트아이템 계산해주기
        //   (total, item) => total + item.productId.price * item.qty,
        //   0
        // );
        state.totalPrice = calculateTotalPrice(state.cartList);
        state.error = "";
      })
      .addCase(updateQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 카트에 있는 전체 아이템 수량 가져오기
      .addCase(getCartQty.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartQty.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItemCount = action.payload;
        state.error = "";
      })
      .addCase(getCartQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
