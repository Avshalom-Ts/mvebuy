import { Category } from "@/payload-types";

export type CustomeCategory = Category & {
    subcategories: Category[];
}