import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler, useFieldArray } from "react-hook-form";
import z from "zod"
import { useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { useDetailedPost } from "../../posts/queries/useDetailedPost";
import { useEditPost } from "../queries/useEditPost";

const PostSchema = z.object({
    title: z.string().min(10, "Title must be at least 10 characters").max(60, "Title cannot be longer than 60 characters"),
    paragraph: z.string().min(20, "Paragraph must be at least 20 characters"),
    image: z.instanceof(FileList)
        .refine(files => files.length === 0 || files[0].size < 10_000_000, "Image must be less than 10MB")
        .refine(files => files.length === 0 || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(files[0].type), "Only JPEG, PNG, GIF, and WEBP formats are supported")
        .optional(),
    tags: z.array(z.object({ value: z.string() })).min(1, "At least one tag is required").max(5, "Only 5 tags can be defined"),
    postId: z.string()
});

export type PostSchemaType = z.infer<typeof PostSchema>;

export const EditPost = () => {
    const params = useParams();
    const postId = params.postId;
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState("");
    const { mutate: EditPost, isPending } = useEditPost(postId as string);
    const { data } = useDetailedPost(postId as string);
    const post = data?.data;

    const { register, handleSubmit, control, reset, formState: { errors }, watch } = useForm<PostSchemaType>({
        resolver: zodResolver(PostSchema)
    });


    const { fields, append, remove } = useFieldArray({
        control,
        name: 'tags'
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

    useEffect(() => {
        if (!post) return;

        reset({
            title: post.title,
            paragraph: post.paragraph,
            tags: post.tags.map(tag => ({ value: tag })),
            postId: post.id,
        });

        setPreviewUrl(post.img); // show existing image
    }, [post, reset]);


    const onSubmit: SubmitHandler<PostSchemaType> = (data) => {
        setErrorMessage(""); // Clear previous errors
        EditPost(data, {
            onSuccess: (response) => {
                if (response.success) {
                    toast.success("Edits saved successfully!");
                    setPreviewUrl("");
                    reset();
                }
            },
            onError: (error: any) => {
                setErrorMessage("Could not save edits");
                console.error("Signup error in component:", error);
            }
        })
    };

    return (
        <div className="font-sans p-6 overflow-x-hidden relative">
            <ToastContainer
                position='top-center'
                closeOnClick
                draggable
                hideProgressBar={true}
            />
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-2">Edit your story</h1>
                {errorMessage && <div className="text-destructive font-sans text-sm mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">{errorMessage}</div>}
                <form className="w-full flex flex-col space-y-10"
                    onSubmit={handleSubmit(onSubmit)}

                >

                    {/* SECTION: POST DETAILS */}
                    <div className="space-y-6">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans">
                            Post Details
                        </p>

                        {/* ENTER TITLE */}
                        <div className="space-y-2">
                            <input
                                type="text"
                                {...register("title")}
                                className="w-full text-2xl md:text-3xl font-serif font-bold bg-card border border-border/60 px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all hover:border-border/80"
                                placeholder="Title"
                            />
                            {errors.title && <p className="text-destructive text-xs font-sans">{errors.title.message}</p>}
                        </div>

                        {/* ENTER PARAGRAPH */}
                        <div className="space-y-2">
                            <textarea
                                rows={14}
                                {...register("paragraph")}
                                className="w-full text-lg leading-relaxed bg-card border border-border/60 px-5 py-5 rounded-xl outline-none resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all font-sans hover:border-border/80"
                                placeholder="Tell your story..."
                            />
                            {errors.paragraph && <p className="text-destructive text-xs font-sans">{errors.paragraph.message}</p>}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

                    {/* SECTION: COVER IMAGE */}
                    <div className="space-y-4">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans">
                            Cover Image
                        </p>

                        <label
                            htmlFor="profile-picture"
                            className="group block border-2 border-dashed border-border/60 rounded-2xl hover:border-primary/40 transition-all cursor-pointer overflow-hidden"
                        >
                            <div className="h-72 flex items-center justify-center bg-card group-hover:bg-card/80 transition-colors">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                                ) : (
                                    <div className="text-center text-muted-foreground px-6">
                                        <p className="text-sm font-medium font-sans">
                                            Click to upload cover image
                                        </p>
                                        <p className="text-xs mt-2 font-sans">
                                            PNG, JPG, GIF, WEBP up to 10MB
                                        </p>
                                    </div>
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

                        {errors.image && <p className="text-destructive text-xs font-sans">{errors.image.message}</p>}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

                    {/* SECTION: TAGS */}
                    <div className="space-y-6">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans">
                            Categorization
                        </p>

                        <input
                            type="text"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();

                                    const value = e.currentTarget.value.trim();
                                    if (!value) return;
                                    if (fields.length >= 5) return;

                                    append({ value });
                                    e.currentTarget.value = "";
                                }
                            }}
                            className="w-full px-5 py-4 border border-border/60 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card transition-all font-sans hover:border-border/80"
                            placeholder="Type a tag and press Enter"
                        />

                        {fields.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="flex items-center gap-2 px-3.5 py-2 bg-accent text-foreground rounded-full text-sm font-sans ring-1 ring-primary/20"
                                    >
                                        <span>{field.value}</span>
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="text-muted-foreground hover:text-destructive transition-colors"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {errors.tags && (
                            <p className="text-destructive text-xs font-sans">
                                {errors.tags.message}
                            </p>
                        )}
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="flex gap-3 pt-6">
                        <button
                            type="submit"
                            disabled={isPending || !post}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-background rounded-full text-sm font-semibold font-sans hover:shadow-lg disabled:opacity-50 transition-all"
                        >
                            {!post ? "Loading..." : isPending ? (post.status === "PUBLISHED" ? "Saving..." : "Publishing...") : (post.status === "PUBLISHED" ? "Save Changes" : "Publish Story")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

