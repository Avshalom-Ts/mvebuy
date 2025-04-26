import { baseProcedure, createTRPCRouter } from "@/app/trpc/init";
import type { Where } from "payload";
import { z } from "zod";


export const productsRouter = createTRPCRouter({



    getMany: baseProcedure
        .input(
            z.object({
                category: z.string().nullable().optional(),

            })
        ).query(async ({ ctx, input }) => {
            const where: Where = {}

            if (input.category) {
                const categoriesData = await ctx.db.find({
                    collection: 'categories',
                    limit: 1,
                    pagination: false,
                    where: {
                        slug: {
                            equals: input.category,
                        }
                    }
                })

                const parentCategory = categoriesData.docs[0]

                if (parentCategory) {
                    where["category.slug"] = {
                        equals: parentCategory.slug,
                    }
                }
            }


            const data = await ctx.db.find({
                collection: 'products',
                depth: 1, // Populate "category" field and "image" field
                where
            })

            // Artificial delay to simulate a slow network
            // await new Promise((resolve) => setTimeout(resolve, 5000))

            return data
        })
})