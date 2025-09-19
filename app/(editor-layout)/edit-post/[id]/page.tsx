"use client";

import BlockEditor from "@/features/editor/components/BlockEditor";
import { RootState } from "@/state/store";
import { use } from "react";
import { useSelector } from "react-redux";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPost({ params }: EditPageProps) {
  const { id } = use(params);
  const allPosts = useSelector((state: RootState) => state.AllPost.list);
  const thePost = allPosts.find((post) => post.id.toString() === id);
  return (
    <div>
      <BlockEditor
        initialContent={thePost?.json_content} // ✅ load JSON
      />
    </div>
  );
}
