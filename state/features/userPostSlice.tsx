import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface userPost {
  id: number;
  json_content: string;
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
      const body = response.data.getData;
      dispatch(
        setUserPost({
          id: body.id,
          json_content: body.json_content,
          html_content: body.html_content,
          created_at: body.created_at,
          updated_at: body.updated_at,
        }),
      );
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
