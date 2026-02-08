import { Bookmark, HandHeart, MessageCircle } from "lucide-react"

interface PostType {
    id: string,
    title: string,
    paragraph: string,
    img: string,
    createdAt: Date,
    tags: Array<string>,
    author: {
        id: string,
        username: string,
        img: string
    },
    commentcount: number,
    likecount: number
};

export const PostCard = ({ Post }: { Post: PostType }) => {
    const date = new Date(Post.createdAt);
    const formattedDate = date.toLocaleDateString("en-us", {
        month: "short",
        day: "numeric"
    });
    return (
        <article className="w-[70%] h-1/2 border border-border rounded-md px-3 font-sans flex  gap-4 items-center">
            <div className="flex flex-col flex-1 gap-3">
                <div className="flex gap-1">
                    <img src={Post.author.img} className="size-6 rounded-full" />
                    <h1>{Post.author.username}</h1>
                </div>
                <h1 className="text-3xl font-semibold tracking-tight">{Post.title}</h1>
                <p className="text-zinc-600 tracking-tight line-clamp-2">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vel fugit quaerat voluptates libero a omnis magni at quis perferendis non explicabo dicta maxime, repudiandae iusto? Commodi, nemo alias? Tenetur assumenda quam enim reprehenderit at nisi dolor amet deserunt natus exercitationem? Tempora explicabo similique dolor. Repellendus asperiores quae accusamus quibusdam maiores!</p>
                <div className="flex justify-between">
                    <div className="flex gap-2">
                        <div className="border border-zinc-200 rounded-full p-2">
                            <Bookmark className="size-4 text-zinc-500" />
                        </div>
                        <div className="border border-zinc-200 rounded-full p-2">
                            <HandHeart className="size-4 text-zinc-500" />
                        </div>
                    </div>
                    <div className="flex gap-3 items-center">
                        <h1>{formattedDate}</h1>
                        <div className="flex items-center gap-1">
                            <MessageCircle className="size-4" />
                            <h1>{Post.commentcount}</h1>
                        </div>
                    </div>
                </div>

            </div>
            <div className="">
                <img src={Post.img} className="size-36 rounded-sm object-cover" />
            </div>

        </article>
    )
};