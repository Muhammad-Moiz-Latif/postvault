import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface userData {
  username: string;
  email: string;
  image: string;
  id: string;
}

interface userState {
  list: userData;
}

const initialState: userState = {
  list: {
    username: "",
    email: "",
    image: "",
    id: "",
  },
};

export const setUserInfoAsync = createAsyncThunk(
  "User/Get",
  async ({ email }: { email: string }, { dispatch }) => {
    const body = { email };
    const response = await axios.post(`/api/features/getUser`, body);
    if (response.status === 200) {
      const body = response.data.getData;
      console.log(response.data.getData);
      dispatch(
        setUserInfo({
          username: body.username,
          email: body.email,
          image: body.image,
          id: body.id,
        }),
      );
    }
  },
);
export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo(state, action) {
      state.list = action.payload;
    },

    UserLogout(state) {
      return initialState;
    },
  },
});

export const { setUserInfo, UserLogout } = userInfoSlice.actions;
export default userInfoSlice.reducer;
