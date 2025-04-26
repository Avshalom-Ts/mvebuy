'use client';

import { useTRPC } from "@/app/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const ProductsList = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.products.getMany.queryOptions());

    return (
        <div>
            {JSON.stringify(data)}
        </div>
    )
}

export const ProductsListSkeleton = () => {
    return (
        <div>
            Loading...
        </div>
    )
}