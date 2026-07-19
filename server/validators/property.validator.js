import { z } from "zod";

export const propertySchema = z.object({

  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters"),


  listingType: z.enum(
    ["rent", "buy"],
    {
      message: "Listing type is required",
    }
  ),


  propertyType: z.enum([
    "house",
    "apartment",
    "room",
    "villa",
    "shop",
    "office",
    "pg",
    "plot",
  ], {
    message: "Property type is required",
  }),


  price: z.coerce
    .number({
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be greater than 0"),


  area: z.coerce
    .number({
      invalid_type_error: "Area must be a number",
    })
    .positive("Area must be greater than 0"),


  address: z
    .string()
    .trim()
    .min(5, "Address is required"),


  city: z
    .string()
    .trim()
    .min(2, "City is required"),


  state: z
    .string()
    .trim()
    .min(2, "State is required"),


  description: z
    .string()
    .max(1000, "Description too long")
    .optional()
});