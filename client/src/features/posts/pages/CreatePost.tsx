import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod"

const PostSchema = z.object({
    title: z.string().min(10, "Title must be at least 10 characters").max(30, "Title cannot be longer than 30 characters"),
    paragraph: z.string().min(20, "Paragraph must be at least 20 characters"),
    image: z.instanceof(FileList)
        .refine(files => files.length > 0, "Please select an image for your post")
        .refine(files => files.length > 0 && files[0].size < 10_000_000, "Image must be less than 10MB")
        .refine(files => files.length > 0 && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(files[0].type), "Only JPEG, PNG, GIF, and WEBP formats are supported"),
    tags: z.array(z.string()).min(1, "At least one tag is required").max(5, "Only 5 tags can be defined")
});

type PostSchemaType = z.infer<typeof PostSchema>;

export const CreatePost = () => {
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const { register, handleSubmit, reset, formState: { errors }, watch } = useForm({
        resolver: zodResolver(PostSchema)
    });

    const profilePicture = watch("image");

    useEffect(() => {
        if (!profilePicture || profilePicture.length === 0) {
            setPreviewUrl("");
            return;
        }

        const file = profilePicture[0];
        const objectURL = URL.createObjectURL(file);
        setPreviewUrl(objectURL);

        return () => URL.revokeObjectURL(objectURL);
    }, [profilePicture]);

    const onSubmit: SubmitHandler<PostSchemaType> = (data) => {

    };

    return (
        <div className="font-sans p-3 overflow-x-hidden">
            <h1 className="text-3xl tracking-tight">Create your post</h1>
            <form className="w-full max-w-xl flex flex-col" onSubmit={handleSubmit(onSubmit)}>

                {/* ENTER TITLE */}
                <input
                    type="text"
                    {...register("title")}
                    className="w-full h-9 rounded-md outline-none p-2 text-sm tracking-tight border border-border"
                    placeholder="Enter a title"
                />
                {errors.title && <h1 className="text-red-500 mb-2 mt-0.5 text-xs tracking-tight">{errors.title.message}</h1>}

                {/* ENTER PARAGRAPH */}
                <textarea
                    rows={5}
                    {...register("paragraph")}
                    className="w-full rounded-md outline-none p-2 text-sm tracking-tight border border-border"
                    placeholder="Enter you paragraph"
                />
                {errors.paragraph && <h1 className="text-red-500 mb-2 mt-0.5 text-xs tracking-tight">{errors.paragraph.message}</h1>}

                {/* SELECT IMAGE */}
                <div className="flex  mb-1.5">
                    <label htmlFor="profile-picture" className="cursor-pointer">
                        <div className="w-96 h-40 rounded-md bg-muted flex items-center justify-center border-2 border-border hover:border-primary transition-all">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-xl">📷</div>
                            )}
                        </div>
                        <input
                            {...register("image")}
                            id="profile-picture"
                            type="file"
                            accept="image/*"
                            className="hidden"
                        />
                    </label>
                </div>
                {errors.image && <p className="text-destructive text-xs text-center mb-2 mt-0.5 font-sans">{errors.image.message}</p>}

                {/* SELECT TAGS */}
                <textarea
                    rows={5}
                    {...register("paragraph")}
                    className="w-full rounded-md outline-none p-2 text-sm tracking-tight border border-border"
                    placeholder="Enter you paragraph"
                />
                {errors.tags && <h1 className="text-red-500 mb-2 mt-0.5 text-xs tracking-tight">{errors.tags.message}</h1>}

                {/* SUBMIT BUTTON */}
                <button
                    type="submit"
                    // disabled={isPending}
                    className="bg-primary text-primary-foreground hover:cursor-pointer w-full h-9 rounded-[6px] disabled:opacity-50 font-sans text-sm font-medium hover:bg-primary/90 transition"
                >
                    {/* {isPending ? "Creating account..." : "Create account"} */}
                    Create Post
                </button>
            </form>
        </div>
    )
}