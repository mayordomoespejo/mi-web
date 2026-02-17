import { Outlet } from "react-router-dom";
import WaveBars from "./WaveBars";
import SteppedPanel from "./SteppedPanel";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="site-shell">
      <WaveBars />
      <div className="container">
        <SteppedPanel />
      </div>
      <main className="container main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
