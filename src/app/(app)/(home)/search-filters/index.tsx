import { CustomeCategory } from "../types";
import { Categories } from "./categories";
import { SearchInput } from "./search-input";

interface Props {
    data: CustomeCategory[];
}

export const SearchFilters = ({data}:Props) => {
    return(
        <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4">
            <SearchInput />
            <Categories data={data}/>
        </div>
    )
}