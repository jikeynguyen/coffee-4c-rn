import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Vui lòng nhập email hoặc số điện thoại")
    .refine(
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      },
      { message: "Vui lòng nhập đúng định dạng email hoặc số điện thoại" }
    ),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginForm = z.infer<typeof loginSchema>;
