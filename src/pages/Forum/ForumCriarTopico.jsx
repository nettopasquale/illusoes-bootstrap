import { useState, useContext } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Button,
  Badge,
  Breadcrumb,
  Alert,
  Row
} from "react-bootstrap";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import { AuthContext } from "../../context/AuthContext";
import { criarTopico} from "../../services/forumService";
import { toast } from "react-toastify";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import "./Forum.css";


const CATEGORIAS = [
  { value: "estrategia", label: "Estratégia", icon: "♟" },
  { value: "iniciante", label: "Iniciante", icon: "🌱" },
  { value: "meta", label: "Meta", icon: "📊" },
  { value: "trocas", label: "Trocas & Vendas", icon: "🔄" },
  { value: "regras", label: "Regras", icon: "📖" },
  { value: "torneio", label: "Torneios", icon: "🏆" },
  { value: "geral", label: "Geral", icon: "💬" },
  { value: "batepapo", label: "Bate-papo", icon: "☕" },
];

// Editor simples de markdown com toolbar
function EditorConteudo({ value, onChange }) {
  const wrap = (before, after = before) => {
    const ta = document.getElementById("topico-conteudo"); //ver aqui
    if (!ta) return;
    const s = ta.selectionStart;
    const e = ta.selectionEnd;
    const selected = value.slice(s, e);
    const next = value.slice(0, s) + before + selected + after + value.slice(e);
    onChange(next);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(s + before.length, e + before.length); }, 0);
  };

  const inserir = (text) => {
    const ta = document.getElementById("topico-conteudo"); //ver aqui
    const pos = ta ? ta.selectionStart : value.length;
    onChange(value.slice(0, pos) + text + value.slice(pos));
    setTimeout(() => ta?.focus(), 0);
  };
  
  const toolbarBtns = [
    { label: "N", title: "Negrito", action: () => wrap("**") },
    { label: "I", title: "Itálico", action: () => wrap("*"), italic: true },
    { label: "</>", title: "Código inline", action: () => wrap("`") },
    {
      label: "{ }",
      title: "Bloco de código",
      action: () => wrap("```\n", "\n```"),
    },
    { label: "☰", title: "Lista", action: () => inserir("\n- ") },
    { label: "—", title: "Separador", action: () => inserir("\n---\n") },
    {
      label: "🔗",
      title: "Link",
      action: () => {
        const url = window.prompt("URL:");
        const label = window.prompt("Texto do link:") || url;
        if (url) inserir(`[${label}](${url})`);
      },
    },
  ];
    return (
        <div className="border rounded-3 overflow-hidden">
        {/* Toolbar */}
        <div className="d-flex gap-1 p-2 border-bottom" style={{ background: "#f8f9fa", flexWrap: "wrap" }}>
            {toolbarBtns.map((btn) => (
            <button
                key={btn.title}
                type="button"
                className="btn btn-sm btn-outline-secondary py-0 px-2"
                title={btn.title}
                style={{ fontSize: "0.8rem", fontStyle: btn.italic ? "italic" : "normal" }}
                onClick={btn.action}
            >
                {btn.label}
            </button>
            ))}
        </div>

        {/* Textarea */}
        <Form.Control
            as="textarea"
            id="topico-conteudo"
            rows={12}
            placeholder={
            "Escreva o conteúdo do seu tópico aqui...\n\n" +
            "Dicas:\n" +
            "• Use **negrito** para destacar informações\n" +
            "• Use [texto](url) para adicionar links\n" +
            "• Use ``` para blocos de código\n" +
            "• Use --- para separadores"
            }
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
            resize: "vertical",
            fontSize: "0.92rem",
            fontFamily: "inherit",
            border: "none",
            borderRadius: 0,
            minHeight: 280,
            }}
        />

        {/* Contador */}
        <div
            className="px-3 py-1 border-top text-end text-muted"
            style={{ background: "#f8f9fa", fontSize: "0.72rem" }}
        >
            {value.length} / 10000 caracteres
        </div>
        </div>
    );
}

export default function ForumCriarTopico() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { usuario } = useContext(AuthContext);

  const defaultCategoria = searchParams.get("categoria") || "geral";

  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [categoria, setCategoria] = useState(defaultCategoria);
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  //
  const tagsArray = tags
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 5);

