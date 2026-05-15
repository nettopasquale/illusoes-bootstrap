import ConteudoModel from "../models/conteudo.model.js";
import ColecaoModel from "../models/colecao.model.js";

// GET /api/busca?q=termo&tipo=conteudo|colecao|noticia|artigo|evento|campeonato&limite=8
export const buscarGlobal = async (req, res) => {
  try {
    const { q, tipo, limite = 8 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: "Digite ao menos 2 caracteres." });
    }

    const regex = new RegExp(q.trim(), "i"); // case-insensitive
    const limitNum = Math.min(parseInt(limite), 20);
    const resultados = [];

    // ── Conteúdos ─────────────────────────────────
    const buscaConteudo =
      !tipo ||
      tipo === "conteudo" ||
      ["noticia", "artigo", "evento", "campeonato"].includes(tipo);

    if (buscaConteudo) {
      const filtroConteudo = { titulo: regex };

      // Se passou um tipo específico de conteúdo, filtra por ele
      if (["noticia", "artigo", "evento", "campeonato"].includes(tipo)) {
        filtroConteudo.tipo = tipo;
      }

      const conteudos = await ConteudoModel.find(filtroConteudo)
        .select("titulo subTitulo tipo thumbs dataPublicacao")
        .sort({ dataPublicacao: -1 })
        .limit(limitNum)
        .lean();

      conteudos.forEach((c) =>
        resultados.push({
          _id: c._id,
          titulo: c.titulo,
          subtitulo: c.subTitulo,
          thumb: c.thumbs || null,
          tipo: c.tipo, // noticia | artigo | evento | campeonato
          entidade: "conteudo",
          url: `/conteudos/${c.tipo}/${c._id}`,
        }),
      );
    }

    // ── Coleções ──────────────────────────────────
    const buscaColecao = !tipo || tipo === "colecao";

    if (buscaColecao) {
      const colecoes = await ColecaoModel.find({ nome: regex })
        .select("nome descricao capa dono")
        .populate("dono", "usuario")
        .sort({ createdAt: -1 })
        .limit(limitNum)
        .lean();

      colecoes.forEach((c) =>
        resultados.push({
          _id: c._id,
          titulo: c.nome,
          subtitulo: c.descricao,
          thumb: c.capa || null,
          tipo: "colecao",
          entidade: "colecao",
          url: `/colecoes/${c._id}`,
          dono: c.dono?.usuario,
        }),
      );
    }

    // Limita o total final
    return res.status(200).json(resultados.slice(0, limitNum));
  } catch (erro) {
    return res.status(500).json({ error: erro.message });
  }
};
