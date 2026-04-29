import Image from "next/image";
import Topbar from "@/components/common/topbar";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import Banner from "@/components/common/homepage/Banner";
import Counter from "@/components/common/homepage/counter";
import Vision from "@/components/common/homepage/Vision";
import OurDistribution from "@/components/common/homepage/OurDistribution";
import ProductGuide from "@/components/common/homepage/ProductGuide";
import Cards from "@/components/common/homepage/Cards";
import AbouttTuk from "@/components/common/homepage/AboutTuk";
import ProductCategories from "@/components/common/homepage/ProductCategories";
import Arrivals from "@/components/common/homepage/Arrivals";
import FeaturedProducts from "@/components/common/homepage/FeaturedProducts";

export default function Home() {
  return (
    <>
      <Header />
      <Banner />
      <Counter />
      <ProductCategories />
      <Arrivals />
      <FeaturedProducts />
      <AbouttTuk />
      <Vision />
      <OurDistribution />
      <ProductGuide />
      <Cards />
      <Footer />
    </>
  );
}
