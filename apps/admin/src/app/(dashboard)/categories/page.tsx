import CategoriesTable from "@/components/CategoriesTable";

export default async function CategoriesPage() {
  return (
    <div className="w-full">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Categories</h1>
      </div>
      <CategoriesTable/>
    </div>
  );
}
