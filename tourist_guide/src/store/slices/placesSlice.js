import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/client";

export const fetchPlaces = createAsyncThunk(
  "places/fetchPlaces",
  async ({ location, category, keyword, source }, { rejectWithValue }) => {
    try {
      const params = { location, category, keyword, source };
      const res = await api.get("/getPlaces", { params });
      return res.data; // normalmente array
    } catch (e) {
      return rejectWithValue(e?.message ?? "Error consultando API");
    }
  }
);

const placesSlice = createSlice({
  name: "places",
  initialState: {
    items: [],
    loading: false,
    error: null,
    query: {
      location: "Barcelona",
      category: "attraction",
      keyword: "",
      source: "GooglePlaces",
    },
  },
  reducers: {
    setQuery(state, action) {
      state.query = { ...state.query, ...action.payload };
    },
    clearPlaces(state) {
      state.items = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaces.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error";
      });
  },
});

export const { setQuery, clearPlaces } = placesSlice.actions;
export default placesSlice.reducer;
