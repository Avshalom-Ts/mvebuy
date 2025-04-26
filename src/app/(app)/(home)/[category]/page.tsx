import { getQueryClient,trpc } from "@/app/trpc/server";
import { ProductsList, ProductsListSkeleton } from "@/modules/products/ui/components/product-list";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props{
    params:Promise< {
        category: string
    }>
}

const page = async ({}:Props) => {

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.products.getMany.queryOptions());
  
    return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ProductsListSkeleton />}>
          <ProductsList />
        </Suspense>
      </HydrationBoundary>
    </div>
  )
}

export default page