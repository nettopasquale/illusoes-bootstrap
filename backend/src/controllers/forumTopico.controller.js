import ForumTopico from "../models/forumTopico.model.js";
import ForumPost from "../models/forumPost.model.js";
import forumCategoria from "../models/forumCategoria.model.js";
import forumSubForum from "../models/forumSubForum.model.js";

//criar novo Tópico
export const criarTopico = async (req, res) => {
  try {

    const { titulo, categoriaId, subForumId, conteudoInicial } = req.body;

    //verifica se categoria existe
    const categoria = await forumCategoria.findById(categoriaId);
    if (!categoria) return res.status(404).json({ message: "Categoria não encontrada" });

    //caso tenha subForum
    if (subForumId) {
      const subForum = await forumSubForum.findById(subForumId);
      if (!subForum) return res.status(404).json({ message: "Subfórum não encontrado" });
    }

    //criação do Tópico
    const novoTopico = new ForumTopico({
      titulo,
      criador: req.user.id,
      categoriaId: categoria,
      subForumId: subForumId || null,
      dataCriacao: new Date(),
      status: "ativo",
    })

    await novoTopico.save();

    //criar o primeiro post
    if (conteudoInicial && conteudoInicial.trim() !== "") {
      const primeiroPost = new ForumPost({
        topicoId: novoTopico._id,
        autor: req.user.id,
        conteudo: conteudoInicial,
      });

      await primeiroPost.save();

      //vincula ao tópico
      novoTopico.posts.push(primeiroPost._id);
      await novoTopico.save();
    }
    res.status(201).json(novoTopico);

  } catch (erro) {
    res.status(500).json({ message: "Erro ao criar tópico", erro });
  }
};


// Listar tópicos
export const listarTopicos = async (req, res) => {
  try {
    const { categoriaId, subForumId } = req.query;
    const filtro = {};

    if (categoriaId) filtro.categoria = categoriaId;
    if (subForumId) filtro.subforum = subForumId;

    const topicos = await ForumTopico.find(filtro)
      .populate("criador", "nome")
      .populate("ultimoPost.usuarioId", "nome")
      .sort({ ultimaPostagem: -1 }); // ver aqui

    res.json(topicos);

  } catch (error) {
    res.status(500).json({ message: "Erro ao listar tópicos", error });
  }
}

// Buscar tópicos por Id
export const buscarTopicosPorId = async (req, res) => {
  try {
    const topico = await ForumTopico.findById(req.params.id)
      .populate("criador", "nome")
      .populate({
        path: "posts",
        populate: { path: "autor", select: "nome" },
      });

    if (!topico) return res.status(404).json({ message: "Tópico não encontrado" });

    //atualizar contagem de visualizaçoes
    topico.visualizacoes += 1;
    await topico.save();

    res.json(topico);
  } catch (erro) {
    res.status(500).json({ message: "Erro ao buscar tópico", erro });
  }
};

//editar tópico
export const editarTopico = async (req, res) => {
  try {
    const { titulo } = req.body;
    const topico = await ForumTopico.findById(req.params.id);

    if (!topico) return res.status(404).json({ message: "Tópico não encontrado" });

    if (req.user.id !== topico.criador.toString() && req.userRole !== "admin") return res.status(403).json({ message: "Permissão negada" });

    topico.titulo = titulo || topico.titulo;
    topico.dataModificacao = new Date();
    await topico.save();

    res.json(topico);
  } catch (error) {
    res.status(500).json({ message: "Erro ao editar tópico", error });
  }
}

// Trancar tópicos - Apenas Admin
export const trancarTopico = async (req, res) => {
  try {
    if (req.userRole !== "admin") return res.status(403).json({ erro: "Acesso negado. Apenas administradores." });

    const topico = await ForumTopico.findByIdAndUpdate(req.params.id, { status: "trancado" }, { new: true });
    
    if (!topico) return res.status(404).json({ erro: "Tópico não encontrado." });

    res.json({ message: "Tópico trancado com sucesso", topico });
  } catch (erro) {
    res.status(500).json({ message: "Erro ao trancar tópico", erro });
  }
};

// Excluir Tópico - Apenas Admin
export const excluirTopico = async (req, res) => {
  try {
    if (req.userRole !== "admin")
      return res.status(403).json({ erro: "Acesso negado. Apenas administradores tem permissão." });

    const topico = await ForumTopico.findByIdAndDelete(req.params.id);
    if (!topico) return res.status(404).json({ erro: "Tópico não encontrado." });

    //remover posts associados
    await ForumPost.deleteMany({ topicoId: req.params.id });
    res.json({message: "Tópico e posts excluídos com sucesso"})
  } catch (erro) {
    res.status(500).json({ message: "Erro ao excluir tópico", erro  });
  }
};
