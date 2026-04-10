import TopicoPost from "../models/TopicoPost.model.js";
import UserModel from "../models/user.model.js";

//helper
const ehAdminOuUsuario = (docUsuarioId, usuario)=>{
  String(docUsuarioId) === String(usuario._id) || usuario.tipo === "admin"
}

// ── TOPICO ───────────────────────────────────────

//Lista tópicos com paginação -> GET /forum/topicos
export const buscarTopicos = async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 30;
    const categoria = req.query.categoria || null;
    const sort = req.query.sort || "recente"; // recente | curtidas | postagens

    const filter = { deletado: false };
    if (categoria) filter.categoria = categoria;

    //ordenação de posts e curtidas
    const sortMap = {
      recente: { destaque: -1, ultimaPostagemEm: -1, createdAt: -1 },
      curtidas: { destaque: -1, curtidas: -1 },
      postagens: { destaque: -1, postagensContador: -1 },
    };

    const topicos = await TopicoPost.find(filter)
      .populate("autor", "nome imagemProfile postagensContador criadoEm")
      .populate("ultimaPostagemPor", "nome imagemProfile")
      .select("-postagens -denuncias")
      .sort(sortMap[sort] || sortMap.recente)
      .skip((page - 1) * limite)
      .limit(limite);

    const total = await TopicoPost.countDocuments(filter);

    res.status(201).json({
      topicos,
      total,
      pagina,
      totalPaginas: Math.ceil(total / limite),
    });
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar tópicos", error: err.message });
  }
};

//Detalha um tópico - GET /forum/topicos/:id -
export const buscarTopicosPorID = async (req, res) => {
  try {
    const topico = await TopicoPost.findById(req.params.id)
      .populate(
        "autor",
        "nome imagemProfile postagensContador criadoEm autor.tipo == 'admin'",
      ) //MUDAR AQUI
      .populate("editadoPor", "nome")
      .populate("ultimaPostagemPor", "nome imagemProfile")
      .populate(
        "postagens.autor",
        "nome imagemProfile postagensContador criadoEm autor.tipo == 'admin'",
      )
      .populate("postagens.editadoPor", "nome");

    if (!topico || topico.deletado) {
      return res.status(404).json({ message: "Tópico não encontrado" });
    }

    // Incrementa views
    topico.visualizacoes += 1;
    await topico.save();

    res.status(201).json(topico);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar tópico", error: err.message });
  }
};

//Resumo das categorias - GET /forum/categorias
export const buscarCategorias = async (req, res) => {
  try {
    const categorias = [
      "estrategia",
      "iniciante",
      "meta",
      "trocas",
      "regras",
      "torneio",
      "geral",
      "batepapo",
    ];

    const stats = await Promise.all(
      categorias.map(async (cat) => {
        const total = await TopicoPost.countDocuments({
          categoria: cat,
          deletado: false,
        });
        const last = await TopicoPost.findOne({
          categoria: cat,
          deletado: false,
        })
          .sort({ ultimaPostagemEm: -1, criadoEm: -1 })
          .populate("ultimaPostagemEm", "nome")
          .populate("autor", "nome")
          .select(
            "titulo ultimaPostagemEm ultimaPostagemPor postagensContador criadoEm autor",
          );
        return { categoria: cat, total, ultimoTopico: last };
      }),
    );

    res.status(201).json(stats);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar categorias", error: err.message });
  }
};

//Criar Tópico - POST /forum/topicos
export const criarTopico = async (req, res) => {
  try {
    const { titulo, conteudo, categoria, tags, anexos } = req.body;

    const topico = new TopicoPost({
      titulo,
      conteudo,
      categoria,
      tags: tags || [],
      anexos: anexos || [],
      autor: req.userId,
      ultimaPostagemEm: new Date(),
    });

    await topico.save();
    await topico.populate(
      "autor",
      "nome imagemProfile postagensContador criadoEm",
    );

    // Incrementa postCount do usuário
    await UserModel.findByIdAndUpdate(req.userId, { $inc: { postCount: 1 } });

    res.status(201).json(topico);
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar tópico", error: err.message });
  }
};

//editar tópico - somente autor - PUT /forum/topicos/:id
export const editarTopico = async (req, res) => {
  try {
    const topico = await TopicoPost.findById(req.params.id);
    if (!topico || topico.deletado)
      return res.status(404).json({ message: "Tópico não encontrado" });

    if (topico.autor.toString() !== req.userId.toString())
      return res.status(403).json({ message: "Sem permissão para editar" });

    const { titulo, conteudo, categoria, tags, anexos } = req.body;
    if (titulo) topico.titulo = titulo;
    if (conteudo) topico.conteudo = conteudo;
    if (categoria) topico.categoria = categoria;
    if (tags) topico.tags = tags;
    if (anexos) topico.anexos = anexos;

    await topico.save();
    res.status(201).json(topico);
  } catch (err) {
    res.status(500).json({ message: "Erro ao editar tópico", error: err.message });
  }
};

