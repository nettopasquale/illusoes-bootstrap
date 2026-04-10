import { useState, useRef } from "react";
import { Card, Button, ButtonGroup, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ToolbarBotao({ onClick, titulo, children }) {
  return (
    <Button
      variant="outline-secondary"
      size="sm"
      onClick={onClick}
      titulo={titulo}
      style={{ fontSize: "0.8rem", padding: "2px 8px" }}
    >
      {children}
    </Button>
  );
}

export default function ForumPostEdicao({ onSubmit, quotedReply, onClearQuote, loading }) {
  const [conteudo, setConteudo] = useState("");
  const navigate = useNavigate();

    const wrapSelecao = (antes, depois = antes) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const comeco = ta.selectionStart;
      const fim = ta.selectionEnd;
      const selecionado = conteudo.slice(comeco, fim);
      const novoConteudo =
        conteudo.slice(0, comeco) +
        antes +
        selecionado +
        depois +
        conteudo.slice(fim);
      setConteudo(novoConteudo);
      setTimeout(() => {
        ta.focus();
        ta.setSelectionRange(comeco + antes.length, fim + antes.length);
      }, 0);
    };
  
    const inserirLinha = (prefixo) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const comeco = ta.selectionStart;
      const comecoLinha = conteudo.lastIndexOf("\n", comeco - 1) + 1;
      const novoConteudo =
        conteudo.slice(0, comecoLinha) +
        prefixo +
        conteudo.slice(comecoLinha);
      setConteudo(novoConteudo);
      setTimeout(() => ta.focus(), 0);
    };


  const handleSubmit = (e) => {
    if (!conteudo.trim()) return;
    onSubmit({
      conteudo: conteudo.trim(),
      postagemCitacaoId: postagemCitacao?._id || null,
      conteudoCitacao: postagemCitacao?.conteudo || null,
      nomeAutorCitacao: postagemCitacao?.autor?.nome || null,
    });
    setConteudo("");
  };

    const charCount = conteudo.length;
    const MAX = 5000;

  return (
    <Card className="border mt-4">
      <Card.Header className="d-flex align-items-center justify-content-between py-2 px-3">
        <span className="fw-semibold" style={{ fontSize: "0.9rem" }}>
          Sua resposta
        </span>
        <ButtonGroup size="sm">
          <ToolbarBotao onClick={() => wrapSelecao("**")} title="Negrito">
            <strong>N</strong>
          </ToolbarBotao>
          <ToolbarBotao onClick={() => wrapSelecao("*")} title="Itálico">
            <em>I</em>
          </ToolbarBotao>
          <ToolbarBotao onClick={() => wrapSelecao("`")} title="Código inline">
            {"</>"}
          </ToolbarBotao>
          <ToolbarBotao
            onClick={() => wrapSelecao("```\n", "\n```")}
            title="Bloco de código"
          >
            {"{ }"}
          </ToolbarBotao>
          <ToolbarBotao onClick={() => inserirLinha("- ")} title="Lista">
            ☰
          </ToolbarBotao>
          <ToolbarBotao
            onClick={() => {
              const url = window.prompt("URL do link:");
              const label = window.prompt("Texto do link:") || url;
              if (url) {
                const ta = textareaRef.current;
                const pos = ta.selectionStart;
                const link = `[${label}](${url})`;
                setConteudo(
                  conteudo.slice(0, pos) + link + conteudo.slice(pos),
                );
              }
            }}
            title="Link"
          >
            🔗
          </ToolbarBotao>
        </ButtonGroup>
      </Card.Header>

      <Card.Body className="p-3">
        {/* Preview da citação */}
        {postagemCitacao && (
          <div className="mb-3 p-2 rounded border-start border-3 border-primary bg-light d-flex justify-content-between align-items-start">
            <div>
              <p className="mb-1 text-muted" style={{ fontSize: "0.78rem" }}>
                Citando <strong>{postagemCitacao.autor?.nome}</strong>:
              </p>
              <p
                className="mb-0 text-secondary"
                style={{ fontSize: "0.82rem" }}
              >
                {postagemCitacao.conteudo.length > 150
                  ? postagemCitacao.conteudo.slice(0, 150) + "…"
                  : postagemCitacao.conteudo}
              </p>
            </div>
            <Button
              variant="link"
              size="sm"
              className="p-0 ms-2 text-danger"
              onClick={onClearQuote}
              title="Remover citação"
            >
              ✕
            </Button>
          </div>
        )}

        <Form.Control
          as="textarea"
          ref={textareaRef}
          rows={6}
          placeholder="Escreva sua resposta... (suporta markdown básico)"
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value.slice(0, MAX))}
          style={{
            resize: "vertical",
            fontSize: "0.9rem",
            fontFamily: "inherit",
          }}
        />

        <div className="d-flex justify-content-between align-items-center mt-2">
          <span
            className={`text-muted`}
            style={{
              fontSize: "0.75rem",
              color: charCount > MAX * 0.9 ? "red" : undefined,
            }}
          >
            {charCount}/{MAX} caracteres
          </span>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading || !conteudo.trim()}
          >
            {loading ? "Enviando..." : "Publicar resposta"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
