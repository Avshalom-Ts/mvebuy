import { cookies as getCookies } from "next/headers";

interface Props {
    prefix: string
    value: string
}

export const generateAuthCookie = async ({ prefix, value }: Props) => {
    const cookies = await getCookies()
    cookies.set({
        name: `${prefix}-token`,
        value,
        httpOnly: true,
        path: '/',
        // TODO: Ensure cross-domain cookies sharing
        // domain: 'mvebuy.com', Initial cookie
        // antonio.mvebuy.com // cookie does not exist here
        // sameSite: 'none'
        // domain: 'mvebuy.com',
    })
}