import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler, useFieldArray } from "react-hook-form";
import z from "zod"
import { useBlocker } from "react-router";
import { useDraftPost } from "../queries/useDraftPost";
import { ToastContainer, toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { usePublishPost } from "../queries/usePublishPost";

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
        <div className="font-sans p-3 overflow-x-hidden relative">
            <ToastContainer
                position='top-center'
                closeOnClick
                draggable
                hideProgressBar={true}
            />
            <h1 className="text-3xl tracking-tight">Create your post</h1>
            {errorMessage && <h1 className="text-destructive font-sans text-sm tracking-tight my-1 text-center">{errorMessage}</h1>}
            <form className="w-full max-w-xl flex flex-col"
                onSubmit={handleSubmit(onSubmit)}

            >

                {/* ENTER TITLE */}
                <input
                    type="text"
                    {...register("title")}
                    className="w-full h-9 rounded-md outline-none p-2 text-sm tracking-tight border border-border mb-2"
                    placeholder="Enter a title"
                />
                {errors.title && <h1 className="text-red-500 mb-2 mt-0.5 text-xs tracking-tight">{errors.title.message}</h1>}

                {/* ENTER PARAGRAPH */}
                <textarea
                    rows={5}
                    {...register("paragraph")}
                    className="w-full rounded-md outline-none p-2 text-sm tracking-tight border border-border mb-2"
                    placeholder="Enter your paragraph"
                />
                {errors.paragraph && <h1 className="text-red-500 mb-2 mt-0.5 text-xs tracking-tight">{errors.paragraph.message}</h1>}

                {/* SELECT IMAGE */}
                <div className="flex mb-1.5">
                    <label htmlFor="profile-picture" className="cursor-pointer">
                        <div className="w-96 h-40 rounded-md bg-muted flex items-center justify-center border-2 border-border hover:border-primary transition-all">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover rounded-md" />
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
                    className="w-full rounded-md outline-none p-2 text-sm tracking-tight border border-border mb-2"
                    placeholder="Press Enter to add tags"
                />

                <div className="flex flex-wrap gap-2 mb-2">
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="bg-muted px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                            {field.value}
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                {errors.tags && (
                    <p className="text-destructive text-xs mb-2">
                        {errors.tags.message}
                    </p>
                )}

                {/* SUBMIT BUTTON */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-primary text-primary-foreground hover:cursor-pointer w-full h-9 rounded-[6px] disabled:opacity-50 font-sans text-sm font-medium hover:bg-primary/90 transition"
                >
                    {isPending ? "Creating.." : "Create Post"}
                </button>
            </form>

            {blocker.state === 'blocked' && (
                <ConfirmDialog onSave={onSave} onCancel={onCancel} onDiscard={onDiscard} isPending={DraftPending}/>
            )}
        </div>
    )
};

