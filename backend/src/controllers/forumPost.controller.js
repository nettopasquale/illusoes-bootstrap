import ForumTopico from "../models/forumTopico.model";
import ForumPost from "../models/forumPost.model";

//Publicar Postagen - POST /forum/topicos/:topicoId/postagens
export const publicarPostagem = async (req, res) => {  
  try {
    const {
      conteudo,
      postagemCitacaoId,
      conteudoCitacao,
      nomeAutorCitacao,
      parenteResposta,
    } = req.body;

    const topico = await ForumTopico.findById(req.params.id);
    if (!topico || topico.deletado)
      return res.status(404).json({ message: "Tópico não encontrado" });

    if (topico.trancado)
      return res.status(403).json({ message: "Tópico fechado para postagens" });

    const postagem = new ForumPost ({
      autor: req.userId,
      conteudo,
      postagemCitacao: postagemCitacaoId || null,
      conteudoCitacao: conteudoCitacao || null,
      nomeAutorCitacao: nomeAutorCitacao || null,
      parenteResposta: parenteResposta || null,
    });

    topico.postagens.push(postagem);
    await topico.save();
    await postagem.save();
    await topico.populate("postagens.autor", "nome imagemProfile");

    const novaPostagem = topico.postagens[topico.postagens.length - 1];
    res.status(201).json(novaPostagem);
  } catch (err) {
    res.status(500).json({ message: "Erro ao responder", error: err.message });
  }
};

//editar postagem - somente autor - PUT /forum/topicos/:topicoId/postagens/:id/editar
export const editarPostagem = async (req, res) => {  
    try {
        const postagem = await ForumPost.findById(req.params.id);
        if (!postagem || postagem.status === "removido")
          return res.status(404).json({ message: "Postagem não encontrada" });

        if (postagem.autor.toString() !== req.userId.toString())
          return res.status(403).json({ message: "Sem permissão para editar" });

        const postagemAtualizada = await ForumPost.findByIdAndUpdate(
            req.params.postagemId,
            {$set: req.body},
            {new: true, runValidators: true}
        )

        await postagemAtualizada.save();
        res.status(201).json(postagemAtualizada);
    } catch (err) {
        res.status(500).json({ message: "Erro ao editar tópico", error: err.message });
    }
};

//deletar postagem - somente autor DELETE /forum/topicos/:id
export const deletarPostagem = async (req, res) => {  
  try {
    // const postagem = topico.postagens.id(req.params.postagemId);
    const postagem = ForumPost.findById(req.params.postagemId);
    if (!postagem)
      return res.status(404).json({ message: "Resposta não encontrada" });

    if (postagem.autor.toString() !== req.userId.toString())
      return res.status(403).json({ message: "Sem permissão para excluir" });

    postagem.deletado = true;
    postagem.conteudo = "[Resposta removida pelo autor]";
    await postagem.save();
    res.status(201).json({ message: "Resposta removida" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao excluir resposta", error: err.message });
  }
};

//curtir postagem - POST forum/topicos/:topicoId/postagens/:id/curtir
export const curtirPostagem = async (req, res) => {
  try {
    const postagem = ForumPost.findById(req.params.postagemId);
    if (!postagem)
      return res.status(404).json({ message: "Resposta não encontrada" });

    const userId = req.userId.toString();
    const jaCurtido = postagem.curtidoPor.map(String).includes(userId);

    if (jaCurtido) {
      postagem.curtidas -= 1;
      postagem.curtidoPor = postagem.curtidoPor.filter(
        (id) => id.toString() !== userId,
      );
    } else {
      postagem.curtidas += 1;
      postagem.curtidoPor.push(req.userId);
    }

    await postagem.save();
    res.status(201).json({ curtidas: postagem.curtidas, curtido: !jaCurtido });
  } catch (err) {
    res.status(500).json({ message: "Erro ao votar na resposta", error: err.message });
  }
};

//deunciar postagem - POST forum/topicos/:topicoId/postagens/:id/denunciar
export const denunciarPostagem = async (req, res) => {
  try {
    const { motivo } = req.body;
    const postagem = await ForumPost.findById(req.params.postagemId);
    if (!postagem)
      return res.status(404).json({ message: "Postagem não encontrada" });

    postagem.denuncias.push({ denunciadoPor: req.userId, motivo });
    await postagem.save();
    res.status(201).json({ message: "Denúncia registrada" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao denunciar resposta", error: err.message });
  }
};
