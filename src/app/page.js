"use client";
import About_us from "@/components/About_us";
import Home_comp from "@/components/Home_comp";
import Nav_bar from "@/components/Nav_bar";
import Products from "@/components/Products";
import Review from "@/components/Review";
import Teams from "@/components/Teams";

export default function Home() {
  return (
    <div className="">
      <main className="">
        <Nav_bar />
        <Home_comp />
        <Products />
        <Teams />
        <About_us />
        <Review />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
