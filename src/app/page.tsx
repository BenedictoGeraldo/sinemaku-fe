import TrendingView from "@/views/landing/trending";
import TopRatedView from "@/views/landing/topRated";
import PopularView from "@/views/landing/popular";

export default function HomePage() {
  return (
    <>
      <TrendingView />
      <TopRatedView />
      <PopularView />
    </>
  );
}
