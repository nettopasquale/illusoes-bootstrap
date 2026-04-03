import { useState, useContext } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import {
  PlusCircle,
  ArrowLeft,
  Collection,
  Trash3,
  PencilSquare,
} from "react-bootstrap-icons";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import { useColecao } from "../../hooks/useColecao";
import { AuthContext } from "../../context/AuthContext";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import api from "../../services/api";


export default function ColecaoLista() {
  const [loading, setLoading] = useState(false);
  // const [mensagem, setMensagem] = useState(null);
  const {usuario} = useContext(AuthContext)
  
  //hook das coleções
  const { 
    mensagem, 
    setMensagem, 
    colecoes, 
    setColecoes, 
    erro, 
    navigate } = useColecao();

  const handleExcluir = async(colecaoId)=>{{
    const confirmar = window.confirm("Tem certeza que deseja deletar a coleção?");
    if(!confirmar) return;

    try{
      await api.delete(`/colecoes/${colecaoId}`);
      //atualizar aqui
      setColecoes((prev) => prev.filter((c) => c._id !== colecaoId));
      setMensagem("Coleção deletada com sucesso!")

      setTimeout(()=> setMensagem(null), 3000)
      }catch(erro){
        console.error("Erro ao deletar a coleção: ", erro);
      }
    }
  }
  
//caso estiver em estado de carregar ou de der erro
  if (loading) {
    return (
      <LayoutGeral>
        <Container className="my-5 py-5">
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Todas as Coleções", to: "/colecoes" },
            ]}
          />
          <p className="mt-3">Carregando as coleções...</p>
        </Container>
      </LayoutGeral>
    );
  }
  if (erro) {
    return (
      <LayoutGeral>
        <Container className="my-5 py-5">
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Todas as Coleções", to: "/colecoes" },
            ]}
          />
          <p className="mt-3">{erro}</p>
        </Container>
      </LayoutGeral>
    );
  }

  return (
    <LayoutGeral>
      <Container className="my-5 py-5">
        <Navegacao
          itens={[
            { label: "Home", to: "/" },
            { label: "Todas as Coleções", to: "/colecoes" },
          ]}
        />
        <Row className="mb-4 align-items-center">
          <Col>
            <h3 className="fw-bold text-primary d-flex align-items-center">
              <Collection className="me-2" />
              Todas as Coleções
            </h3>
            {mensagem && <Alert variant="success">{mensagem}</Alert>}
            {erro && <Alert variant="danger">{erro}</Alert>}
          </Col>
          <Col className="text-end">
            <Button
              variant="primary"
              onClick={() => navigate(`/colecoes/criar`)}
            >
              <PlusCircle className="me-2" size={18} />
              Nova Coleção
            </Button>
          </Col>
        </Row>

        {colecoes.length === 0 ? (
          <div className="text-center text-muted mt-5">
            <p>Você ainda não possui coleções criadas.</p>
            <Button
              onClick={() => navigate(`/colecoes/criar`)}
              variant="outline-primary"
            >
              Criar minha primeira coleção
            </Button>
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={3} className="g-4">
            {colecoes.map((col) => {
              const donoId =
                typeof col.dono === "object" ? col.dono._id : col.dono;

              const isDono = usuario?._id?.toString() === donoId?.toString();

              // console.log("USUARIO LOGADO: ", usuario?._id)
              // console.log("DONO RAW: ", isDono);

              return (
                <Col key={col._id}>
                  <Card className="h-100 shadow-sm">
                    <Card.Img
                      variant="top"
                      src={col.capa}
                      alt={col.nome}
                      style={{
                        height: "180px",
                        objectFit: "cover",
                      }}
                    />
                    <Card.Body>
                      <Card.Title className="fw-semibold">
                        {col.nome}
                      </Card.Title>
                      <Card.Text className="text-muted small">
                        {col.descricao}
                      </Card.Text>
                      <Card.Text className="text-muted small">
                        Criado por:{" "}
                        {col.dono?.usuario || "Usuário desconhecido"}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <small className="text-muted">
                          {col.totalCartas} cartas
                        </small>
                        <div>
                          {isDono && (
                            <div>
                              <Button
                                size="sm"
                                variant="outline-secondary"
                                className="me-2"
                                onClick={() =>
                                  navigate(`/colecoes/${col._id}/editar`)
                                }
                              >
                                Editar
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                className="me-2"
                                onClick={() => handleExcluir(col._id)}
                              >
                                Excluir
                              </Button>
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => navigate(`/colecoes/${col._id}`)}
                          >
                            Ver
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </LayoutGeral>
  );
}
