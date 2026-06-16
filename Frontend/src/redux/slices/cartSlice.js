import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import toast from "react-hot-toast";

export const fetchCart = createAsyncThunk("cart/fetch", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/cart");
    return data.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const addToCart = createAsyncThunk("cart/add", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/cart/add", payload);
    return data.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const removeFromCart = createAsyncThunk("cart/remove", async (productId, { rejectWithValue }) => {
  try {
    const { data } = await api.delete(`/cart/remove/${productId}`);
    return data.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const updateCartItem = createAsyncThunk("cart/update", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.put("/cart/update", payload);
    return data.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: { cart: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    const handlePending = (state) => { state.loading = true; };
    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.cart = action.payload;
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      toast.error(action.payload || "Cart operation failed");
    };

    builder
      .addCase(fetchCart.pending, handlePending)
      .addCase(fetchCart.fulfilled, handleFulfilled)
      .addCase(fetchCart.rejected, handleRejected)
      .addCase(addToCart.pending, handlePending)
      .addCase(addToCart.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        toast.success("Added to cart! 🛒");
      })
      .addCase(addToCart.rejected, handleRejected)
      .addCase(removeFromCart.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        toast.success("Item removed from cart");
      })
      .addCase(updateCartItem.fulfilled, handleFulfilled);
  },
});

export default cartSlice.reducer;
