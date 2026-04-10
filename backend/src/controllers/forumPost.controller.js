import TopicoPost from "../models/TopicoPost.model.js";

//helper
const ehAdminOuUsuario = (docUsuarioId, usuario)=>{
  String(docUsuarioId) === String(usuario._id) || usuario.tipo === "admin"
}


// ── REPLIES ───────────────────────────────────────

//Publicar Postagen - POST /forum/topicos/:topicoId/postagens
export const publicarPostagem = async (req, res) => {
  try {
    const {
      conteudo,
      postagemCitacaoId,
      conteudoCitacao,
      nomeAutorCitacao,
      parenteResposta,
      anexos
    } = req.body;

    const topico = await TopicoPost.findById(req.params.id);
    if (!topico || topico.deletado)
      return res.status(404).json({ message: "Tópico não encontrado" });

    if (topico.trancado)
      return res.status(403).json({ message: "Tópico fechado para postagens" });

    //incrementar contagem de posts
    await TopicoPost.publicarPostESalvar({
      autor: req.userId,
      conteudo,
      anexos: anexos || [],
      postagemCitacao: postagemCitacaoId || null,
      conteudoCitacao: conteudoCitacao || null,
      nomeAutorCitacao: nomeAutorCitacao || null,
      parenteResposta: parenteResposta || null,
    });

    await topico.populate(
      "postagens.autor",
      "nome imagemProfile postagensContador criadoEm autor.tipo['admin']", //REVER AQUI
    );

    const novaPostagem = topico.postagens[topico.postagens.length - 1];
    res.status(201).json(novaPostagem);
  } catch (err) {
    res.status(500).json({ message: "Erro ao responder", error: err.message });
  }
};

//editar postagem - somente autor - PUT /forum/topicos/:topicoId/postagens/:postagemId/editar
export const editarPostagem = async (req, res) => {
  try {
    const topico = await TopicoPost.findById(req.params.topicoId);

    if(!topico) return res.status(404).json({message: "Tópico não encontrado"})
    
    const postagem = TopicoPost.postagem.id(req.params.postagemId);
    if (!postagem || postagem.status === "removido")
      return res.status(404).json({ message: "Postagem não encontrada" });

    if (!ehAdminOuUsuario(postagem.autor, req.usuario))
      return res.status(403).json({ message: "Sem permissão para editar" });

    // if (postagem.autor.toString() !== req.userId.toString())
    //   return res.status(403).json({ message: "Sem permissão para editar" });

    const {conteudo, anexos} = req.body;
    if (conteudo) postagem.conteudo = conteudo;
    if(anexos) postagem.anexos = anexos;
    postagem.editadoEm = new Date();
    postagem.editadoPor = req.userId;

    await topico.save();
    res.status(201).json(postagem);
  } catch (err) {
    res.status(500).json({ message: "Erro ao editar tópico", error: err.message });
  }
};

//deletar postagem - somente autor DELETE /forum/topicos/:topicoId/postagens/:postagemId
export const deletarPostagem = async (req, res) => {
  try {
    const topico = TopicoPost.findById(req.params.topicoId);
    if(!topico) return res.status(404).json({message: "Tópico não encontrado"});

    const postagem = TopicoPost.postagens(req.params.postagemId);
    if (!postagem) return res.status(404).json({ message: "Postagem não encontrada" });

    if (!ehAdminOuUsuario(postagem.autor, req.usuario))
      return res.status(403).json({ message: "Sem permissão para excluir" });
    // if (postagem.autor.toString() !== req.userId.toString())
    //   return res.status(403).json({ message: "Sem permissão para excluir" });

    postagem.deletado = true;
    postagem.conteudo = "[Postagem removida pelo autor]";
    topico.postagensContador = topico.postagens.filter((r)=> !r.deletado).length;
    await topico.save();
    res.status(201).json({ message: "Postagem removida" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao excluir postagem", error: err.message });
  }
};

//curtir postagem - POST forum/topicos/:topicoId/postagens/:postagemId/curtir
export const curtirPostagem = async (req, res) => {
  try {
    const topico = TopicoPost.findById(req.params.topicoId);
    if (!topico)
      return res.status(404).json({ message: "Tópico não encontrado" });

    const postagem = TopicoPost.postagens(req.params.postagemId);
    if (!postagem)
      return res.status(404).json({ message: "Postagem não encontrada" });

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

    await topico.save();
    res.status(201).json({ curtidas: postagem.curtidas, curtido: jaCurtido === -1 });
  } catch (err) {
    res.status(500).json({ message: "Erro ao votar na resposta", error: err.message });
  }
};

//denunciar postagem - POST forum/topicos/:topicoId/postagens/:postagemId/denunciar
export const denunciarPostagem = async (req, res) => {
  try {
    const { motivo } = req.body;
    const topico = TopicoPost.findById(req.params.topicoId);
    if (!topico)
      return res.status(404).json({ message: "Tópico não encontrado" });

    const postagem = TopicoPost.postagens(req.params.postagemId);
    if (!postagem)
      return res.status(404).json({ message: "Postagem não encontrada" });

    postagem.denuncias.push({ denunciadoPor: req.userId, motivo });
    await topico.save();
    res.status(201).json({ message: "Denúncia registrada" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao denunciar resposta", error: err.message });
  }
};

//Bookmark post - POST forum/topicos/:topicoId/postagens/:postagemId/bookmark
export const criarBookmarkPostagem = async (req, res) => {
  try {
    const topico = TopicoPost.findById(req.params.topicoId);
    if (!topico)
      return res.status(404).json({ message: "Tópico não encontrado" });

    const postagem = TopicoPost.postagens(req.params.postagemId);
    if (!postagem)
      return res.status(404).json({ message: "Postagem não encontrada" });

    const userId = req.userId.toString();
    const idx = postagem.bookmarkedPor.map(String).includes(userId);

    if (idx > -1) {
      postagem.bookmarkedPor.splice(idx, 1);
    } else {
      postagem.bookmarkedPor.push(req.userId);
    }

    await topico.save();
    res.status(201).json({ bookmarked: idx === -1 });
  } catch (err) {
    res.status(500).json({ message: "Erro ao salvar bookmark da postagem", error: err.message });
  }
};

