import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Modal from "../components/UI/Modal";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import { getProfileSummary } from "../services/profileApi";

export default function Home() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profileSummary"],
    queryFn: getProfileSummary
  });

  return (
    <section className="home">
      <div className="home__hero">
        <h1>{t("common.brandName")}</h1>
        <p>{t("home.role")}</p>
      </div>

      <div className="home__actions">
        <Button onClick={() => navigate("/experience")}>{t("home.viewExperience")}</Button>
        <Button variant="secondary" onClick={() => navigate("/education")}>
          {t("home.viewEducation")}
        </Button>
        <Button variant="ghost" onClick={() => setIsModalOpen(true)}>
          {t("home.contact")}
        </Button>
      </div>

      <Card className="home__stack">
        <h2>{t("home.stackTitle")}</h2>
        {isLoading && <p>{t("home.loadingStack")}</p>}
        {isError && <p>{t("home.stackError")}</p>}
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
        title={t("home.modalTitle")}
      >
        <p>
          {t("home.writeMe")}{" "}
          <a href="mailto:miguelmayordomoespejo@gmail.com">
            miguelmayordomoespejo@gmail.com
          </a>
        </p>
      </Modal>
    </section>
  );
}
