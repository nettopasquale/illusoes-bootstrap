import ForumTopico from "../models/forumTopico.model.js";
import ForumPost from "../models/forumPost.model.js";

//criar novo Tópico
export const criarTopico = async (req, res) => {
  try {
    const novoTopico = new ForumTopico({
      titulo: req.body.titulo,
      criador: req.usuarioId,
      secao: req.body.secao
    });

    const salvo = await novoTopico.save();

    const primeiraPostagem = new ForumPost({
      topico: salvo._id,
      autor: req.usuarioId,
      conteudo: req.body.conteudo,
      numeroPostagem: 1
    });

    await primeiraPostagem.save();
    res.status(201).json({ topico: salvo, primeiraPostagem });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

//Responder Tópico
export const responderTopico = async (req, res) => {
  try {
    const { topicoId, conteudo, citacoes } = req.body;

    const totalPosts = await ForumPost.countDocuments({ topico: topicoId });

    const novaPostagem = new ForumPost({
      topico: topicoId,
      autor: req.usuarioId,
      conteudo,
      numeroPostagem: totalPosts + 1,
      citacoes
    });

    await novaPostagem.save();

    await ForumTopico.findByIdAndUpdate(topicoId, {
      $inc: { respostas: 1 },
      ultimaResposta: { usuario: req.usuarioId, data: new Date() }
    });

    res.status(201).json(novaPostagem);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

// Buscar tópicos
export const buscarTopicos = async (req, res) => {
  try {
    const { titulo, autorId, conteudo } = req.query;
    const filtro = {};

    if (titulo) filtro.titulo = { $regex: titulo, $options: "i" };
    if (autorId) filtro.criador = autorId;

    // caso queira buscar tópicos com postagens que contenham tal conteúdo
    if (conteudo) {
      const posts = await ForumPost.find({ conteudo: { $regex: conteudo, $options: "i" } });
      const idsTopicos = [...new Set(posts.map(p => p.topico.toString()))];
      filtro._id = { $in: idsTopicos };
    }

    const topicos = await ForumTopico.find(filtro).populate("criador").populate("secao");
    res.json(topicos);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

//Editar postagem
export const editarPostagem = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await ForumPost.findById(id);

    if (!post) return res.status(404).json({ erro: "Postagem não encontrada." });

    const ehDono = post.autor.toString() === req.usuarioId;
    const ehAdmin = req.usuarioTipo === "admin";

    if (!ehDono && !ehAdmin)
      return res.status(403).json({ erro: "Permissão negada." });

    post.conteudo = req.body.conteudo;
    post.editado = {
      data: new Date(),
      porAdmin: ehAdmin
    };

    await post.save();
    res.json(post);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

// Excluir Postagem
export const excluirPostagem = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await ForumPost.findById(id);
    if (!post) return res.status(404).json({ erro: "Postagem não encontrada." });

    const ehDono = post.autor.toString() === req.usuarioId;
    const ehAdmin = req.usuarioTipo === "admin";

    if (!ehDono && !ehAdmin)
      return res.status(403).json({ erro: "Permissão negada." });

    post.status = "removido"; // exclusão lógica
    await post.save();

    res.json({ mensagem: "Postagem removida." });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

// Trancar tópicos - Apenas Admin
export const trancarTopico = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.usuarioTipo !== "admin") return res.status(403).json({ erro: "Apenas administradores." });

    const topico = await ForumTopico.findById(id);
    if (!topico) return res.status(404).json({ erro: "Tópico não encontrado." });

    topico.trancado = !topico.trancado;
    await topico.save();

    res.json({ mensagem: `Tópico ${topico.trancado ? "trancado" : "destrancado"}` });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

// Excluir Tópico - Apenas Admin
export const excluirTopico = async (req, res) => {
  try {
    if (req.usuarioTipo !== "admin")
      return res.status(403).json({ erro: "Apenas administradores podem excluir tópicos." });

    const { id } = req.params;
    const topico = await ForumTopico.findById(id);
    if (!topico) return res.status(404).json({ erro: "Tópico não encontrado." });

    topico.status = "removido"; // exclusão lógica
    await topico.save();

    res.json({ mensagem: "Tópico removido." });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};
