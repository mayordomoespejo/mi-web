import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "@/shared/components/ui/Button";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="not-found-page">
      <h1>404</h1>
      <p className="not-found-page__message">{t("notFound.message")}</p>
      <Button onClick={() => navigate("/")}>{t("notFound.backHome")}</Button>
    </section>
  );
}
