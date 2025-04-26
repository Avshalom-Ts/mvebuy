
interface Props{
    params:Promise< {
        category: string,
        subcategory: string
    }>
}

const page = async ({params}:Props) => {
  const {category, subcategory} = await params;
  
    return (
    <div>
      Category: {category} / {subcategory}
    </div>
  )
}

export default page