import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import WelcomeScreen from "../components/WelcomeScreen";

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <>
      <RouterProvider router={router} />
      {showWelcome ? <WelcomeScreen onContinue={() => setShowWelcome(false)} /> : null}
    </>
  );
}
