import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface Post {
  id: number;
  json_content: string;
  html_content: string;
  created_at: string;
  updated_at: string;
  username: string;
  image: string;
}

interface PostState {
  list: Post[];
}

const initialState: PostState = {
  list: [],
};

export const setPostAsync = createAsyncThunk(
  "Posts/Get",
  async (_arg, { dispatch }) => {
    const response = await axios.get("/api/features/getPosts");
    if (response.status === 200) {
      dispatch(setPosts(response.data.getData));
    }
  },
);

export const PostsSlice = createSlice({
  name: "userPost",
  initialState,
  reducers: {
    setPosts(state, action) {
      state.list = action.payload;
    },
  },
});

export const { setPosts } = PostsSlice.actions;
export default PostsSlice.reducer;
