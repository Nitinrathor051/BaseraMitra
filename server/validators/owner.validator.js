import { z } from "zod";

export const ownerSchema = z.object({
  profileImage: z.string().min(1, "Profile image is required"),

  address: z.string().min(5, "Address is required"),

  city: z.string().min(2, "City is required"),

  state: z.string().min(2, "State is required"),

  pincode: z
    .string()
    .regex(/^[0-9]{6}$/, "Invalid pincode"),

  ownerType: z.enum([
    "individual",
    "broker",
    "builder",
  ]),

  about: z.string().optional(),
});