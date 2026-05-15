import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import api from "../../services/api";
import "./RedefinirSenha.css"

const schema = yup.object().shape({
  novaSenha: yup
    .string()
    .min(8, "Mínimo 8 caracteres")
    .matches(/[A-Z]/, "Precisa de ao menos uma letra maiúscula")
    .matches(/[a-z]/, "Precisa de ao menos uma letra minúscula")
    .matches(/\d/, "Precisa de ao menos um número")
    .matches(/[!@#$%^&*]/, "Precisa de ao menos um caractere especial")
    .required("Nova senha é obrigatória"),
  confirmarSenha: yup
    .string()
    .oneOf([yup.ref("novaSenha"), null], "As senhas não coincidem")
    .required("Confirmação é obrigatória"),
});

export default function RedefinirSenha() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    novaSenha: "",
    confirmarSenha: "",
  });
  const [erro, setErro] = useState({});
  const [loading, setLoading] = useState(false);
  const [concluido, setConcluido] = useState(false);

  // Token ausente na URL
  if (!token) {
    return (
      <LayoutGeral>
        <section className="auth-section">
          <div className="auth-card">
            <div className="auth-logo">Ilusões Industriais</div>
            <div className="text-center mb-3" style={{ fontSize: "2rem" }}>
              ⚠️
            </div>
            <h1 className="auth-titulo">Link inválido</h1>
            <p className="auth-subtitulo">
              Este link de redefinição é inválido ou está incompleto. Solicite
              um novo link.
            </p>
            <Link
              to="/esqueceu-senha"
              className="btn w-100"
              style={{
                background: "var(--cor-destaque)",
                border: "none",
                color: "white",
              }}
            >
              Solicitar novo link
            </Link>
            <div className="auth-divider">ou</div>
            <p
              className="text-center mb-0"
              style={{ fontSize: "0.85rem", color: "var(--cor-texto-suave)" }}
            >
              <Link to="/login" className="auth-link">
                Voltar para o login
              </Link>
            </p>
          </div>
        </section>
      </LayoutGeral>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErro({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro({});

    try {
      await schema.validate(formData, { abortEarly: false });

      await api.post("/users/redefinir-senha", {
        token,
        novaSenha: formData.novaSenha,
      });

      setConcluido(true);

      // Redireciona para login após 3 segundos
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      if (error.name === "ValidationError") {
        const erros = {};
        error.inner.forEach((e) => (erros[e.path] = e.message));
        setErro(erros);
      } else if (error.response) {
        setErro({
          global: error.response.data?.error || "Token inválido ou expirado.",
        });
      } else {
        setErro({ global: "Erro inesperado. Tente novamente." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutGeral>
      <section className="auth-section">
        <div className="auth-card">
          <div className="auth-logo">CardHub</div>

          {concluido ? (
            <>
              <div className="text-center mb-3" style={{ fontSize: "2rem" }}>
                ✅
              </div>
              <h1 className="auth-titulo">Senha redefinida!</h1>
              <p className="auth-subtitulo">
                Sua senha foi atualizada com sucesso. Você será redirecionado
                para o login em instantes.
              </p>
              <Alert
                variant="success"
                className="py-2 text-center"
                style={{ fontSize: "0.85rem" }}
              >
                Redirecionando para o login...
              </Alert>
              <Link
                to="/login"
                className="btn w-100 mt-2"
                style={{
                  background: "var(--cor-destaque)",
                  border: "none",
                  color: "white",
                }}
              >
                Ir para o login agora
              </Link>
            </>
          ) : (
            <>
              <h1 className="auth-titulo">Redefinir senha</h1>
              <p className="auth-subtitulo">
                Escolha uma nova senha segura para a sua conta.
              </p>

              {erro.global && (
                <Alert
                  variant="danger"
                  className="py-2 text-center"
                  style={{ fontSize: "0.85rem" }}
                >
                  {erro.global}
                </Alert>
              )}

              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nova senha</Form.Label>
                  <Form.Control
                    type="password"
                    name="novaSenha"
                    placeholder="••••••••"
                    value={formData.novaSenha}
                    onChange={handleChange}
                    isInvalid={!!erro.novaSenha}
                    autoComplete="new-password"
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {erro.novaSenha}
                  </Form.Control.Feedback>
                  <Form.Text
                    className="text-muted"
                    style={{ fontSize: "0.72rem" }}
                  >
                    Mínimo 8 caracteres, com maiúscula, número e símbolo.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirmar nova senha</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmarSenha"
                    placeholder="••••••••"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    isInvalid={!!erro.confirmarSenha}
                    autoComplete="new-password"
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {erro.confirmarSenha}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100"
                  disabled={
                    loading || !formData.novaSenha || !formData.confirmarSenha
                  }
                  style={{
                    background: "var(--cor-destaque)",
                    border: "none",
                  }}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-2" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar nova senha"
                  )}
                </Button>
              </Form>

              <div className="auth-divider">ou</div>

              <p
                className="text-center mb-0"
                style={{ fontSize: "0.85rem", color: "var(--cor-texto-suave)" }}
              >
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
