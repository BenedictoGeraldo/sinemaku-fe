import Navbar from "@/components/navbar";
import TrendingView from "@/views/landing/trending";
import TopRatedView from "@/views/landing/topRated";
import PopularView from "@/views/landing/popular";
import Footer from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <TrendingView />
      <TopRatedView />
      <PopularView />
      <Footer />
    </>
  );
}
