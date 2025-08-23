import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth } from "@/auth";
import axios from "axios";

interface userData {
    username: string,
    email: string,
    image: string,
};

interface userState {
    list: userData;
};

const initialState: userState = {
    list: {
        username: "",
        email: "",
        image: ""
    }
};

export const setUserInfoAsync = createAsyncThunk(
    "User/Get", async ({ username, email }: { username: string, email: string }, { dispatch }) => {
        const session = await auth();
        if (session?.user) {
            dispatch(setUserInfo({
                username: session.user.name,
                email: session.user.email,
                image: session.user.image
            }));
            const body = {
                username, email
            }
            const response = await axios.post(`/api/getUser`, body);
            if (response.status === 200) {
                const body = response.data;
                dispatch(setUserInfo({
                    username: body.username,
                    email: body.email,
                    image: body.image
                }));
            }
        }
    },

)
export const userInfoSlice = createSlice({
    name: "userInfo",
    initialState,
    reducers: {
        setUserInfo(state, action) {
            state.list = action.payload
        }
    }
})

export const { setUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;