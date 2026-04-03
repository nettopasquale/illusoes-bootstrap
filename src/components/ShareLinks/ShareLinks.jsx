import { Dropdown, Button, DropdownMenu } from "react-bootstrap";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
  RedditShareButton,
  RedditIcon,
  XShareButton,
  XIcon,
} from "react-share";
import { toast } from "react-toastify";

export default function ShareLinks({url, title}){
  const copiarLink = async () => {
    await navigator.clipboard.writeText(url);
    toast.success("Link copiado!");
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-secondary" size="sm">
        Compartilhar
      </Dropdown.Toggle>

      <Dropdown.Menu className="p-3 d-flex flex-column gap-2">
        <FacebookShareButton url={url} quote={title}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        <WhatsappShareButton url={url} title={title}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>

        <TelegramShareButton url={url} title={title}>
          <TelegramIcon size={32} round />
        </TelegramShareButton>

        <RedditShareButton url={url} title={title}>
          <RedditIcon size={32} round />
        </RedditShareButton>

        <XShareButton url={url} title={title}>
          <XIcon size={32} round />
        </XShareButton>

        <Button size="sm" variant="outline-dark" onClick={copiarLink}>
          Copiar link
        </Button>
      </Dropdown.Menu>
    </Dropdown>
  );
};
