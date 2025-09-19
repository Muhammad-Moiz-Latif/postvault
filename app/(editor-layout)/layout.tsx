// DashboardLayout.tsx
"use client";

import EditorNav from "@/components/EditorNav";
import BlockEditor from "@/features/editor/components/BlockEditor";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [editor, setEditor] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  const getUser = useSelector((state: RootState) => state.setUserInfo.list);

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
          console.log(checkUrl);
          json[image.blockIndex].props.url = checkUrl;
        }
      }

      // ✅ await the conversion
      const html = await editor.blocksToFullHTML(editor.document);

      const res = await axios.post("api/features/uploadBlog", {
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
    <SessionProvider>
      <EditorNav onPublish={handlePublish} />
      <div className="w-full h-screen pt-16">
        <h1 className="absolute right-10 top-10 z-20">
          {isLoading ? "Publishing" : ""}
        </h1>
        <BlockEditor onReady={setEditor} />
      </div>
      {children}
    </SessionProvider>
  );
}
