import Home from "./pages/Home";
import Navbar from "@/components/navbar";
import CursorGlow from "@/components/cursorGlow";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory">
        <Home />
      </main>
      <CursorGlow />

    </>
  );
}

