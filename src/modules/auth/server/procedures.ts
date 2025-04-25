import { baseProcedure, createTRPCRouter } from "@/app/trpc/init";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders, cookies as getCookies } from "next/headers";
import { AUTH_COOKIE } from "../constants";
import { loginSchema, registerSchema } from "../schemas";

export const authRouter = createTRPCRouter({

    session: baseProcedure.query(async ({ ctx }) => {
        const headers = await getHeaders()

        const session = ctx.db.auth({ headers })

        return session
    }),

    // Logout procedure
    logout: baseProcedure.mutation(async () => {
        const cookies = await getCookies()
        cookies.delete(AUTH_COOKIE)
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

            const cookies = await getCookies()
            cookies.set({
                name: AUTH_COOKIE,
                value: data.token,
                httpOnly: true,
                path: '/',
                // TODO: Ensure cross-domain cookies sharing
                // domain: 'mvebuy.com', Initial cookie
                // antonio.mvebuy.com // cookie does not exist here
                // sameSite: 'none'
                // domain: 'mvebuy.com',
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

            const cookies = await getCookies()
            cookies.set({
                name: AUTH_COOKIE,
                value: data.token,
                httpOnly: true,
                path: '/',
                // TODO: Ensure cross-domain cookies sharing
                // domain: 'mvebuy.com', Initial cookie
                // antonio.mvebuy.com // cookie does not exist here
                // sameSite: 'none'
                // domain: 'mvebuy.com',
            })

            return data;
        })

})