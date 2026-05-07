import ConteudoModel from "../models/conteudo.model.js";
import LikeModel from "../models/like.model.js";
import ComentarioModel from "../models/comentario.model.js";
import UserModel from "../models/user.model.js";

//Criar Conteúdo de Noticias, Artigos, Evento ou Campeonato
export const criarConteudo = async (req,res) => {
    try {
      const {
        titulo,
        subTitulo,
        texto,
        tags,
        dataEvento,
        valorEntrada,
        thumbs,
      } = req.body;
      const { tipo } = req.params;

      const imagens = req.files?.imagem
        ? req.files.imagem.map((img) => img.filename)
        : [];

      // Validação simples para evitar valores inválidos
      if (!["noticia", "artigo", "evento", "campeonato"].includes(tipo)) {
        return res
          .status(400)
          .json({
            error:
              "Tipo inválido: deve ser 'noticia', 'artigo','evento' ou 'campeonato'",
          });
      }

      if (!titulo || !subTitulo || !texto) {
        return res
          .status(400)
          .json({ error: "Campos obrigatórios devem ser preenchidos!" });
      }

      const novoConteudo = new ConteudoModel({
        titulo,
        subTitulo,
        texto,
        thumbs,
        imagens,
        tipo,
        autor: req.userId,
        dataPublicacao: new Date(),
        tags: JSON.parse(tags || "[]"),
        dataEvento,
        valorEntrada,
      });

      console.log("novo Conteúdo:", novoConteudo);

      await novoConteudo.save();
      return res.status(201).json(novoConteudo);
    } catch (erro) {
        return res.status(500).json({ error: erro.message });
    }
};

// listar Conteúdo de Noticias, Artigos, Evento ou Campeonato
export const listarConteudos = async (req, res) => {
    try {
      const { tipo } = req.params;
      const conteudos = await ConteudoModel.find({ tipo: tipo.toLowerCase() })
        .populate("autor", "usuario")
        .sort({ createdAt: -1 });


      return res.status(200).json(conteudos);
    } catch (erro) {
        return res.status(500).json({ error: erro.message });
    }
};


// listar Conteúdo de Noticias, Artigos, Evento ou Campeonato por ID
export const listarConteudoPorID = async (req, res) => {
    try {
        const conteudo = await ConteudoModel.findById(req.params.id)
        .populate("autor", "usuario");

        if (!conteudo) return res.status(404).json({ error: "Conteúdo não encontrado" });

        return res.status(200).json(conteudo);
    }
    catch (erro) {
        return res.status(500).json({ erro: erro.message })
    }
}

// atualizar Conteúdo de Noticias, Artigos, Evento ou Campeonato
export const editarConteudo = async (req, res) => {
    try {    
      const conteudo = await ConteudoModel.findById(req.params.id);

      if (!conteudo)
        return res.status(404).json({ error: "Conteudo não encontrado" });

      if (!conteudo.autor)
        return res.status(404).json({ error: "Autor não encontrado" });

      // Garante que só o autor  ou admn pode editar
      if (
        conteudo.autor.toString() !== req.userId &&
        req.userRole !== "admin"
      ) {
        return res.status(403).json({ error: "Não autorizado" });
      }

      // Atualiza com os novos dados
      const conteudoAtualizado = await ConteudoModel.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true },
      );

      return res.status(200).json(conteudoAtualizado);
    } catch (erro) {
        return res.status(500).json({ error: erro.message });
    }
};

// deletar Conteúdo de Noticias, Artigos, Evento ou Campeonato
export const deletarConteudo = async (req, res) => {
    try {
        const conteudo = await ConteudoModel.findById(req.params.id);

        if (!conteudo) return res.status(404).json({ error: "Conteúdo não encontrado" });

        //só o autor ou o admn podem deletar
        if (conteudo.autor.toString() !== req.userId
            && req.userRole !== "admin") {
            return res.status(403).json({ error: "Não autorizado" });
        }

        await conteudo.deleteOne();
        return res.status(200).json({ message: "Conteúdo deletado com sucesso" });
    } catch (erro) {
        return res.status(500).json({ error: erro.message });
    }
};

