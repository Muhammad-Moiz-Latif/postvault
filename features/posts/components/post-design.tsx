import { RootState } from "@/state/store";
import { Roboto } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

interface PostType {
  id: string;
  heading?: string;
  url?: string;
  paragraph?: string;
  createdAt?: string;
  username?: string;
  image?: string;
}

const roboto = Roboto({
  weight: ["400", "700", "600", "500"],
  subsets: ["latin"],
});

export default function PostFeed() {
  const Posts = useSelector((state: RootState) => state.AllPost.list);
  //   const Users = useSelector((state : RootState)=>state.);
  const [postCards, setPostCards] = useState<PostType[]>([]);

  function truncateText(text: string, maxLength: number) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "…";
  }

  const router = useRouter();

  useEffect(() => {
    if (!Posts || Posts.length === 0) return;

    const extractedPosts: PostType[] = [];

    Posts.forEach((post: any) => {
      console.log(post);
      const json = post.json_content;
      const dataObj: PostType = {
        id: post.id,
        username: post.username,
        image: post.image,
      };
      let headingFound = false;
      let paragraphFound = false;
      const date = new Date(post.created_at);
      const day = date.getDate(); // 👉 16
      const month = date.toLocaleString("en-GB", { month: "short" }); // 👉 "Sept"
      const formatted = `${day} ${month}`;
      dataObj.createdAt = formatted;
      json?.forEach((block: any) => {
        // 1️⃣ Heading
        if (block.type === "heading" && !headingFound) {
          dataObj.heading =
            block.content?.map((c: any) => c.text).join(" ") || "";
          headingFound = true;
          return;
        }

        // 2️⃣ Image
        if (block.type === "image" && !dataObj.url) {
          dataObj.url = block.props?.url;
        }

        // 3️⃣ Paragraph or subheading
        if (
          headingFound &&
          !paragraphFound &&
          (block.type === "paragraph" || block.type === "heading")
        ) {
          dataObj.paragraph =
            block.content?.map((c: any) => c.text).join(" ") || "";
          paragraphFound = true;
        }
      });

      extractedPosts.push(dataObj);
    });

    setPostCards(extractedPosts);
  }, [Posts]);

  return (
    <div
      className={`max-w-3xl ${roboto.className} border-x-[1px] border-sky-100`}
    >
      {postCards.map((post) => (
        <div
          key={post.id}
          className="bg-white border-b-[1px] border-sky-100 p-6 cursor-pointer flex gap-4"
          onClick={() => router.push(`/home/${post.id}`)} // 🧭 Replace with navigation later
        >
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
              <img src={post.image} className="rounded-full size-6" />
              <h1 className="text-sm text-black">{post.username}</h1>
            </div>
            <h1 className="text-3xl font-bold leading-7">{post.heading}</h1>
            <p className="text-gray-600 text-lg leading-5">
              {
                //@ts-ignore
                truncateText(post.paragraph, 100)
              }
            </p>
            <h2 className="text-zinc-600 text-sm ">{post.createdAt}</h2>
          </div>
          <img src={post.url} className="w-60 h-36 object-cover rounded-sm" />
        </div>
      ))}
    </div>
  );
}
