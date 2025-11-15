export default function useForum() {
  // 🔧 MOCK TEMPORÁRIO
  const forum = [
    {
      _id: "1",
      nome: "Notícias e Atualizações",
      descricao: "Últimas novidades do jogo",
    },
    {
      _id: "2",
      nome: "Dúvidas e Tutoriais",
      descricao: "Espaço para ajuda e aprendizado",
    },
  ];
  // TODO: substituir por fetch real:
  // const response = await fetch("/api/forum");
  // const data = await response.json();

  // 🔧 MOCK TEMPORÁRIO
  const forumCategoria = {
    nome: "Dúvidas e Tutoriais",
    descricao: "Espaço para trocar dicas e aprender com outros jogadores",
    topicos: [
      {
        _id: "101",
        titulo: "Como montar meu primeiro deck?",
        autor: { nome: "PlayerX" },
        totalPosts: 5,
        totalVisualizacoes: 123,
        ultimoPost: { autor: "ModA", data: "2025-11-05T12:00:00Z" },
      },
    ],
  };
  // TODO: substituir por fetch real:
  // const res = await fetch(`/api/forum/categorias/${categoriaId}`);
  // const data = await res.json();

  return {
      forum,
      forumCategoria,
  };
}