// deleter conteudos sem criador -- APENAS ADMIN
export const deletarConteudosSemCriador = async (req, res) => {
    try {
        if (req.userRole !== "admin") {
            return res.status(403).json({ error: "Apenas administradores podem deletar órfãos" });
        }

        const resultado = await ConteudoModel.deleteMany({ autor: { $exists: false } });
        return res.status(200).json({ message: `${resultado.deletedCount} conteúdos sem criador foram deletados.` });
    } catch (erro) {
        return res.status(500).json({ error: erro.message });
    }
};

// APENAS PARA CONVENIENCIA
export const deletarTodosEventos = async (req, res) => {
    try {
        // Apenas administradores podem fazer isso
        if (req.userRole !== "admin") {
            return res.status(403).json({ error: "Apenas administradores podem deletar tudo" });
        }

        const resultado = await ConteudoModel.deleteMany({});
        return res.status(200).res.json({ message: `Todas os conteúdos foram deletados (${resultado.deletedCount} itens).` });
    } catch (erro) {
        return res.status(500).json({ error: erro.message });
    }
};

// Listar conteúdos COM destaque - Carrosel - GET /conteudos/destaques?limite=5
export const listarDestaques = async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 5;
    // Busca os conteúdos com contagem de likes e comentários via agregação
    const destaques = await ConteudoModel.aggregate([
      // Só conteúdos publicados
      { $match: {} },

      {
        $lookup: {
          from: "likes",
          let: { conteudoId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$targetId", "$$conteudoId"] },
                    { $eq: ["$targetTipo", "conteudo"] }, // ← filtra só likes de conteúdo
                  ],
                },
              },
            },
          ],
          as: "likesData",
        },
      },
      {
        $lookup: {
          from: "comentarios",
          let: { conteudoId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$targetId", "$$conteudoId"] },
                    { $eq: ["$targetTipo", "conteudo"] }, // ← filtra só comentários de conteúdo
                  ],
                },
              },
            },
          ],
          as: "comentariosData",
        },
      },

      // Calcula as contagens e score de popularidade
      {
        $addFields: {
          totalLikes: { $size: "$likesData" },
          totalComentarios: { $size: "$comentariosData" },
          // Score: likes valem 1 ponto, comentários valem 2 (mais engajamento)
          scorePopularidade: {
            $add: [
              { $size: "$likesData" },
              { $multiply: [{ $size: "$comentariosData" }, 2] },
            ],
          },
        },
      },

      // Ordena por score desc, depois por data de publicação mais recente
      { $sort: { scorePopularidade: -1, dataPublicacao: -1 } },

      { $limit: limite },

      // Popula o autor manualmente (aggregate não usa .populate)
      {
        $lookup: {
          from: "users",
          localField: "autor",
          foreignField: "_id",
          as: "autorData",
        },
      },

      // Remove arrays temporários e formata o retorno
      {
        $project: {
          titulo: 1,
          subTitulo: 1,
          thumbs: 1,
          tipo: 1,
          dataPublicacao: 1,
          tags: 1,
          dataEvento: 1,
          totalLikes: 1,
          totalComentarios: 1,
          scorePopularidade: 1,
          autor: { $arrayElemAt: ["$autorData", 0] },
          // Limpa campos internos do autor
        },
      },

      // Remove senha e dados sensíveis do autor
      {
        $project: {
          "autor.senha": 0,
          "autor.email": 0,
          "autor.banido": 0,
          likesData: 0,
          comentariosData: 0,
          autorData: 0,
        },
      },
    ]);

    return res.status(200).json(destaques);
  } catch (erro) {
    return res.status(500).json({ error: erro.message });
  }
};