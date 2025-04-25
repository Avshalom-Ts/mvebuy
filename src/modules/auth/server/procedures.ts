import { baseProcedure, createTRPCRouter } from "@/app/trpc/init";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders, cookies as getCookies } from "next/headers";
import { z } from "zod";
import { AUTH_COOKIE } from "../constants";

export const authRouter = createTRPCRouter({

    session: baseProcedure.query(async ({ ctx }) => {
        const headers = await getHeaders()

        const session = await ctx.db.auth({ headers })

        return session
    }),

    // Logout procedure
    logout: baseProcedure.mutation(async () => {
        const cookies = await getCookies()
        cookies.delete({
            name: AUTH_COOKIE,
        })
    }),
    // Register procedure
    register: baseProcedure
        .input(
            z.object({
                email: z.string().email(),
                password: z.string().min(3),
                // [username].mvebuy.com
                username: z
                    .string()
                    .min(3, 'Username must be at least 3 characters long')
                    .max(63, 'Username must be at most 63 characters long')
                    .regex(
                        /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
                        'Username can only contain lowercase letters, numbers and hypehns. It must start and end with a letter or number.',
                    )
                    .refine(
                        (val) => !val.includes('--'),
                        'Username cannot contain consecutive hyphens',
                    )
                    .transform((val) => val.toLowerCase()),
            })
        )
        .mutation(async ({ ctx, input }) => {
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
            z.object({
                email: z.string().email(),
                password: z.string()
            })
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