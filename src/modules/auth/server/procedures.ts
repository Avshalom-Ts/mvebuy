import { baseProcedure, createTRPCRouter } from "@/app/trpc/init";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders } from "next/headers";
import { loginSchema, registerSchema } from "../schemas";
import { generateAuthCookie } from "../utils";

export const authRouter = createTRPCRouter({

    session: baseProcedure.query(async ({ ctx }) => {
        const headers = await getHeaders()

        const session = ctx.db.auth({ headers })

        return session
    }),
    // Register procedure
    register: baseProcedure
        .input(
            registerSchema
        )
        .mutation(async ({ ctx, input }) => {
            const existingData = await ctx.db.find({
                collection: 'users',
                limit: 1,
                where: {
                    username: { equals: input.username },
                    email: { equals: input.email }
                }
            })

            const existingUser = existingData.docs[0]

            if (existingUser) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: 'Username already exists',
                })
            }

            await ctx.db.create({
                collection: 'users',
                data: {
                    email: input.email,
                    username: input.username,
                    password: input.password, // This will be hashed by the auth package
                },
            })
            // Log the user in after registration
            const data = await ctx.db.login({
                collection: 'users',
                data: {
                    email: input.email,
                    password: input.password,
                }
            })

            if (!data.token) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'Invalid email or password',
                })
            }

            await generateAuthCookie({
                prefix: ctx.db.config.cookiePrefix,
                value: data.token,
            })

        }),
    // Login procedure
    login: baseProcedure
        .input(
            loginSchema
        )
        .mutation(async ({ ctx, input }) => {
            const data = await ctx.db.login({
                collection: 'users',
                data: {
                    email: input.email,
                    password: input.password,
                }
            })

            if (!data.token) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'Invalid email or password',
                })
            }

            await generateAuthCookie({
                prefix: ctx.db.config.cookiePrefix,
                value: data.token,
            })

            return data;
        })

})