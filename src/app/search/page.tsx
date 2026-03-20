import SearchView from "@/views/search";
import Footer from "@/components/footer";

type SearchPageProps = {
  searchParams: Promise<{ query?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { query = "" } = await searchParams;
  return (
    <>
      <SearchView query={query} />
      <Footer />
    </>
  );
}
