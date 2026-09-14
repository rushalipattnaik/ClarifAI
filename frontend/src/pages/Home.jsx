import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import ProjectInput from "../components/home/ProjectInput";
import QuickExamples from "../components/home/QuickExamples";
import Features from "../components/home/Features";
import Footer from "../components/layout/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <Hero />

      <ProjectInput />

      <QuickExamples />

      <Features />

      <Footer />
    </div>
  );
}

export default Home;