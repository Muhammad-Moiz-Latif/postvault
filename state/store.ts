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
import setCommentReducer from "../features/posts/CommentsSlice";
import setLikeReducer from "../features/posts/LikesSlice";

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
const CommentsPersistConfig = {
  key: "Comments",
  storage,
};
const LikesPersistConfig = {
  key: "Likes",
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

const persistedCommentsReducer = persistReducer(
  CommentsPersistConfig,
  setCommentReducer,
);

const persistedLikesReducer = persistReducer(
  LikesPersistConfig,
  setLikeReducer,
);

// Store
export const store = configureStore({
  reducer: {
    UserInfo: persistedUserInfoReducer,
    UserPosts: persistedUserPostReducer,
    AllPost: persistedPostsReducer,
    AllComments: persistedCommentsReducer,
    AllLikes: persistedLikesReducer,
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
