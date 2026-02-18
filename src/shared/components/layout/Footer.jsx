import { memo } from "react";
import { useTranslation } from "react-i18next";

/**
 * Page footer with copyright and author name.
 */
const Footer = memo(function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>{t("footer.credit", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
});

export default Footer;
