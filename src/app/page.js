import AboutSection from "@/components/V0_About_us";
import BestSelling from "@/components/V0_best_selling";
import Footer from "@/components/V0_footer";
import Navbar from "@/components/V0_Navbar";
import ProductCarousel from "@/components/V0_Products";
import PhotosSection from "@/components/V0_teams";
import Testimonials from "@/components/V0_testominals";

export default function Home() {
  return (
    <main className="min-h-screen">
      <section id="home" className="py-16 px-4 max-w-7xl mx-auto">
        <h1 className="text-5xl font-serif text-center mb-6">
          Discover Authentic Khokana Flavors
        </h1>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Experience the taste of tradition with our handcrafted Titaura from
          Khokana's Women Group. Khona Paau enhances your shopping experience by
          making it effortless to purchase traditional products with just a few
          clicks.
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
