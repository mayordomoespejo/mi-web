import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Modal from "../components/UI/Modal";
import { copyToClipboard } from "../utils/clipboard";
import { CONTACT_LINKS } from "../utils/constants";

export default function Contact() {
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
    <section className="contact">
      <h1>{t("contact.title")}</h1>
      <Card className="contact__card">
        <a href={CONTACT_LINKS.email} target="_blank" rel="noreferrer">
          {t("contact.email")}
        </a>
        <a href={CONTACT_LINKS.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={CONTACT_LINKS.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </Card>

      <div className="contact__actions">
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
  );
}
