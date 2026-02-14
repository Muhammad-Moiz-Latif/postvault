import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler, useFieldArray } from "react-hook-form";
import z from "zod"
import { useBlocker, useNavigate } from "react-router";
import { useDraftPost } from "../queries/useDraftPost";
import { ToastContainer, toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { usePublishPost } from "../queries/usePublishPost";
import { ArrowLeft, Loader2, X } from "lucide-react";

const PostSchema = z.object({
    title: z.string().min(10, "Title must be at least 10 characters").max(30, "Title cannot be longer than 30 characters"),
    paragraph: z.string().min(20, "Paragraph must be at least 20 characters"),
    image: z.instanceof(FileList)
        .refine(files => files.length > 0, "Please select an image for your post")
        .refine(files => files.length > 0 && files[0].size < 10_000_000, "Image must be less than 10MB")
        .refine(files => files.length > 0 && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(files[0].type), "Only JPEG, PNG, GIF, and WEBP formats are supported"),
    tags: z.array(z.object({ value: z.string() })).min(1, "At least one tag is required").max(5, "Only 5 tags can be defined")
});

export type PostSchemaType = z.infer<typeof PostSchema>;

export const CreatePost = () => {
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState("");
    const queryClient = useQueryClient();
    const { mutate: PublishPost, isPending } = usePublishPost();
    const { mutate: SaveDraft, isPending: DraftPending } = useDraftPost();
    const navigate = useNavigate();
    const { register, handleSubmit, control, reset, getValues, formState: { errors, isDirty }, watch } = useForm<PostSchemaType>({
        resolver: zodResolver(PostSchema),
        defaultValues: {
            title: "",
            paragraph: "",
            tags: []
        }
    });

    // Watch form values to check if there's actual content
    const formValues = watch();

    const hasContent = () => {
        return (
            (formValues.title && formValues.title.trim().length > 0) ||
            (formValues.paragraph && formValues.paragraph.trim().length > 0) ||
            (formValues.image && formValues.image.length > 0) ||
            (formValues.tags && formValues.tags.length > 0)
        );
    };

    const blocker = useBlocker(({ currentLocation, nextLocation }) =>
        isDirty && hasContent() && currentLocation.pathname !== nextLocation.pathname
    );

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

    const onSubmit: SubmitHandler<PostSchemaType> = (data) => {
        setErrorMessage(""); // Clear previous errors
        PublishPost(data, {
            onSuccess: (response) => {
                if (response.success) {
                    toast.success(response.message);
                    queryClient.invalidateQueries({ queryKey: ["all-posts"] });
                    setPreviewUrl("");
                    reset();
                }
            },
            onError: (error: any) => {
                setErrorMessage(error.response.data.message);
                console.error("Signup error in component:", error);
            }
        })
    };

    function onSave() {
        const currentFormData = getValues();
        SaveDraft(currentFormData, {
            onSuccess: (response) => {
                if (response.success) {
                    blocker.proceed?.();
                }
            },
            onError: (error: any) => {
                toast.error('Failed to save draft');
                console.error("Signup error in component:", error.response.data.message);
            }
        })
    };

    function onCancel() {
        blocker.reset?.();
    };

    function onDiscard() {
        blocker.proceed?.();
    };

    return (
        <div className="min-h-screen bg-background">
            <ToastContainer position="top-center" hideProgressBar />

            {/* Sticky Header */}
            <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span>Back</span>
                    </button>

                    <button
                        type="submit"
                        form="post-form"
                        disabled={isPending}
                        className="px-5 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Publishing...
                            </>
                        ) : "Publish Post"}
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">

                {/* Error Message */}
                {errorMessage && (
                    <div className="mb-8 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                        <p className="text-sm text-destructive">{errorMessage}</p>
                    </div>
                )}

                <form
                    id="post-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    {/* Cover Image */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground block">
                            Cover Image <span className="text-muted-foreground font-normal">(optional)</span>
                        </label>

                        <label
                            htmlFor="profile-picture"
                            className="block border-2 border-dashed border-border rounded-lg hover:border-muted-foreground transition-colors cursor-pointer overflow-hidden"
                        >
                            <div className="h-64 flex items-center justify-center bg-muted/30">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center text-muted-foreground">
                                        <div className="mx-auto mb-3 p-3 rounded-full bg-muted w-fit">
                                            {/* <Image size={24} /> */}
                                        </div>
                                        <p className="text-sm font-medium">Click to upload cover image</p>
                                        <p className="text-xs mt-1">PNG, JPG up to 10MB</p>
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

                        {errors.image && (
                            <p className="text-xs text-destructive">
                                {errors.image.message}
                            </p>
                        )}
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label htmlFor="title" className="sr-only">
                            Title
                        </label>
                        <input
                            {...register("title")}
                            id="title"
                            placeholder="Title"
                            className="w-full text-4xl md:text-5xl font-bold text-foreground placeholder:text-muted-foreground/40 outline-none bg-transparent border-none p-0"
                        />
                        {errors.title && (
                            <p className="text-xs text-destructive">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* Body */}
                    <div className="space-y-2">
                        <label htmlFor="paragraph" className="sr-only">
                            Body
                        </label>
                        <textarea
                            rows={15}
                            {...register("paragraph")}
                            id="paragraph"
                            placeholder="Tell your story..."
                            className="w-full text-lg leading-relaxed text-foreground placeholder:text-muted-foreground/40 outline-none resize-none bg-transparent border-none p-0"
                        />
                        {errors.paragraph && (
                            <p className="text-xs text-destructive">
                                {errors.paragraph.message}
                            </p>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-border my-12" />

                    {/* Tags */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-foreground block">
                            Tags <span className="text-muted-foreground font-normal">(up to 5)</span>
                        </label>

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
                            placeholder="Type a tag and press Enter"
                            className="w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground transition-shadow"
                        />

                        {fields.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-muted text-foreground rounded-full text-sm"
                                    >
                                        <span>{field.value}</span>
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="text-muted-foreground hover:text-destructive transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {errors.tags && (
                            <p className="text-xs text-destructive">
                                {errors.tags.message}
                            </p>
                        )}
                    </div>
                </form>
            </div>

            {blocker.state === 'blocked' && (
                <ConfirmDialog
                    onSave={onSave}
                    onCancel={onCancel}
                    onDiscard={onDiscard}
                    isPending={DraftPending}
                />
            )}
        </div>
    );

};

