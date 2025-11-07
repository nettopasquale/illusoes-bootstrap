import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Image, Tab, Nav } from "react-bootstrap";
import { PersonCircle, ChatLeftText, ChatDots } from "react-bootstrap-icons";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";

export default function ForumUserProfile() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [topicos, setTopicos] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // ========================= MOCK TEMPORÁRIO =========================
    // Substituir futuramente por:
    // axios.get(`/api/forum/usuario/${userId}`)
    setUserData({
      _id: userId,
      nome: "ProDeckMaster",
      avatar: null,
      bio: "Jogador competitivo e colecionador de cartas raras desde 2018.",
      totalTopicos: 15,
      totalPosts: 67,
      dataCadastro: "2022-09-12T00:00:00Z",
    });

    // axios.get(`/api/forum/usuario/${userId}/topicos`)
    setTopicos([
      {
        _id: "t1",
        titulo: "Como montar um deck competitivo em 2025",
        dataCriacao: "2025-11-01T14:00:00Z",
        respostas: 8,
      },
      {
        _id: "t2",
        titulo: "Cartas raras que valem o investimento",
        dataCriacao: "2025-10-22T09:30:00Z",
        respostas: 3,
      },
    ]);

    // axios.get(`/api/forum/usuario/${userId}/posts`)
    setPosts([
      {
        _id: "p1",
        topicoTitulo: "Dúvidas sobre banlist 2025",
        conteudo: "Acho que algumas cartas foram banidas injustamente...",
        data: "2025-11-03T15:45:00Z",
      },
      {
        _id: "p2",
        topicoTitulo: "Melhores decks para iniciantes",
        conteudo: "Para quem está começando, recomendo priorizar cartas...",
        data: "2025-10-29T12:10:00Z",
      },
    ]);
    // ==================================================================
  }, [userId]);

  if (!userData)
    return <p className="text-center mt-5">Carregando perfil...</p>;

  return (
    <LayoutGeral>
      <section id="artigo" className="block artigo-block">
        <Container className="my-5">
          <Row className="justify-content-center mb-4">
            <Navegacao
              itens={[
                { label: "Home", to: "/" },
                { label: "Forum", to: "/forum" },
                { label: "Forum User Profile", to: "/forum/userprofile" },
              ]}
            />
            <Col xs={12} md={8} lg={7}>
              <Card className="border-0 shadow-sm rounded-4 p-3 text-center">
                <div className="mb-3">
                  {userData.avatar ? (
                    <Image
                      src={userData.avatar}
                      roundedCircle
                      width={120}
                      height={120}
                      className="object-fit-cover"
                    />
                  ) : (
                    <PersonCircle size={120} className="text-secondary" />
                  )}
                </div>
                <h4 className="fw-bold">{userData.nome}</h4>
                <p className="text-muted small mb-2">{userData.bio}</p>
                <div className="d-flex justify-content-center gap-3 text-secondary small">
                  <span>{userData.totalTopicos} tópicos</span>
                  <span>{userData.totalPosts} postagens</span>
                  <span>
                    Membro desde{" "}
                    {new Date(userData.dataCadastro).toLocaleDateString(
                      "pt-BR"
                    )}
                  </span>
                </div>
              </Card>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={9}>
              <Tab.Container defaultActiveKey="topicos">
                <Nav variant="pills" className="justify-content-center mb-3">
                  <Nav.Item>
                    <Nav.Link eventKey="topicos" className="fw-semibold">
                      <ChatLeftText className="me-1" /> Tópicos criados
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="posts" className="fw-semibold">
                      <ChatDots className="me-1" /> Postagens recentes
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  {/* Aba de tópicos */}
                  <Tab.Pane eventKey="topicos">
                    {topicos.length > 0 ? (
                      topicos.map((topico) => (
                        <Card
                          key={topico._id}
                          className="mb-3 border-0 shadow-sm rounded-3"
                        >
                          <Card.Body>
                            <Link
                              to={`/forum/topico/${topico._id}`}
                              className="text-decoration-none text-dark fw-semibold"
                            >
                              {topico.titulo}
                            </Link>
                            <div className="text-muted small mt-1">
                              Criado em{" "}
                              {new Date(topico.dataCriacao).toLocaleDateString(
                                "pt-BR"
                              )}{" "}
                              • {topico.respostas} respostas
                            </div>
                          </Card.Body>
                        </Card>
                      ))
                    ) : (
                      <p className="text-center text-muted">
                        Nenhum tópico criado ainda.
                      </p>
                    )}
                  </Tab.Pane>

                  {/* Aba de posts */}
                  <Tab.Pane eventKey="posts">
                    {posts.length > 0 ? (
                      posts.map((post) => (
                        <Card
                          key={post._id}
                          className="mb-3 border-0 shadow-sm rounded-3"
                        >
                          <Card.Body>
                            <div className="fw-semibold mb-1 text-primary">
                              Em: {post.topicoTitulo}
                            </div>
                            <p className="mb-1">{post.conteudo}</p>
                            <div className="text-muted small">
                              {new Date(post.data).toLocaleDateString("pt-BR")}
                            </div>
                          </Card.Body>
                        </Card>
                      ))
                    ) : (
                      <p className="text-center text-muted">
                        Nenhuma postagem recente.
                      </p>
                    )}
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Col>
          </Row>
        </Container>
      </section>
    </LayoutGeral>
  );
}
