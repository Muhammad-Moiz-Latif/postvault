'use client';

import Post from "@/features/posts/components/post-design";
import { setUserInfo } from "@/features/users/userInfoSlice";
import { RootState } from "@/state/store";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const PostsData = useSelector((state: RootState) => state.AllPost.list);
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadSession() {
      const { useSession } = await import("next-auth/react");
      const { data } = useSession();
      setSession(data);
    }
    loadSession();
  }, []);

  useEffect(() => {
    if (session?.user) {
      dispatch(
        setUserInfo({
          username: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }),
      );
    }
  }, [session]);

  return (
    <div className="py-13 px-10">
      <Post />
    </div>
  );
}
