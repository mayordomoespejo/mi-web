import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Modal from "../components/UI/Modal";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import { getProfileSummary } from "../services/profileApi";

export default function Home() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profileSummary"],
    queryFn: getProfileSummary
  });

  return (
    <section className="home">
      <div className="home__hero">
        <h1>Miguel Mayordomo</h1>
        <p>Desarrollador Frontend / Mobile</p>
      </div>

      <div className="home__actions">
        <Button onClick={() => navigate("/experience")}>Ver Experiencia</Button>
        <Button variant="secondary" onClick={() => navigate("/education")}>
          Ver Formación
        </Button>
        <Button variant="ghost" onClick={() => setIsModalOpen(true)}>
          Contactar
        </Button>
      </div>

      <Card className="home__stack">
        <h2>Stack principal</h2>
        {isLoading && <p>Cargando stack...</p>}
        {isError && <p>No se pudo cargar el resumen.</p>}
        {!isLoading && !isError && (
          <div className="chips">
            {data?.stack?.map((item) => (
              <span className="chip" key={item}>
                {item}
              </span>
            ))}
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Contactar"
      >
        <p>
          Escríbeme a{" "}
          <a href="mailto:miguelmayordomoespejo@gmail.com">
            miguelmayordomoespejo@gmail.com
          </a>
        </p>
      </Modal>
    </section>
  );
}
