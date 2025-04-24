import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { SearchFilterSkeleton, SearchFilters } from "./search-filters";
import { getQueryClient, trpc } from '@/app/trpc/server';
import { Suspense } from 'react';

interface Props {
    children: React.ReactNode;
}

const layout = async ({ children }: Props) => {
    const queryClient = getQueryClient();

    void queryClient.prefetchQuery(
    trpc.categories.getMany.queryOptions(),
  );

    
    return (
    <div className="flex flex-col min-h-screen">
        <Navbar/>
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<SearchFilterSkeleton/>}>
                <SearchFilters/>
            </Suspense>
        </HydrationBoundary>
        <div className="flex-1 bg-[#F4F4F0]">
            {children}
        </div>
        <Footer/>
    </div>
    );
};

export default layout;
