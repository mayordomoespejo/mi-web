import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Modal from "../components/UI/Modal";
import { copyToClipboard } from "../utils/clipboard";
import { CONTACT_LINKS } from "../utils/constants";

export default function Contact() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await copyToClipboard(CONTACT_LINKS.emailAddress);
      toast.success("Email copiado");
    } catch {
      toast.error("No se pudo copiar el email");
    }
  };

  return (
    <section className="contact">
      <h1>Contact</h1>
      <Card className="contact__card">
        <a href={CONTACT_LINKS.email} target="_blank" rel="noreferrer">
          Email
        </a>
        <a href={CONTACT_LINKS.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={CONTACT_LINKS.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </Card>

      <div className="contact__actions">
        <Button onClick={handleCopyEmail}>Copiar email</Button>
        <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
          Abrir modal
        </Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Contacto">
        <p>
          Email:{" "}
          <a href={CONTACT_LINKS.email} target="_blank" rel="noreferrer">
            {CONTACT_LINKS.emailAddress}
          </a>
        </p>
      </Modal>
    </section>
  );
}
