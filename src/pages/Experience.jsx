import { useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Tooltip from "../components/UI/Tooltip";
import { getExperience } from "../services/profileApi";

export default function Experience() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["experience"],
    queryFn: getExperience
  });

  return (
    <section className="experience">
      <div className="page-header">
        <h1>Experience</h1>
        <div className="experience__header-actions">
          <Tooltip label="TanStack Query simplifica la sincronización de datos con caché, refetch y estados de carga/error de forma declarativa.">
            ?
          </Tooltip>
          <Button
            variant="secondary"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["experience"] })}
          >
            Refrescar
          </Button>
        </div>
      </div>

      {isLoading && <p>Cargando experiencia...</p>}
      {isError && <p>Error al cargar experiencia.</p>}
      {!isLoading && !isError && data?.length === 0 && (
        <p>No hay experiencia disponible.</p>
      )}

      {!isLoading &&
        !isError &&
        data?.map((job) => (
          <Card key={job.id} className="experience__card">
            <h2>{job.company}</h2>
            <p className="muted">
              {job.role} · {job.location}
            </p>
            <p className="muted">
              {job.startDate} - {job.endDate}
            </p>
            <ul>
              {job.responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        ))}
    </section>
  );
}
