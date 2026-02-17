import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Tooltip from "../components/UI/Tooltip";
import { getExperience } from "../services/profileApi";

export default function Experience() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["experience"],
    queryFn: getExperience
  });

  return (
    <section className="experience">
      <div className="page-header">
        <h1>{t("experience.title")}</h1>
        <div className="experience__header-actions">
          <Tooltip label={t("experience.tooltip")}>
            ?
          </Tooltip>
          <Button
            variant="secondary"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["experience"] })}
          >
            {t("experience.refresh")}
          </Button>
        </div>
      </div>

      {isLoading && <p>{t("experience.loading")}</p>}
      {isError && <p>{t("experience.error")}</p>}
      {!isLoading && !isError && data?.length === 0 && (
        <p>{t("experience.empty")}</p>
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
