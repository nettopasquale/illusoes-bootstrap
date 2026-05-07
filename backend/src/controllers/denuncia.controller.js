import DenunciaModel from "../models/denuncia.model.js";
import UserModel from "../models/user.model.js";

// ── USUÁRIO ───────────────────────────────────────

// POST /denuncias
// Cria uma denúncia — qualquer usuário logado
export const criarDenuncia = async (req, res) => {
  try {
    const { denunciado, targetId, targetTipo, motivo } = req.body;

    if (!denunciado || !targetId || !targetTipo || !motivo) {
      return res
        .status(400)
        .json({ error: "Campos obrigatórios devem ser preenchidos!" });
    }

    // Não pode denunciar a si mesmo
    if (String(denunciado) === String(req.userId)) {
      return res
        .status(400)
        .json({ error: "Você não pode denunciar a si mesmo." });
    }

    // Verifica se o usuário denunciado existe
    const usuarioDenunciado = await UserModel.findById(denunciado);
    if (!usuarioDenunciado) {
      return res
        .status(404)
        .json({ error: "Usuário denunciado não encontrado." });
    }

    const novaDenuncia = new DenunciaModel({
      autor: req.userId,
      denunciado,
      targetId,
      targetTipo,
      motivo,
    });

    await novaDenuncia.save();
    return res.status(201).json(novaDenuncia);
  } catch (erro) {
    // Índice único — denúncia duplicada
    if (erro.code === 11000) {
      return res
        .status(409)
        .json({ error: "Você já denunciou este conteúdo." });
    }
    return res.status(500).json({ error: erro.message });
  }
};


// DELETE /denuncias/:id
// Cancela uma denúncia — somente o autor, somente se ainda estiver pendente
export const cancelarDenuncia = async (req, res) => {
  try {
    const denuncia = await DenunciaModel.findById(req.params.id);

    if (!denuncia) {
      return res.status(404).json({ error: "Denúncia não encontrada." });
    }

    if (String(denuncia.autor) !== String(req.userId)) {
      return res.status(403).json({ error: "Não autorizado." });
    }

    if (denuncia.status !== "pendente") {
      return res.status(400).json({
        error: "Só é possível cancelar denúncias com status pendente.",
      });
    }

    denuncia.status = "cancelada";
    await denuncia.save();

    return res.status(200).json({ message: "Denúncia cancelada com sucesso." });
  } catch (erro) {
    return res.status(500).json({ error: erro.message });
  }
};

// ── ADMIN ─────────────────────────────────────────

// Lista todas as denúncias — somente admin
// Suporta filtro por status: /denuncias?status=pendente
export const listarTodasDenuncias = async (req, res) => {
  try {
    const { status } = req.query;
    const filtro = {};
    if (status) filtro.status = status;

    const denuncias = await DenunciaModel.find(filtro)
      .populate("autor", "usuario")
      .populate("denunciado", "usuario banido")
      .populate("avaliadoPor", "usuario")
      .sort({ createdAt: -1 });

    return res.status(200).json(denuncias);
  } catch (erro) {
    return res.status(500).json({ error: erro.message });
  }
};

//Lista uma unica denuncia
export const buscarDenunciaPorId = async (req, res) => {
  try {
    const denuncia = await DenunciaModel.findById(req.params.id)
      .populate("autor", "usuario")
      .populate("denunciado", "usuario banido")
      .populate("avaliadoPor", "usuario");
    if (!denuncia) return res.status(404).json({ error: "Não encontrada." });
    return res.status(200).json(denuncia);
  } catch (erro) {
    return res.status(500).json({ error: erro.message });
  }
};


// PATCH /denuncias/:id/avaliar
// Admin aprova ou rejeita uma denúncia
// body: { decisao: "aprovada" | "rejeitada", observacaoAdmin?: "" }
export const avaliarDenuncia = async (req, res) => {
  try {
    const { decisao, observacaoAdmin } = req.body;

    if (!["aprovada", "rejeitada"].includes(decisao)) {
      return res
        .status(400)
        .json({ error: "Decisão inválida. Use 'aprovada' ou 'rejeitada'." });
    }

    const denuncia = await DenunciaModel.findById(req.params.id);
    if (!denuncia) {
      return res.status(404).json({ error: "Denúncia não encontrada." });
    }

    if (denuncia.status !== "pendente") {
      return res.status(400).json({ error: "Esta denúncia já foi avaliada." });
    }

    denuncia.status = decisao;
    denuncia.avaliadoPor = req.userId;
    denuncia.avaliadoEm = new Date();
    denuncia.observacaoAdmin = observacaoAdmin || null;

    await denuncia.save();

    // Se aprovada, bane o usuário denunciado
    if (decisao === "aprovada") {
      await UserModel.findByIdAndUpdate(denuncia.denunciado, {
        banido: true,
      });
    }

    return res.status(200).json({
      message:
        decisao === "aprovada"
          ? "Denúncia aprovada. Usuário banido."
          : "Denúncia rejeitada.",
      denuncia,
    });
  } catch (erro) {
    return res.status(500).json({ error: erro.message });
  }
};
