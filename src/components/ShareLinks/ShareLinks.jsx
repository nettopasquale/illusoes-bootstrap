import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

import {
  FacebookShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  RedditShareButton,
  XShareButton,
  FacebookIcon,
  WhatsappIcon,
  TelegramIcon,
  RedditIcon,
  XIcon,
} from "react-share";

export default function ShareLinks({ url, title }) {
  const [aberto, setAberto] = useState(false);

  const fecharModal = () => {
    setAberto(false);
  };

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(url);

      toast.success("Link copiado!");
      fecharModal();
    } catch {
      toast.error("Erro ao copiar link.");
    }
  };

  const handleShare = () => {
    // pequeno delay para não conflitar com popup
    setTimeout(() => {
      fecharModal();
    }, 100);
  };

  return (
    <>
      {/* Botão */}
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => setAberto(true)}
      >
        Compartilhar
      </Button>

      {/* Modal */}
      <Modal show={aberto} onHide={fecharModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Compartilhar conteúdo</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Ícones */}
          <div className="d-flex flex-wrap gap-3 justify-content-center mb-4">
            <div onClick={handleShare}>
              <FacebookShareButton url={url} quote={title}>
                <FacebookIcon size={42} round />
              </FacebookShareButton>
            </div>

            <div onClick={handleShare}>
              <WhatsappShareButton url={url} title={title}>
                <WhatsappIcon size={42} round />
              </WhatsappShareButton>
            </div>

            <div onClick={handleShare}>
              <TelegramShareButton url={url} title={title}>
                <TelegramIcon size={42} round />
              </TelegramShareButton>
            </div>

            <div onClick={handleShare}>
              <RedditShareButton url={url} title={title}>
                <RedditIcon size={42} round />
              </RedditShareButton>
            </div>

            <div onClick={handleShare}>
              <XShareButton url={url} title={title}>
                <XIcon size={42} round />
              </XShareButton>
            </div>
          </div>

          {/* Copiar link */}
          <div className="d-grid">
            <Button variant="dark" onClick={copiarLink}>
              Copiar link
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