//deletar tópico - somente autor DELETE /forum/topicos/:id
export const deletarTopico = async (req, res) => {
  try {
    const topico = await TopicoPost.findById(req.params.id);
    if (!topico)
      return res.status(404).json({ message: "Tópico não encontrado" });

    // if (topico.autor.toString() !== req.userId.toString())
    //   return res.status(403).json({ message: "Sem permissão para excluir" });

    if (!ehAdminOuUsuario(topico.autor, req.usuario))
      return res.status(403).json({ message: "Sem permissão para excluir" });

    topico.deletado = true;
    await topico.save();
    res.status(201).json({ message: "Tópico removido com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao excluir tópico", error: err.message });
  }
};

//curtir tópico - POST forum/topicos/:id/curtir
export const curtirTopico = async (req, res) => {
  try {
    const topicos = await TopicoPost.findById(req.params.id);
    if (!topicos)
      return res.status(404).json({ message: "Tópico não encontrado" });

    const userId = req.userId.toString();
    const jaCurtido = topicos.curtidoPor.map(String).includes(userId);

    if (jaCurtido > -1) {
      topicos.curtidas -= 1;
      topicos.curtidoPor.splice(jaCurtido, 1)
    } else {
      topicos.curtidas += 1;
      topicos.curtidoPor.push(req.userId);
    }

    await topicos.save();
    res.status(201).json({ curtidas: topicos.curtidas, curtido: jaCurtido === -1 });
  } catch (err) {
    res.status(500).json({ message: "Erro ao votar", error: err.message });
  }
};

//denunciar tópico - POST forum/topicos/:id/denunciar
export const denunciarTopico = async (req, res) => {
  try {
    const { motivo } = req.body;
    const topico = await TopicoPost.findById(req.params.id);
    if (!topico)
      return res.status(404).json({ message: "Tópico não encontrado" });

    topico.denuncias.push({ denunciadoPor: req.userId, motivo });
    await topico.save();
    res.status(201).json({ message: "Denúncia registrada" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao denunciar", error: err.message });
  }
};

//Bookmark tópico - POST forum/topicos/:id/denunciar
export const criarBookmarkTopico = async (req, res) => {
  try {
    const topico = await TopicoPost.findById(req.params.id);
    if (!topico)
      return res.status(404).json({ message: "Tópico não encontrado" });

    const userId = req.userId.toString();
    const idx = topico.bookmarkedPor.map(String).includes(userId);

    if (idx > -1) {
      topico.bookmarkedPor.splice(idx, 1);
    } else {
      topico.bookmarkedPor.push(req.userId);
    }

    await topico.save();
    res.status(201).json({ bookmarked: idx === -1 });
  } catch (err) {
    res.status(500).json({ message: "Erro ao salvar bookmark do tópico", error: err.message });
  }
};

//listar os bookmarks de tópico - POST forum/topicos/:id/denunciar
export const listarBookmarkTopico = async (req, res) => {
  try {
    const uid = req.userId
    //busca os bookmarks no banco
    const topicoBookmarks = await TopicoPost.find({
      bookmarkedPor: uid,
      deletado: false,
    })
      .populate("autor", "nome imagemProfile")
      .select(
        "titulo categoria curtidas postagensContador visualizacoes criadoEm ultimaPostagemEm",
      )
      .sort({criadoEm: -1});

    //
    const topicosComPostsBM = await TopicoPost.find(
      { "postagens.bookmarkedPor": uid, deletado: false },
      { titulo: 1, categoria: 1, "postagens.$": 1 },
    ).populate("postagens.autor", "nome imagemProfile");

    const postBookmarks = topicosComPostsBM.flatMap((t) =>
    t.postagens
      .filter((r)=> r.bookmarkedPor.map(String).includes(String(uid)))
      .map((r)=>({
        ...r.toObject(),
        topicoId: t._id,
        topicoTitulo: t.titulo,
        categoria: t.categoria
      }))
    );

    // await topicoBookmarks.save();
    res.status(201).json({ topicoBookmarks, postBookmarks });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Erro ao salvar bookmark do tópico",
        error: err.message,
      });
  }
};
