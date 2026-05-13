import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import api from "../../services/api";
import "./EsqueceuSenha.css"; 

export default function EsqueceuSenha() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setErro(null);

    try {
      await api.post("/users/solicitar-redefinicao", { email: email.trim() });
      // Sempre mostra sucesso — o backend não revela se o email existe
      setEnviado(true);
    } catch {
      setErro("Erro ao processar a solicitação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutGeral>
      <section className="auth-section">
        <div className="auth-card">
          {/* Logo */}
          <div className="auth-logo">Ilusões Industriais</div>

          {/* Estado: formulário ou confirmação */}
          {enviado ? (
            <>
              {/* Confirmação de envio */}
              <div className="text-center mb-3" style={{ fontSize: "2rem" }}>
                📬
              </div>
              <h1 className="auth-titulo">Verifique seu email</h1>
              <p className="auth-subtitulo">
                Se esse endereço estiver cadastrado, você receberá um link para
                redefinir sua senha em instantes. Verifique também a caixa de
                spam.
              </p>

              <Alert
                variant="success"
                className="py-2 text-center"
                style={{ fontSize: "0.85rem" }}
              >
                Email enviado com sucesso!
              </Alert>

              <div className="auth-divider">ou</div>

              <p
                className="text-center mb-0"
                style={{ fontSize: "0.85rem", color: "var(--cor-texto-suave)" }}
              >
                Lembrou a senha?{" "}
                <Link to="/login" className="auth-link">
                  Voltar para o login
                </Link>
              </p>
            </>
          ) : (
            <>
              {/* Formulário */}
              <h1 className="auth-titulo">Esqueceu sua senha?</h1>
              <p className="auth-subtitulo">
                Informe o email cadastrado e enviaremos um link para você
                redefinir sua senha.
              </p>

              {erro && (
                <Alert
                  variant="danger"
                  className="py-2 text-center"
                  style={{ fontSize: "0.85rem" }}
                >
                  {erro}
                </Alert>
              )}

              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Email cadastrado</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErro(null);
                    }}
                    autoComplete="email"
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100"
                  disabled={loading || !email.trim()}
                  style={{
                    background: "var(--cor-destaque)",
                    border: "none",
                  }}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-2" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar link de redefinição"
                  )}
                </Button>
              </Form>

              <div className="auth-divider">ou</div>

              <p
                className="text-center mb-0"
                style={{ fontSize: "0.85rem", color: "var(--cor-texto-suave)" }}
              >
                Lembrou a senha?{" "}
                <Link to="/login" className="auth-link">
                  Voltar para o login
                </Link>
              </p>
            </>
          )}
        </div>
      </section>
    </LayoutGeral>
  );
}
