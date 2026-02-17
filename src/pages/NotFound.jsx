import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../components/UI/Button";

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="notfound">
      <h1>404</h1>
      <p>{t("notFound.message")}</p>
      <Button onClick={() => navigate("/")}>{t("notFound.backHome")}</Button>
    </section>
  );
}
