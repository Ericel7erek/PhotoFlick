import * as z from "zod";

export const SignUpValidation = z.object({
  name: z.string().min(4, { message: "Too short" }).max(50),
  username: z.string().min(4, { message: "Too short" }).max(50),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const SignInValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const PostValidation = z.object({
  caption: z
    .string()
    .min(5, { message: "Must consist of at least 5 characters." })
    .max(2200),
  file: z.custom<File[]>(),
  location: z
    .string()
    .min(5, { message: "Must consist of at least 5 characters." })
    .max(100),
  tags: z.string(),
});
