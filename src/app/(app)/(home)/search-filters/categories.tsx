import { CategoryDropdown } from "./category-dropdown"
import { CustomeCategory } from "../types"

interface Props{
    data:CustomeCategory[];
}

export const Categories = ({data}:Props) => {
    return (
        <div className="relative w-full">
            <div className="flex flex-nowrap items-center">
                {data.map((category)=>(
                    <div key={category.id}>
                        <CategoryDropdown
                            category={category}
                            isActive={false}
                            isNavigationHovered={false}
                            />
                    </div>
                ))}
            </div>
        </div>
    )
}