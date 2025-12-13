"use client"
import { Search, SearchIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Input } from "./ui/input"

const SearchBar = () => {
  const [value,setValue] = useState("")
  const searchParams  = useSearchParams()
  const router = useRouter();

  const handleSearch = (value:string)=>{
    const params = new URLSearchParams(searchParams);
    params.set("search", value);
    router.push(`/products?${params.toString()}`, {scroll:false})
  }
  return (
    <div className='relative'>
      {/* <Search className="w-4 h-4 text-gray-500"/> */}
      <Input 
      id="search" 
      placeholder="Search..." 
      className="peer h-8 ps-8 pe-2"
      onChange={e=>setValue(e.target.value)}
      onKeyDown={e=>{
        if(e.key === "Enter"){
          handleSearch(value)
        }
      }}/>
      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
        <SearchIcon size={16} />
      </div>
    </div>
  )
}

export default SearchBar