"use client";

import EditorNav from "@/components/EditorNav";
import BlockEditor from "@/features/editor/components/BlockEditor";
import { RootState } from "@/state/store";
import axios from "axios";
import { use, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPost({ params }: EditPageProps) {
  const { id } = use(params);
  const [whichOne] = useState(false);
  const allPosts = useSelector((state: RootState) => state.AllPost.list);
  const thePost = allPosts.find((post) => post.id.toString() === id);
  const [isLoading, setLoading] = useState(false);
  const getUser = useSelector((state: RootState) => state.UserInfo.list);
  const [editor, setEditor] = useState<any>(null);

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

  const handleUpdate = async () => {
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

      const res = await axios.put("/api/features/updateBlog", {
        html,
        json,
        username: getUser.username,
        postId: id,
      });

      if (res.status === 200) {
        console.log(res.data.message);
        toast.success("Blog has been updated!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <EditorNav
        whichOne={whichOne}
        Loading={isLoading}
        onPublish={handleUpdate}
      />
      <div className="pt-16">
        <BlockEditor
          initialContent={thePost?.json_content}
          onReady={setEditor} // ✅ load JSON
        />
      </div>
    </div>
  );
}
