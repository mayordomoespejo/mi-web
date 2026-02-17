import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Button from "@/shared/components/ui/Button";
import Card from "@/shared/components/ui/Card";
import Modal from "@/shared/components/ui/Modal";
import { CONTACT_LINKS } from "@/core/constants";
import { copyToClipboard } from "@/shared/lib/clipboard";

export default function ContactPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  const handleCopyEmail = async () => {
    try {
      await copyToClipboard(CONTACT_LINKS.emailAddress);
      toast.success(t("contact.copySuccess"));
    } catch {
      toast.error(t("contact.copyError"));
    }
  };

  return (
    <div className="container">
      <section className="contact-page">
        <h1>{t("contact.title")}</h1>
        <Card className="contact-page__card">
          <a href={CONTACT_LINKS.email} target="_blank" rel="noreferrer">
            {t("contact.email")}
          </a>
          <a href={CONTACT_LINKS.github} target="_blank" rel="noreferrer">
            {t("contact.github")}
          </a>
          <a href={CONTACT_LINKS.linkedin} target="_blank" rel="noreferrer">
            {t("contact.linkedin")}
          </a>
        </Card>

        <div className="contact-page__actions">
          <Button onClick={handleCopyEmail}>{t("contact.copyEmail")}</Button>
          <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
            {t("contact.openModal")}
          </Button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={t("contact.modalTitle")}
        >
          <p>
            {t("contact.emailLabel")}{" "}
            <a href={CONTACT_LINKS.email} target="_blank" rel="noreferrer">
              {CONTACT_LINKS.emailAddress}
            </a>
          </p>
        </Modal>
      </section>
    </div>
  );
}
