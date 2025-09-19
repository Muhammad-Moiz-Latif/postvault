import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import setUserInfoReducer from "../features/users/userInfoSlice";
import setUserPostReducer from "../features/users/userPostSlice";
import setPostReducer from "../features/posts/PostsSlice";

// Configs
const userInfoPersistConfig = {
  key: "userInfo",
  storage,
};

const userPostPersistConfig = {
  key: "userPost",
  storage,
};
const PostsPersistConfig = {
  key: "Posts",
  storage,
};
// Wrap each reducer
const persistedUserInfoReducer = persistReducer(
  userInfoPersistConfig,
  setUserInfoReducer,
);
const persistedUserPostReducer = persistReducer(
  userPostPersistConfig,
  setUserPostReducer,
);

const persistedPostsReducer = persistReducer(
  PostsPersistConfig,
  setPostReducer,
);

// Store
export const store = configureStore({
  reducer: {
    UserInfo: persistedUserInfoReducer,
    UserPosts: persistedUserPostReducer,
    AllPost: persistedPostsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
