import Colecao from "../models/colecao.model.js";

//Criar Colecao
export const criarColecao = async (req, res) => {
  try {
    const { nome, descricao, cartas, capa } = req.body;

    if (!nome || !descricao) {
      return res.status(400).json({
        error: "Campos obrigatórios devem ser preenchidos!",
      });
    }

    //cria a coleção DEPOIS de resolver o upload da imagem
    const novaColecao = new Colecao({
      nome,
      descricao,
      cartas,
      dono: req.userId,
      capa,
      dataPublicacao: new Date(),
    });

    console.log("BODY:", req.body);

    await novaColecao.save();
    res.status(201).json({msg: "cheguei aqui"});
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
      return res.status(404).json({ error: "Coleção não encontrada" });

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
      return res.status(404).json({ error: "Coleção não encontrada" });

    // Garante que só o autor ou admn pode editar
    if (
      colecao.dono.toString() !== req.usuarioId &&
      req.usuarioTipo !== "admin"
    ) {
      return res.status(403).json({ error: "Não autorizado" });
    }

    //imagem de capa
    if (req.file?.capa) {
      colecao.capa = req.body.capa;
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
      return res.status(404).json({ error: "Coleção não encontrada" });

    //apenas autor e admin podem deletar
    if (
      colecao.dono.toString() !== req.usuarioId &&
      req.usuarioTipo !== "admin"
    ) {
      return res.status(403).json({ error: "Não autorizado" });
    }

    await colecao.deleteOne();
    res.json({ message: "Coleção deletada com sucesso" });
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
};

// deleter coleções sem criador -- APENAS ADMIN
export const deletarColecoesSemCriador = async (req, res) => {
    try {
        if (req.userRole !== "admin") {
            return res.status(403).json({ error: "Apenas administradores podem deletar órfãos" });
        }

        const resultado = await Colecao.deleteMany({ dono: { $exists: false } });
        return res.status(200).json({ message: `${resultado.deletedCount} coleções sem donos foram deletadas.` });
    } catch (erro) {
        return res.status(500).json({ error: erro.message });
    }
};

// APENAS PARA CONVENIENCIA
export const deletarTodasColecoes = async (req, res) => {
    try {
        // Apenas administradores podem fazer isso
        if (req.userRole !== "admin") {
            return res.status(403).json({ error: "Apenas administradores podem deletar tudo" });
        }

        const resultado = await Colecao.deleteMany({});
        return res.status(200).res.json({ message: `Todas as coleçoes foram deletadas (${resultado.deletedCount} itens).` });
    } catch (erro) {
        return res.status(500).json({ error: erro.message });
    }
};