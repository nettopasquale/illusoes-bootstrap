import ForumTopico from "../models/forumTopico.model.js";

//Lista tópicos com paginação -> GET /forum/topicos
export const buscarTopicos = async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 20;
    const categoria = req.query.categoria || null;
    const sort = req.query.sort || "recente"; // recente | curtidas | postagens

    const filter = { isDeleted: false };
    if (categoria) filter.categoria = categoria;

    const sortMap = {
      recente: { createdAt: -1 },
      curtidas: { curtidas: -1 },
      postagens: { "postagens.length": -1 },
    };

    const topicos = await ForumTopico.find(filter)
      .populate("autor", "nome imagemProfile")
      .select("-postagens.denuncias -denuncias")
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip((page - 1) * limite)
      .limit(limite);

    const total = await ForumTopico.countDocuments(filter);

    res
      .status(201)
      .json({
        topicos,
        total,
        pagina,
        totalPaginas: Math.ceil(total / limite),
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro ao buscar tópicos", error: err.message });
  }
};

//Detalha um tópico - GET /forum/topicos/:id -
export const buscarTopicosPorID = async (req, res) => {
  try {
    const topico = await ForumTopico.findById(req.params.id)
      .populate("autor", "nome imagemProfile")
      .populate("postagens.autor", "nome avatar");

    if (!topico || topico.deletado) {
      return res.status(404).json({ message: "Tópico não encontrado" });
    }

    // Incrementa views
    topico.visualizacoes += 1;
    await topico.save();

    res.status(201).json(topico);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro ao buscar tópico", error: err.message });
  }
};

//Criar Tópico - POST /forum/topicos
export const criarTopico = async (req, res) => {
  try {
    const { titulo, conteudo, categoria, tags } = req.body;

    const topico = new ForumTopico({
      titulo,
      conteudo,
      categoria,
      tags: tags || [],
      autor: req.userId,
    });

    await topico.save();
    await topico.populate("author", "name avatar");

    res.status(201).json(topico);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro ao criar tópico", error: err.message });
  }
};

//editar tópico - somente autor - PUT /forum/topicos/:id
export const editarTopico = async (req, res) => {
  try {
    const topico = await ForumTopico.findById(req.params.id);
    if (!topico || topico.deletado)
      return res.status(404).json({ message: "Tópico não encontrado" });

    if (topico.autor.toString() !== req.userId.toString())
      return res.status(403).json({ message: "Sem permissão para editar" });

    const { titulo, conteudo, categoria, tags } = req.body;
    if (titulo) topico.titulo = titulo;
    if (conteudo) topico.conteudo = conteudo;
    if (categoria) topico.categoria = categoria;
    if (tags) topico.tags = tags;

    await topico.save();
    res.status(201).json(topico);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro ao editar tópico", error: err.message });
  }
};

//deletar tópico - somente autor DELETE /forum/topicos/:id
export const deletarTopico = async (req, res) => {
  try {
    const topico = await ForumTopico.findById(req.params.id);
    if (!topico)
      return res.status(404).json({ message: "Tópico não encontrado" });

    if (topico.autor.toString() !== req.userId.toString())
      return res.status(403).json({ message: "Sem permissão para excluir" });

    topico.deletado = true;
    await topico.save();
    res.status(201).json({ message: "Tópico removido com sucesso" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro ao excluir tópico", error: err.message });
  }
};

//curtir tópico - POST forum/topicos/:id/curtir
export const curtirTopico = async (req, res) => {
  try {
    const topicos = await ForumTopico.findById(req.params.id);
    if (!topicos)
      return res.status(404).json({ message: "Tópico não encontrado" });

    const userId = req.userId.toString();
    const jaCurtido = topicos.curtidoPor.map(String).includes(userId);

    if (jaCurtido) {
      topicos.curtidas -= 1;
      topicos.curtidoPor = topicos.curtidoPor.filter(
        (id) => id.toString() !== userId,
      );
    } else {
      topicos.curtidas += 1;
      topicos.curtidoPor.push(req.userId);
    }

    await topicos.save();
    res.status(201).json({ votes: topicos.curtidas, curtido: !jaCurtido });
  } catch (err) {
    res.status(500).json({ message: "Erro ao votar", error: err.message });
  }
};

//deunciar tópico - POST forum/topicos/:id/denunciar
export const denunciarTopico = async (req, res) => {
  try {
    const { motivo } = req.body;
    const topico = await ForumTopico.findById(req.params.id);
    if (!topico)
      return res.status(404).json({ message: "Tópico não encontrado" });

    topico.denuncias.push({ denunciadoPor: req.userId, motivo });
    await topico.save();
    res.status(201).json({ message: "Denúncia registrada" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao denunciar", error: err.message });
  }
};
