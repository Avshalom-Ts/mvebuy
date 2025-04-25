import { caller } from "@/app/trpc/server"
import { SignUpView } from "@/modules/auth/ui/views/sign-up-view"
import { redirect } from "next/navigation"


const Page = async () => {
    const session = await caller.auth.session()
    
    if (session.user) {
        redirect("/")
    }
        
    return <SignUpView/>
}

export default Page