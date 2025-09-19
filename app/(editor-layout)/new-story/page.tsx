// app/(editorLayout)/new-story/page.tsx
"use client";

import { useState } from "react";
import BlockEditor from "@/features/editor/components/BlockEditor";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import axios from "axios";
import EditorNav from "@/components/EditorNav";

export default function NewStoryPage() {
  const [editor, setEditor] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  const getUser = useSelector((state: RootState) => state.UserInfo.list);

  function extractImages(blocks: any[]): { url: string; blockIndex: number }[] {
    const images: { url: string; blockIndex: number }[] = [];
    blocks.forEach((block, i) => {
      if (block.type === "image" && block.props?.url) {
        images.push({ url: block.props.url, blockIndex: i });
      }
    });
    return images;
  }

  async function uploadBlobToCloudinary(blobUrl: string) {
    const blob = await fetch(blobUrl).then((r) => r.blob());
    const file = new File([blob], "upload.png", { type: blob.type });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "next_cloudinary");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dnev5lyb8/image/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return res.data.secure_url;
  }

  const handlePublish = async () => {
    if (!editor) return;
    const json = editor.document;
    const images = extractImages(json);

    try {
      setLoading(true);
      for (const image of images) {
        if (image.url.startsWith("blob")) {
          const checkUrl = await uploadBlobToCloudinary(image.url);
          json[image.blockIndex].props.url = checkUrl;
        }
      }

      const html = await editor.blocksToFullHTML(editor.document);

      const res = await axios.post("/api/features/uploadBlog", {
        html,
        json,
        username: getUser.username,
      });

      if (res.status === 200) {
        console.log(res.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen">
      <EditorNav onPublish={handlePublish} Loading={isLoading} />
      <div className="pt-16">
        <BlockEditor onReady={setEditor} />
      </div>
    </div>
  );
}
