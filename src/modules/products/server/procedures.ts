import { baseProcedure, createTRPCRouter } from "@/app/trpc/init";


export const productsRouter = createTRPCRouter({



    getMany: baseProcedure.query(async ({ ctx }) => {

        const data = await ctx.db.find({
            collection: 'products',
            depth: 1, // Populate "category" field and "image" field
        })


        return data
    })
})