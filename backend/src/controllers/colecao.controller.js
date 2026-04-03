import ColecaoModel from "../models/colecao.model.js";
import CartaColecaoModel from "../models/cartaColecao.model.js";

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
    const novaColecao = new ColecaoModel({
      nome,
      descricao,
      cartas,
      dono: req.userId,
      capa,
      dataPublicacao: new Date(),
    });

    await novaColecao.save();
    res.status(201).json({ msg: "cheguei aqui" });
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
};

// listar Colecao
export const listarColecoes = async (req, res) => {
  try {
    const colecao = await ColecaoModel.find().populate("dono", "usuario");

    //calcula qtd de cartas das coleções
    const qtdCartas = await Promise.all(
      colecao.map(async (col)=>{
        const totalCartas = await CartaColecaoModel.countDocuments({
          colecaoId:col._id,
        });
        return{
          ...col.toObject(),
          totalCartas,
        };
      })
    )
    // res.status(201).json(colecao);
    res.status(200).json(qtdCartas);
    // res.json(qtdCartas);
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
};

// listar Colecao por ID
export const listarColecaoPorID = async (req, res) => {
  try {
    const colecao = await ColecaoModel.findById(req.params.id);

    if (!colecao)
      return res.status(404).json({ error: "Coleção não encontrada" });

    return res.status(200).json(colecao);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};


// atualizar Colecao
export const editarColecao = async (req, res) => {
  try {
    const colecao = await ColecaoModel.findById(req.params.id);
    
    if (!colecao)
      return res.status(404).json({ error: "Coleção não encontrada" });

    // Garante que só o autor ou admn pode editar
    if (colecao.dono.toString() !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({ error: "Não autorizado" });
    }

    //imagem de capa
    if (req.file?.capa) {
      colecao.capa = req.body.capa;
    }

    // Atualiza com os novos dados
    const colecaoAtualizada = await ColecaoModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    res.status(200).json(colecaoAtualizada);
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
};

// deletar Colecao
export const deletarColecao = async (req, res) => {
  try {
    const {id} = req.params;
    const colecao = await ColecaoModel.findById(id);
    if (!colecao)
      return res.status(404).json({ error: "Coleção Não Encontrada" });

    // Garante que só o autor ou admn pode excluir
    if (colecao.dono.toString() !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({ error: "Não autorizado" });
    }

    //remove cartas da coleção
    await CartaColecaoModel.deleteMany({ colecaoId: colecao._id });

    //remove a coleção
    await ColecaoModel.deleteOne();

    console.log("Coleção deletada com sucesso")
    return res.status(200).json({ message: "Coleção deletada" });
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

        const resultado = await ColecaoModel.deleteMany({
          dono: { $exists: false },
        });
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

        const resultado = await ColecaoModel.deleteMany({});
        return res.status(200).res.json({ message: `Todas as coleçoes foram deletadas (${resultado.deletedCount} itens).` });
    } catch (erro) {
        return res.status(500).json({ error: erro.message });
    }
};