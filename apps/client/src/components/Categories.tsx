"use client";
import {
  Footprints,
  Glasses,
  Shirt,
  ShoppingBasket,
  Watch,
  Smartphone,
} from "lucide-react";
import { GiHoodie, GiSleevelessJacket } from "react-icons/gi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useGetCategoriesQuery } from "@/redux/categoryApi";
import Dock from "./Dock";
import { Zoomies } from 'ldrs/react'
import 'ldrs/react/Zoomies.css'
import MobileCategoryScroll from "./MobileCategoryScroll";


const iconMap: Record<string, React.ReactNode> = {
  "t-shirts": <Shirt className="w-4 h-4" />,
  shoes: <Footprints className="w-4 h-4" />,
  watches: <Watch className="w-4 h-4" />,
  jackets: <GiSleevelessJacket className="w-4 h-4" />,
  sunglasses: <Glasses className="w-4 h-4" />,
  phones: <Smartphone className="w-4 h-4" />,
  hoodies: <GiHoodie className="w-4 h-4" />,
};

const Categories = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { data: dbCategories = [], isLoading } = useGetCategoriesQuery();
  const selectedCategory = searchParams.get("category");

  const categories = useMemo(() => {
    const allCategory = {
      name: "All",
      slug: "all",
      icon: <ShoppingBasket className="w-4 h-4" />,
    };
    const dbCats = dbCategories.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
      icon: iconMap[cat.slug.toLowerCase()] || <ShoppingBasket className="w-4 h-4" />,
    }));
    return [allCategory, ...dbCats];
  }, [dbCategories])

  const handleChange = (value: string | null) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", value || "all");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const items = categories.map((category) => {
    const isActive =
      category.slug === selectedCategory || (!selectedCategory && category.slug === "all");
    return {
      icon: (
        <div className={`flex items-center gap-1 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
          {category.icon}
        </div>
      ),
      label: (
        <span className="text-xs text-popover-foreground">{category.name}</span>
      ),
      onClick: () => handleChange(category.slug),
      className: isActive ? "border-blue-600 dark:border-gray-500" : "border-border",
    };
  });

  if (isLoading) {
    return (
      <div className="mb-4">
        <div className="text-center text-gray-400">
        <Zoomies
          size="80"
          stroke="5"
          bgOpacity="0.1"
          speed="1.4"
          color="gray" 
        />
        </div>
      </div>
    );
  }

//   return (
//   <div className="relative w-full flex justify-center my-10">
//     <Dock
//       items={items}
//       panelHeight={56}
//       baseItemSize={44}
//       magnification={64}
//     />
//   </div>
// );


return (
  <div className="w-full flex flex-col gap-4 my-10">
    
    {/* Mobile */}
    <MobileCategoryScroll items={items} />

    {/* Desktop */}
    <div className="hidden md:flex justify-center my-10">
      <Dock
        items={items}
        panelHeight={56}
        baseItemSize={44}
        magnification={64}
      />
    </div>

  </div>
);
};

export default Categories;
