import Carousel from "@/components/Carousel";
import ProductList from "@/components/ProductList";

const Homepage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category: string, sort:string, search:string }>;
}) => {
  const category = (await searchParams).category;
  const sort = (await searchParams).sort;
  const search = (await searchParams).search;

  return (
    <div className=""> 
    <Carousel/>
      <ProductList category={category} sort={sort} search={search} params="homepage"/>
    </div>
  );
};

export default Homepage;
