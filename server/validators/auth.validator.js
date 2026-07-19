import { z } from "zod";

export const registerSchema = z.object({

  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name cannot exceed 50 characters"),


  email: z
    .email("Invalid email")
    .toLowerCase(),


  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid mobile number"),


  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /[A-Z]/,
      "Password must contain at least one uppercase letter"
    )
    .regex(
      /[a-z]/,
      "Password must contain at least one lowercase letter"
    )
    .regex(
      /[0-9]/,
      "Password must contain at least one number"
    )
    .regex(
      /[@$!%*?&#]/,
      "Password must contain at least one special character"
    ),

});