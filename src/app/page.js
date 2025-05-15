"use client";
import AboutSection from "@/components/V0_About_us";
import BestSelling from "@/components/V0_best_selling";
import Footer from "@/components/V0_footer";
import ProductCarousel from "@/components/V0_Products";
import PhotosSection from "@/components/V0_teams";
import Testimonials from "@/components/V0_testominals";
import { useGeneralSetting } from "@/context/general_setting";

export default function Home() {
  const { generalSetting, loading, error } = useGeneralSetting();

  if (loading) return <div className="text-center py-20">Loading...</div>;

  if (generalSetting?.maintenance_mode) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-red-600">Error 404</h1>
          <p className="text-lg text-muted-foreground">
            🚧 The website is currently under maintenance. Please check back
            later.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <section id="home" className="py-16 px-4 max-w-7xl mx-auto">
        <h1 className="text-5xl font-serif text-center mb-6">
          {generalSetting?.subtitle || "Discover Authentic Khokana Flavors"}
        </h1>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          {generalSetting?.description ||
            "Experience the taste of tradition with our handcrafted Titaura from Khokana's Women Group. Khona Paau enhances your shopping experience by making it effortless to purchase traditional products with just a few clicks."}
        </p>
        <section id="product">
          <ProductCarousel />
        </section>
      </section>

      <section id="about" className="py-28 bg-muted">
        <AboutSection />
      </section>

      <section id="best-selling" className="py-16 px-4 max-w-7xl mx-auto">
        <BestSelling />
      </section>

      <section id="photos" className="py-16 bg-muted">
        <PhotosSection />
      </section>

      <section id="review" className="py-16 px-4 max-w-7xl mx-auto">
        <Testimonials />
      </section>

      <section id="contact">
        <Footer />
      </section>
    </main>
  );
}
