import { configureStore } from '@reduxjs/toolkit'
import setUserInfoReducer from './features/userInfoSlice'
// ...

export const store = configureStore({
  reducer: {
    setUserInfo : setUserInfoReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch