import { createBrowserRouter } from "react-router-dom";
import Layout from "@/shared/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import ContactPage from "@/pages/ContactPage";
import NotFoundPage from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "*", element: <NotFoundPage /> }
    ]
  }
]);
