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
  async (_arg, { dispatch }) => {
    const response = await axios.get("/api/features/getLikes");
    if (response.status === 200) {
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
      const { UserId, PostId, newClaps } = action.payload;
      const like = state.list.find(
        (l) => l.user_id === Number(UserId) && l.post_id === Number(PostId),
      );
      if (like) {
        like.claps = newClaps;
      } else {
        state.list.push({
          user_id: Number(UserId),
          post_id: Number(PostId),
          claps: newClaps,
        });
      }
    },
  },
});

export const { setLikes, setUserLikes } = LikesSlice.actions;
export default LikesSlice.reducer;
