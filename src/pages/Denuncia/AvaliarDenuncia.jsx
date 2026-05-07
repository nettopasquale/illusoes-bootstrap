import { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Card,
  Badge,
  Spinner,
  Alert,
  Button,
  Form,
} from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import {
  listarTodasDenuncias,
  avaliarDenuncia,
} from "../../services/denunciasService";
import "./Denuncia.css"

// ── Utilitários ───────────────────────────────────

const STATUS_META = {
  pendente:  { label: "Pendente",  bg: "warning",   text: "dark"  },
  aprovada:  { label: "Aprovada",  bg: "danger",    text: "white" },
  rejeitada: { label: "Rejeitada", bg: "secondary", text: "white" },
  cancelada: { label: "Cancelada", bg: "light",     text: "dark"  },
};

const TIPO_META = {
  topico:   "Tópico",
  postagem: "Postagem",
  conteudo: "Conteúdo",
  colecao:  "Coleção",
};

function BadgeStatus({ status }) {
  const meta = STATUS_META[status] || STATUS_META.pendente;
  return (
    <Badge bg={meta.bg} text={meta.text}>
      {meta.label}
    </Badge>
  );
}

function formatarData(data) {
  if (!data) return "—";
  return new Date(data).toLocaleString("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function InfoRow({ label, children }) {
  return (
    <div
      className="d-flex gap-3 py-2 border-bottom align-items-start"
      style={{ fontSize: "0.9rem" }}
    >
      <span
        className="text-muted flex-shrink-0"
        style={{ minWidth: 140, fontWeight: 500 }}
      >
        {label}
      </span>
      <span className="text-body">{children}</span>
    </div>
  );
}

export default function AvaliarDenuncia() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario, isAdmin } = useContext(AuthContext);

  const [denuncia, setDenuncia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [decisao, setDecisao] = useState("");
  const [observacao, setObservacao] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Bloqueia acesso se não for admin
  useEffect(() => {
    if (!isAdmin) {
      toast.error("Acesso restrito a administradores.");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  // Carrega a denúncia pelo id
  useEffect(() => {
    if (!isAdmin) return;

    const carregar = async () => {
      setLoading(true);
      try {
        // Busca todas e encontra a específica — evita precisar de rota GET /denuncias/:id
        const { data } = await listarTodasDenuncias();
        const encontrada = data.find((d) => d._id === id);
        if (!encontrada) {
          setErro("Denúncia não encontrada.");
        } else {
          setDenuncia(encontrada);
        }
      } catch {
        setErro("Erro ao carregar denúncia.");
        toast.error("Erro ao carregar denúncia.");
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, [id, isAdmin]);

  // ── Avaliar ───────────────────────────────────────

  const handleAvaliar = async (e) => {
    e.preventDefault();

    if (!decisao) {
      toast.warning("Selecione uma decisão antes de confirmar.");
      return;
    }

    const confirmMsg =
      decisao === "aprovada"
        ? `Aprovar esta denúncia irá BANIR o usuário "${denuncia.denunciado?.usuario}". Confirmar?`
        : `Rejeitar esta denúncia. Confirmar?`;

    if (!window.confirm(confirmMsg)) return;

    setSalvando(true);
    try {
      const { data } = await avaliarDenuncia(id, {
        decisao,
        observacaoAdmin: observacao.trim() || undefined,
      });

      setDenuncia(data.denuncia);
      toast.success(
        decisao === "aprovada"
          ? `Denúncia aprovada. Usuário "${denuncia.denunciado?.usuario}" banido.`
          : "Denúncia rejeitada com sucesso.",
      );
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao avaliar denúncia.");
    } finally {
      setSalvando(false);
    }
  };

  // ── Render ────────────────────────────────────────

  if (!isAdmin) return null;

  return (
    <LayoutGeral>
      <section id="artigo" className="pagina-section">
        <Container fluid="lg">
          <Navegacao
              itens={[
                { label: "Home", to: "/" },
                { label: "Avaliar Denúnicas", to: `/denuncias/${id}/avaliar` },
              ]}
            />

          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div>
              <h1 className="pagina-titulo mb-4">Avaliar Denúncia</h1>
              <p className="pagina-subtitulo mb-0" style={{ fontSize: "0.85rem" }}>
                Revise os detalhes e tome uma decisão
              </p>
            </div>
            <Button
              variant="outline-secondary"
              size="sm"
              as={Link}
              to="/denuncias"
            >
              ← Voltar
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : erro ? (
            <Alert variant="danger">{erro}</Alert>
          ) : (
            <>
              {/* Card com detalhes da denúncia */}
              <Card className="pagina-card border mb-4">
                <Card.Header
                  className="fw-semibold d-flex align-items-center justify-content-between"
                  style={{ background: "#f8f9fa", fontSize: "0.9rem" }}
                >
                  <span>Detalhes da denúncia</span>
                  <BadgeStatus status={denuncia.status} />
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="px-4 py-2">
                    <InfoRow label="Usuário denunciado">
                      <span className="fw-semibold text-danger">
                        {denuncia.denunciado?.usuario || "—"}
                      </span>
                      {denuncia.denunciado?.banido && (
                        <Badge
                          bg="danger"
                          className="ms-2"
                          style={{ fontSize: "0.7rem" }}
                        >
                          Banido
                        </Badge>
                      )}
                    </InfoRow>

                    <InfoRow label="Autor da denúncia">
                      {denuncia.autor?.usuario || "—"}
                    </InfoRow>

                    <InfoRow label="Tipo de conteúdo">
                      <Badge
                        bg="light"
                        text="dark"
                        className="border fw-normal"
                      >
                        {TIPO_META[denuncia.targetTipo] || denuncia.targetTipo}
                      </Badge>
                    </InfoRow>

                    <InfoRow label="ID do conteúdo">
                      <code style={{ fontSize: "0.8rem" }}>
                        {denuncia.targetId}
                      </code>
                    </InfoRow>

                    <InfoRow label="Motivo">{denuncia.motivo}</InfoRow>

                    <InfoRow label="Data da denúncia">
                      {formatarData(denuncia.createdAt)}
                    </InfoRow>

                    {/* Dados da avaliação se já foi avaliada */}
                    {denuncia.status !== "pendente" && (
                      <>
                        <InfoRow label="Avaliado por">
                          {denuncia.avaliadoPor?.usuario || "—"}
                        </InfoRow>
                        <InfoRow label="Avaliado em">
                          {formatarData(denuncia.avaliadoEm)}
                        </InfoRow>
                        {denuncia.observacaoAdmin && (
                          <InfoRow label="Observação">
                            {denuncia.observacaoAdmin}
                          </InfoRow>
                        )}
                      </>
                    )}
                  </div>
                </Card.Body>
              </Card>

              {/* Formulário de avaliação — só se ainda pendente */}
              {denuncia.status === "pendente" ? (
                <Card className="border">
                  <Card.Header
                    className="fw-semibold"
                    style={{ background: "#f8f9fa", fontSize: "0.9rem" }}
                  >
                    Decisão do administrador
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Form onSubmit={handleAvaliar}>
                      <Form.Group className="mb-4">
                        <Form.Label
                          className="fw-semibold"
                          style={{ fontSize: "0.85rem" }}
                        >
                          Decisão <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="d-flex gap-3">
                          {/* Aprovar */}
                          <div
                            className={`border rounded-3 p-3 flex-fill text-center cursor-pointer ${
                              decisao === "aprovada"
                                ? "border-danger bg-danger bg-opacity-10"
                                : "border-secondary"
                            }`}
                            onClick={() => setDecisao("aprovada")}
                            style={{ cursor: "pointer" }}
                          >
                            <Form.Check
                              type="radio"
                              id="aprovada"
                              label=""
                              checked={decisao === "aprovada"}
                              onChange={() => setDecisao("aprovada")}
                              className="d-none"
                            />
                            <div style={{ fontSize: "1.5rem" }}>🚫</div>
                            <div
                              className="fw-semibold text-danger mt-1"
                              style={{ fontSize: "0.88rem" }}
                            >
                              Aprovar e banir usuário
                            </div>
                            <div
                              className="text-muted"
                              style={{ fontSize: "0.75rem" }}
                            >
                              O usuário será banido e não poderá participar do
                              site
                            </div>
                          </div>

                          {/* Rejeitar */}
                          <div
                            className={`border rounded-3 p-3 flex-fill text-center ${
                              decisao === "rejeitada"
                                ? "border-secondary bg-secondary bg-opacity-10"
                                : "border-secondary"
                            }`}
                            onClick={() => setDecisao("rejeitada")}
                            style={{ cursor: "pointer" }}
                          >
                            <div style={{ fontSize: "1.5rem" }}>✅</div>
                            <div
                              className="fw-semibold text-secondary mt-1"
                              style={{ fontSize: "0.88rem" }}
                            >
                              Rejeitar denúncia
                            </div>
                            <div
                              className="text-muted"
                              style={{ fontSize: "0.75rem" }}
                            >
                              A denúncia será arquivada sem punição
                            </div>
                          </div>
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label
                          className="fw-semibold"
                          style={{ fontSize: "0.85rem" }}
                        >
                          Observação{" "}
                          <span className="text-muted fw-normal">
                            (opcional)
                          </span>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Adicione uma justificativa ou nota interna sobre esta decisão..."
                          value={observacao}
                          onChange={(e) => setObservacao(e.target.value)}
                          style={{ fontSize: "0.9rem", resize: "vertical" }}
                        />
                      </Form.Group>

                      {/* Alerta de confirmação de ban */}
                      {decisao === "aprovada" && (
                        <Alert
                          variant="danger"
                          className="mb-4"
                          style={{ fontSize: "0.85rem" }}
                        >
                          ⚠️ Ao confirmar, o usuário{" "}
                          <strong>{denuncia.denunciado?.usuario}</strong> será{" "}
                          <strong>banido imediatamente</strong> e não poderá
                          mais publicar conteúdos, tópicos ou coleções.
                        </Alert>
                      )}

                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          variant="outline-secondary"
                          as={Link}
                          to="/denuncias"
                          disabled={salvando}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          variant={
                            decisao === "aprovada" ? "danger" : "primary"
                          }
                          disabled={salvando || !decisao}
                        >
                          {salvando
                            ? "Salvando..."
                            : decisao === "aprovada"
                              ? "Confirmar e banir"
                              : "Confirmar rejeição"}
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              ) : (
                /* Denúncia já avaliada — só leitura */
                <Alert
                  variant={
                    denuncia.status === "aprovada" ? "danger" : "secondary"
                  }
                  style={{ fontSize: "0.88rem" }}
                >
                  {denuncia.status === "aprovada" ? (
                    <>
                      ✅ Esta denúncia foi <strong>aprovada</strong> e o usuário
                      foi banido.
                    </>
                  ) : denuncia.status === "rejeitada" ? (
                    <>
                      🚫 Esta denúncia foi <strong>rejeitada</strong>.
                    </>
                  ) : (
                    <>
                      Esta denúncia foi <strong>cancelada</strong> pelo autor.
                    </>
                  )}
                </Alert>
              )}
            </>
          )}
        </Container>
      </section>
    </LayoutGeral>
  );
}
