import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface Like {
  user_id: number;
  post_id: number;
  claps: number;
}

interface LikeState {
  list: Like[];
}

const initialState: LikeState = {
  list: [],
};

export const setLikeAsync = createAsyncThunk(
  "Likes/Get",
  async ({ PostId }: { PostId: string }, { dispatch }) => {
    const response = await axios.post("/api/features/getLikes", { PostId });
    if (response.status === 200) {
      console.log("activate", response.data.AllLikes);
      dispatch(setLikes(response.data.AllLikes));
    }
  },
);

export const IncrementLikeAsync = createAsyncThunk(
  "Likes/Get",
  async (
    { UserId, PostId }: { UserId: string; PostId: string },
    { dispatch },
  ) => {
    const response = await axios.put("/api/features/updateLikes", {
      UserId,
      PostId,
    });
    if (response.status === 200) {
      dispatch(setUserLikes(response.data.UserLikes));
    }
  },
);

export const LikesSlice = createSlice({
  name: "userLike",
  initialState,
  reducers: {
    setLikes(state, action) {
      state.list = action.payload;
    },

    setUserLikes(state, action) {
      const { user_id, posts_id, claps } = action.payload;
      const like = state.list.find(
        (l) => l.user_id === Number(user_id) && l.post_id === Number(posts_id),
      );
      if (like) {
        like.claps = claps;
      } else {
        state.list.push({
          user_id: Number(user_id),
          post_id: Number(posts_id),
          claps: claps,
        });
      }
    },
  },
});

export const { setLikes, setUserLikes } = LikesSlice.actions;
export default LikesSlice.reducer;
