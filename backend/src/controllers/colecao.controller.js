import Colecao from "../models/colecao.model.js";

//Criar Colecao
export const criarColecao = async (req, res) => {
  try {
    const { nome, descricao, cartas, capa } = req.body;

    const novaColecao = new Colecao({
      nome,
      descricao,
      cartas,
      dono: req.userId,
      capa,
      dataPublicacao: new Date(),
    });

    if (!nome || !descricao) {
      return res
        .status(400)
        .json({ error: "Campos obrigatórios devem ser preenchidos!" });
    }
    await novaColecao.save();
    res.status(201).json(novaColecao);
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
};

// listar Colecao
export const listarColecoes = async (req, res) => {
  try {
    const colecao = await Colecao.find().populate("dono", "colecao");
    res.json(colecao);
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
};

// listar Colecao por ID
export const listarColecaoPorID = async (req, res) => {
  try {
    const colecao = await Colecao.findById(req.params.id);

    if (!colecao)
      return res.status(404).json({ error: "Colecao não encontrada" });

    res.json(colecao);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

// atualizar Colecao
export const editarColecao = async (req, res) => {
  try {
    const colecao = await Colecao.findById(req.params.id);

    if (!colecao)
      return res.status(404).json({ error: "Colecao não encontrada" });

    // Garante que só o autor ou admn pode editar
    if (
      colecao.dono.toString() !== req.usuarioId &&
      req.usuarioTipo !== "admin"
    ) {
      return res.status(403).json({ error: "Não autorizado" });
    }

    //imagem
    if (req.file) {
      req.body.imagem = `/uploads/${req.file.filename}`;
    }

    // Atualiza com os novos dados
    const colecaoAtualizada = await Colecao.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    res.json(colecaoAtualizada);
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
};

// deletar Colecao
export const deletarColecao = async (req, res) => {
  try {
    const colecao = await Colecao.findById(req.params.id);

    if (!colecao)
      return res.status(404).json({ error: "Colecao não encontrada" });

    //apenas autor e admin podem deletar
    if (
      colecao.dono.toString() !== req.usuarioId &&
      req.usuarioTipo !== "admin"
    ) {
      return res.status(403).json({ error: "Não autorizado" });
    }

    await colecao.deleteOne();
    res.json({ message: "Colecaodeletado com sucesso" });
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
};