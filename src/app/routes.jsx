import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Home from "../pages/Home";
import Experience from "../pages/Experience";
import Education from "../pages/Education";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "experience", element: <Experience /> },
      { path: "education", element: <Education /> },
      { path: "contact", element: <Contact /> },
      { path: "*", element: <NotFound /> }
    ]
  }
]);
