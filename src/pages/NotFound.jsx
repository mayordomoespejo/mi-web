import { useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <section className="notfound">
      <h1>404</h1>
      <p>Página no encontrada.</p>
      <Button onClick={() => navigate("/")}>Volver a Home</Button>
    </section>
  );
}
