'use client'


import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel,FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { registerSchema } from "../../schemas"
import Link from "next/link"
import { Poppins } from "next/font/google"
import { cn } from "@/lib/utils"
import { useTRPC } from "@/app/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


const poppins = Poppins({
    subsets: ['latin'],
    weight: ['700'],
})



export const SignUpView = () => {
    const router = useRouter()


    const trpc = useTRPC()
    const queryClient = useQueryClient()
    const register = useMutation(trpc.auth.register.mutationOptions({
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess:async () => {
            toast.success("Account created successfully")
            await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
            router.push('/')
        }
    }))
    
    const form = useForm<z.infer<typeof registerSchema>>({
        mode: "all",
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            username: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof registerSchema>) => {
        // console.log("🚀 ~ onSubmit ~ values:", values)
        register.mutate(values)
        
    }

    const username = form.watch('username')
    // Show the errors if was touched
    const usernameErrors = form.formState.errors.username

    const showPreview = username && !usernameErrors;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto">
                <Form {...form}>
                    <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-8 p-4 lg:p-16" 
                    >
                        <div className="flex items-center justify-between mb-8">
                            <Link href='/'>
                                <span className={cn(
                                    'text-2xl font-semibold', poppins.className
                                )}>
                                    MVEBUY
                                </span>
                            </Link>
                            <Button
                            asChild
                            variant='ghost'
                            size='sm'
                            className='text-base border-none underline'
                            >
                                <Link prefetch href='/sign-in'>
                                    Sign In
                                </Link>
                            </Button>
                        </div>
                        <h1 className="text-4xl font-medium text-center">
                            Join over 1720 creators earning money with MVEBUY.
                        </h1>
                        <FormField
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Username
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription
                                    className={cn(
                                        'hidden', showPreview && 'block'
                                    )}
                                    >
                                        Your store will be available at&nbsp;
                                        {/* TODO: Use proper method to generate preview url */}
                                        <strong>{username}</strong>.mvebuy.com
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" />
                                    </FormControl>
                                    
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button
                        disabled={register.isPending}
                        type="submit"
                        size='lg'
                        variant='elevated'
                        className="bg-black text-white hover:bg-pink-400 hover:text-primary"
                        >
                            Create Account
                        </Button>
                    </form>
                </Form>

            </div>
            <div 
            className="h-screen w-full lg:col-span-2 hidden lg:block"
            style={{
                backgroundImage: "url('/images/Capitol-Sunset.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                // filter: "blur(2px)",
                // WebkitFilter: "blur(2px)"
            }}
            />
        </div>
    )
}