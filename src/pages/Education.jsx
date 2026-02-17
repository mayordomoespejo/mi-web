import { useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import { getEducation } from "../services/profileApi";

export default function Education() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["education"],
    queryFn: getEducation
  });

  return (
    <section className="education">
      <div className="page-header">
        <h1>Education</h1>
        <Button
          variant="secondary"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["education"] })}
        >
          Refrescar
        </Button>
      </div>

      {isLoading && <p>Cargando formación...</p>}
      {isError && <p>Error al cargar formación.</p>}
      {!isLoading && !isError && data?.length === 0 && (
        <p>No hay formación disponible.</p>
      )}

      {!isLoading &&
        !isError &&
        data?.map((item) => (
          <Card key={item.id} className="education__card">
            <h2>{item.title}</h2>
            <p>{item.center}</p>
            <p className="muted">{item.dates}</p>
          </Card>
        ))}
    </section>
  );
}
