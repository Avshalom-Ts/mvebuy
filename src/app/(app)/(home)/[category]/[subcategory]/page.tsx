import { getQueryClient,trpc } from "@/app/trpc/server";
import { ProductsList, ProductsListSkeleton } from "@/modules/products/ui/components/product-list";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props{
    params:Promise< {
        subcategory: string
    }>
}

const page = async ({ params }:Props) => {
  const { subcategory } = await params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({
    category: subcategory
  }));
  
    return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ProductsListSkeleton />}>
          <ProductsList category={subcategory}/>
        </Suspense>
      </HydrationBoundary>
    </div>
  )
}

export default page