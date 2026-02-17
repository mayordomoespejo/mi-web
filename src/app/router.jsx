import { createBrowserRouter } from "react-router-dom";
import Layout from "@/shared/components/layout/Layout";
import HomePage from "@/features/home/pages/HomePage";
import ContactPage from "@/features/contact/pages/ContactPage";
import NotFoundPage from "@/features/not-found/pages/NotFoundPage";

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
