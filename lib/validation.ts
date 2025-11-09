import z from 'zod';


export const UserSignIn = z.object({
    username: z.string().min(6, { message: "Username should be atleast 6 characters long" }).max(35, { message: "Username exceeded max character limit" }),
    email: z.email({ message: "Please enter a valid email address" }),
    password: z.string()
        .min(6, { message: "Password must be at least 6 characters long" }),
    checkbox: z.boolean().refine(val => val === true, { message: "You must agree to the terms & conditions to Sign in" })
});

export type SignInFormData = z.infer<typeof UserSignIn>;

export const UserLogIn = z.object({
    email: z.email({ message: "Please enter a valid email address" }),
    password: z.string()
        .min(6, { message: "Password must be at least 6 characters long" })
});

export type LoginFormData = z.infer<typeof UserLogIn>;