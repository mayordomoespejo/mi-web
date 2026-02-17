import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import { getEducation } from "../services/profileApi";

export default function Education() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["education"],
    queryFn: getEducation
  });

  return (
    <section className="education">
      <div className="page-header">
        <h1>{t("education.title")}</h1>
        <Button
          variant="secondary"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["education"] })}
        >
          {t("education.refresh")}
        </Button>
      </div>

      {isLoading && <p>{t("education.loading")}</p>}
      {isError && <p>{t("education.error")}</p>}
      {!isLoading && !isError && data?.length === 0 && (
        <p>{t("education.empty")}</p>
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
