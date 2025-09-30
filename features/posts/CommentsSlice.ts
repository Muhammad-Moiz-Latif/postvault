import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface Comment {
  id: number;
  comment: string;
  username: string;
  image: string;
  created_at: string;
  user_id: number;
  post_id: number;
}

interface CommentState {
  list: Comment[];
}

const initialState: CommentState = {
  list: [],
};

export const setCommentAsync = createAsyncThunk(
  "Comments/Get",
  async ({ PostId }: { PostId: string }, { dispatch }) => {
    const response = await axios.post("/api/features/getComments", { PostId });
    if (response) {
      dispatch(setComments(response.data.getUserComments));
    }
  },
);

export const CommentsSlice = createSlice({
  name: "userComments",
  initialState,
  reducers: {
    setComments(state, action) {
      state.list = action.payload;
    },
  },
});

export const { setComments } = CommentsSlice.actions;
export default CommentsSlice.reducer;
