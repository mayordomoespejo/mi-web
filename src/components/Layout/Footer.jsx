import { useTranslation } from "react-i18next";

/**
 * Pie de página con copyright y nombre del autor.
 * @returns {JSX.Element}
 */
export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>© {new Date().getFullYear()} {t("footer.author")}</p>
      </div>
    </footer>
  );
}
