import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// 비동기 액션 생성
export const getProductList = createAsyncThunk(
  "products/getProductList",
  async (query, { rejectWithValue }) => {
    try {
      // const response = await api.get("/product");
      const response = await api.get("/product", { params: { ...query } });
      console.log("rrr", response);
      if (response.status !== 200) throw new Error(response.error);
      return response.data.data;
    } catch (error) {
      rejectWithValue(error.error);
    }
  }
);

export const getProductDetail = createAsyncThunk(
  "products/getProductDetail",
  async (id, { rejectWithValue }) => {}
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/product", formData);
      if (response.status !== 200) throw new Error(response.error);
      dispatch(
        showToastMessage({
          message: "Product created successfully",
          status: "success",
        })
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { dispatch, rejectWithValue }) => {}
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, ...formData }, { dispatch, rejectWithValue }) => {}
);

// 슬라이스 생성
const productSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    selectedProduct: null,
    loading: false,
    error: "",
    totalPageNum: 1,
    success: false,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        //.addCase앞에 builder삭제해도 동작
        state.loading = false;
        state.error = "";
        state.success = true; // 상품 생성을 성공시 다이얼로그를 닫고, 실패시 실패메세지를 다이어로그에 보여주도록
      })
      .addCase(createProduct.rejected, (state, action) => {
        //.addCase앞에 builder삭제해도 동작 (; 지워서 한개로 연결됨)
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getProductList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getProductList.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = action.payload;
        state.error = "";
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedProduct, setFilteredList, clearError } =
  productSlice.actions;
export default productSlice.reducer;
