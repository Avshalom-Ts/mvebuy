import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { ChevronRightIcon, ChevronsLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/app/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CategoriesGetManyOutput, CategoriesGetManyOutputSingle } from "@/modules/categories/types";

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const CategoriesSidebar = ({open,onOpenChange}:Props) => {
    const trpc = useTRPC()
    const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions())
    
    const router = useRouter()

    const [parentCategories, setParentCategories] = useState<CategoriesGetManyOutput| null>(null)
    const [selectedCategory, setSelectedCategory] = useState<CategoriesGetManyOutputSingle | null>(null)

    // If we have parent categories, Show those, oterewise show the root categories
    const currentCategories = parentCategories ?? data ?? [];

    const handleOpenChange = (open: boolean) => {
        setSelectedCategory(null)
        setParentCategories(null)
        onOpenChange(open)
    }

    const handleCategoryClick = (category: CategoriesGetManyOutputSingle) => {
        if (category.subcategories && category.subcategories.length > 0) {
            setParentCategories(category.subcategories as CategoriesGetManyOutput)
            setSelectedCategory(category)
        } else {
            // This is a leaf category (no subcategories)
            if(parentCategories && selectedCategory){
                // This is a subcategory, navigate to /category/subcategory
                router.push(`${selectedCategory.slug}/${category.slug}`)
            }else{
                // This is a main category, navigate to /category
                if(category.slug === 'all'){
                    router.push('/')
                }else{
                    router.push(`/${category.slug}`)
                }
            }
            handleOpenChange(false)
        }
    }

    const handleBackClick = () => {
        if (parentCategories) {
            setParentCategories(null)
            setSelectedCategory(null)
        }
    }

    const backgroundColor = selectedCategory?.color || 'white'

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent
            side="left"
            className="p-0 transition-none"
            style={{backgroundColor}}
            >
                <SheetHeader className="p-4 border-b">
                    <SheetTitle>
                        Categories
                    </SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
                    {parentCategories && (
                        <button
                        onClick={handleBackClick}
                        className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer"
                        >
                            <ChevronsLeftIcon className="size-4 mr-2" />
                            Back
                        </button>
                    )}
                    {currentCategories.map((category) => (
                        <button
                        key={category.slug}
                        className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between text-base font-medium cursor-pointer"
                        onClick={()=> {handleCategoryClick(category)}}
                        >
                            {category.name}
                            {category.subcategories && category.subcategories.length > 0 && (
                                <ChevronRightIcon className="size-4"/>
                            )}

                        </button>
                    ))}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}