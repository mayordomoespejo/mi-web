import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="site-shell">
      <Navbar />
      <main className="container main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
