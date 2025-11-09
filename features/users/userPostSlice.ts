import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface userPost {
  id: string; // API gives strings
  title: string;
  author_id: string;
  json_content: any; // or better: BlockNote JSON type
  html_content: string;
  created_at: string;
  updated_at: string;
}

interface userPostState {
  list: userPost[];
}

const initialState: userPostState = {
  list: [],
};

export const setUserPostAsync = createAsyncThunk(
  "Post/Get",
  async ({ email }: { email: string }, { dispatch }) => {
    const body = { email };
    const response = await axios.post("/api/features/getUserPost", body);
    if (response.status === 200) {
      dispatch(setUserPost(response.data.getData));
    }
  },
);

export const userPostSlice = createSlice({
  name: "userPost",
  initialState,
  reducers: {
    setUserPost(state, action) {
      state.list = action.payload;
    },
  },
});

export const { setUserPost } = userPostSlice.actions;
export default userPostSlice.reducer;