//
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !conteudo.trim()) {
      setErro("Preencha o título e o conteúdo do tópico.");
      return;
    }
    setLoading(true);
    setErro(null);
    try {
      const { data } = await criarTopico({
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        categoria,
        tags: tagsArray,
      });
      toast.success("Tópico criado com sucesso!")
      setTimeout(()=>navigate(`/forum`), 3000);
    } catch (err) {
      setErro(err.response?.data?.message || "Erro ao publicar tópico.");
      toast.error("Erro ao publicar tópico.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutGeral>
      <section className="forum-section">
        <Container fluid="lg">
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Fórum", to: "/forum" },
              { label: "Criar tópico", to: "/forum/topicos/criar" },
            ]}
          />

          {/* Header */}
          <div className="forum-page-header">
            <div>
              <h1 className="forum-page-title">Criar novo tópico</h1>
              <p className="forum-page-subtitulo">
                Escolha uma categoria e compartilhe com a comunidade
              </p>
            </div>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => navigate(`/forum/categoria/${categoria}/topicos`)}
            >
              ← Voltar
            </Button>
          </div>

          {/* ✅ erro renderizado só uma vez, com dismissible */}
          {erro && (
            <Alert
              variant="danger"
              onClose={() => setErro(null)}
              dismissible
              style={{ fontSize: "0.85rem" }}
            >
              {erro}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <div className="forum-form-card">
              {/* ── Categoria ── */}
              <Form.Group className="mb-4">
                <Form.Label>
                  Categoria <span className="text-danger">*</span>
                </Form.Label>
                {/* ✅ forum-categoria-btn agora no botão, não no wrapper */}
                <div className="d-flex flex-wrap gap-2 mt-1">
                  {CATEGORIAS.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategoria(cat.value)}
                      className={`forum-categoria-btn ${categoria === cat.value ? "ativo" : ""}`}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </Form.Group>

              {/* ── Título ── */}
              <Form.Group className="mb-4">
                <Form.Label>
                  Título <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Escreva um título claro e objetivo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value.slice(0, 200))}
                  style={{ fontSize: "0.95rem" }}
                />
                <Form.Text
                  className="text-muted"
                  style={{ fontSize: "0.72rem" }}
                >
                  {titulo.length}/200 caracteres
                </Form.Text>
              </Form.Group>

              {/* ── Conteúdo ── */}
              <Form.Group className="mb-4">
                <Form.Label>
                  Conteúdo <span className="text-danger">*</span>
                </Form.Label>
                <EditorConteudo value={conteudo} onChange={setConteudo} />
              </Form.Group>

              {/* ── Tags ── */}
              <Form.Group className="mb-1">
                <Form.Label>
                  Tags{" "}
                  <span
                    className="text-muted fw-normal"
                    style={{ fontSize: "0.8rem" }}
                  >
                    (opcional, separadas por vírgula)
                  </span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ex: deck, combo, budget"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  style={{ fontSize: "0.88rem" }}
                />
                {tagsArray.length > 0 && (
                  <div className="d-flex gap-1 mt-2 flex-wrap">
                    {tagsArray.map((tag) => (
                      <Badge
                        key={tag}
                        bg="light"
                        text="secondary"
                        className="border fw-normal"
                        style={{ fontSize: "0.72rem" }}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <Form.Text
                  className="text-muted"
                  style={{ fontSize: "0.72rem" }}
                >
                  Máximo de 5 tags
                </Form.Text>
              </Form.Group>
            </div>

            {/* ── Ações ── */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <Button
                variant="outline-secondary"
                size="sm"
                type="button"
                onClick={() =>
                  navigate(`/forum/categoria/${categoria}/topicos`)
                }
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="px-4"
                disabled={loading || !titulo.trim() || !conteudo.trim()}
                style={{
                  background: "var(--cor-destaque)",
                  border: "none",
                  minWidth: 140,
                }}
              >
                {loading ? "Publicando..." : "Publicar tópico"}
              </Button>
            </div>
          </Form>
        </Container>
      </section>
    </LayoutGeral>
  );
}
