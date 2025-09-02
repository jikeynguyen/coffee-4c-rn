import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "Vui lòng nhập họ"),
    lastName: z.string().min(1, "Vui lòng nhập tên"),
    email: z.string().email("Email không hợp lệ"),
    phone: z
      .string()
      .min(10, "Số điện thoại phải có ít nhất 10 số")
      .regex(/^\+?[0-9\s-]+$/, "Số điện thoại không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Xác nhận mật khẩu không khớp"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export type RegisterForm = z.infer<typeof registerSchema>;
