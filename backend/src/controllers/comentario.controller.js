import ComentarioModel from "../models/comentario.model.js";

//criar o comentário
export const criarComentario = async (req, res) => {
  try {
    const { conteudo, targetId, targetTipo, parentId } = req.body;

    const comentario = await ComentarioModel.create({
      conteudo,
      autor: req.userId,
      targetId,
      targetTipo,
      parentId: parentId || null,
    });
    const comentarioPopulado = await comentario.populate("autor", "usuario");

    res.status(201).json(comentarioPopulado);
  } catch (error) {
    console.error("Erro ao criar comentário: ", error);
    res.status(500).json({ error: error.message });
  }
};

//listar comentários
export const listarComentarios = async (req, res) => {
  try {
    const { targetId } = req.params;
    const { targetTipo } = req.query;


    const comentarios = await ComentarioModel.find({
      targetId,
      targetTipo,
    })
      .populate("autor", "usuario")
      .sort({ createdAt: -1 });
    res.status(201).json(comentarios);
  } catch (error) {
    console.error("Erro ao listar comentários: ", error);
    res.status(500).json({ error: error.message });
  }
};

//curtir comentário
export const toggleLikeComentario = async (req, res) => {
  try {
    const comentario = await ComentarioModel.findById(req.params.targetId);
    console.log("Comentario a ser curtido: ", comentario);

    if (!comentario) {
      return res.status(404).json({ error: "Comentário não encontrado" });
    }

    //impede de curtir o próprio comentário
    if (comentario.autor.toString() === req.userId) {
      return res.status(403).json({
        error: "Não pode curtir o próprio comentário",
      });
    }

    const jaCurtiu = comentario.curtidas.includes(req.userId);

    if (jaCurtiu) {
      comentario.curtidas.pull(req.userId);
    } else {
      comentario.curtidas.push(req.userId);
    }

    await comentario.save();

    res.json({
      curtiu: !jaCurtiu,
      curtidasTotais: comentario.curtidas.length,
    });
  } catch (error) {
    console.error("Erro ao curtir comentários: ", error);
    res.status(500).json({ error: error.message });
  }
};

//deletar comentário
export const deletarComentario = async (req, res) => {
  try {
    const comentario = await ComentarioModel.findById(req.params.id);

    if (!comentario) {
      return res.status(404).json({ error: "Comentário não encontrado" });
    }

    //garante que só o dono ou o admn possa deletar
    if (
      comentario.autor.toString() !== req.userId &&
      req.userRole !== "admin"
    ) {
      return res.status(403).json({ error: "Não autorizado" });
    }

    await comentario.deleteOne();

    res.json({ message: "Comentário deletado" });
  } catch (error) {
    console.error("Erro ao deletar comentários: ", error);
    res.status(500).json({ error: error.message });
  }
};
