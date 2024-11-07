/* <깃헙 리포 복구> */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartQty } from "../cart/cartSlice";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// Define initial state
const initialState = {
  orderList: [],
  orderNum: "",
  selectedOrder: {},
  error: "",
  loading: false,
  totalPageNum: 1,
};

// Async thunks
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/order", payload);
      if (response.status !== 200) throw new Error(response.error);

      // 오더가 끝난후 navbar 카트 아이템숫자 최신(0)으로 업데이트해주기
      dispatch(getCartQty());
      // 오더한후 최종적으로 오더넘버를 리턴받게됨
      return response.data.orderNum;
    } catch (error) {
      dispatch(showToastMessage({ message: error.error, status: "error" }));
      return rejectWithValue(error.error);
    }
  }
);

// 개인유저가 주문한 내역 확인할수있는 my order
export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/order/me");
      if (response.status !== 200) throw new Error(response.error);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

// admin page에서 전체 order list 확인
export const getOrderList = createAsyncThunk(
  "order/getOrderList",
  async (query, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/order", { params: { ...query } });
      if (response.status !== 200) throw new Error(response.error);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// admin page에서 주문 status 업데이트 기능
export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/order/${id}`, { status });

      if (response.data.status === "success") {
        dispatch(
          showToastMessage({
            message: "Order status updated successfully",
            status: "success",
          })
        );
        return response.data.order;
      }
    } catch (error) {
      dispatch(
        showToastMessage({
          message:
            error.message || "Failed to update order status, please try again",
          status: "error",
        })
      );
      return rejectWithValue(error.message);
    }
  }
);
/* <에러발생해서 위코드로 수정> */
// export const updateOrder = createAsyncThunk(
//   "order/updateOrder",
//   async ({ id, status }, { dispatch, rejectWithValue }) => {
//     try {
//       const response = await api.put(`/order/${id}`, { status });
//       if (response !== 200) throw new Error(response.error);
//       // dispatch({})
//       console.log("response", response);

//       dispatch(
//         showToastMessage({
//           message: "Order status updated successfully!",
//           status: "success",
//         })
//       );
//       dispatch(getOrderList());
//       return response.data.data;
//     } catch (error) {
//       dispatch(
//         showToastMessage({
//           message:
//             error.error || "Failed to update order status, please try again.",
//           status: "fail",
//         })
//       );
//       return rejectWithValue(error.error);
//     }
//   }
// );

// Order slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.orderNum = action.payload;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder
      .addCase(getOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderList = action.payload;
        state.error = "";
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrderList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getOrderList.fulfilled, (state, action) => {
        state.loading = false;
        state.orderList = action.payload.data;
        state.totalPageNum = action.payload.totalPageNum;
        state.error = "";
      })
      .addCase(getOrderList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        // state.orderList = action.payload.data;
        // state.totalPageNum = action.payload.totalPageNum;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;

// *<my order페이지는 보이지만 주문리스트를 받아오지 못하고있음>*
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { getCartQty } from "../cart/cartSlice";
// import api from "../../utils/api";
// import { showToastMessage } from "../common/uiSlice";

// // Define initial state
// const initialState = {
//   orderList: [],
//   orderNum: "",
//   selectedOrder: {},
//   error: "",
//   loading: false,
//   totalPageNum: 1,
// };

// // Async thunks
// export const createOrder = createAsyncThunk(
//   "order/createOrder",
//   async (payload, { dispatch, rejectWithValue }) => {
//     try {
//       const response = await api.post("/order", payload);
//       if (response.status !== 200) throw new Error(response.error);

//       // 오더가 끝난후 navbar 카트 아이템숫자 최신(0)으로 업데이트해주기
//       dispatch(getCartQty());
//       // 오더한후 최종적으로 오더넘버를 리턴받게됨
//       return response.data.orderNum;
//     } catch (error) {
//       dispatch(showToastMessage({ message: error.error, status: "error" }));
//       return rejectWithValue(error.error);
//     }
//   }
// );

// export const getOrder = createAsyncThunk(
//   "order/getOrder",
//   async (_, { rejectWithValue, dispatch }) => {
//     try {
//       const response = await api.get("/order/me");
//       return response.data;
//     } catch (error) {
//       rejectWithValue(error.message);
//     }
//   }
// );

// export const getOrderList = createAsyncThunk(
//   "order/getOrderList",
//   async (query, { rejectWithValue }) => {
//     try {
//       const response = await api.get("/order/list", { params: query });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const updateOrder = createAsyncThunk(
//   "order/updateOrder",
//   async ({ id, status }, { dispatch, rejectWithValue }) => {
//     try {
//       const response = await api.put(`/order/${id}`, { status });

//       if (response.data.status === "success") {
//         dispatch(
//           showToastMessage({
//             message: "Order status updated successfully",
//             status: "success",
//           })
//         );
//         return response.data.order;
//       }
//     } catch (error) {
//       dispatch(
//         showToastMessage({
//           message:
//             error.message || "Failed to update order status, please try again",
//           status: "error",
//         })
//       );
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // Order slice
// const orderSlice = createSlice({
//   name: "order",
//   initialState,
//   reducers: {
//     setSelectedOrder: (state, action) => {
//       state.selectedOrder = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(createOrder.pending, (state, action) => {
//       state.loading = true;
//     });
//     builder.addCase(createOrder.fulfilled, (state, action) => {
//       state.loading = false;
//       state.error = "";
//       state.orderNum = action.payload;
//     });
//     builder
//       .addCase(createOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(getOrder.pending, (state, action) => {
//         state.loading = true;
//       })
//       .addCase(getOrder.fulfilled, (state, action) => {
//         state.loading = false;
//         // state.orderList = action.payload.data;
//         state.orderList = action.payload;
//         state.totalPageNum = action.payload.totalPageNum;
//       })
//       .addCase(getOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(getOrderList.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getOrderList.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orderList = action.payload.orders;
//         state.totalPageNum = action.payload.totalPageNum;
//       })
//       .addCase(getOrderList.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(updateOrder.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(updateOrder.fulfilled, (state, action) => {
//         state.loading = false;
//         state.error = "";
//         // 업데이트된 주문으로 리스트 업데이트
//         state.orderList = state.orderList.map((order) =>
//           order._id === action.payload._id ? action.payload : order
//         );
//       })
//       .addCase(updateOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { setSelectedOrder } = orderSlice.actions;
// export default orderSlice.reducer;
