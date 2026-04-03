import CartaModel from "../models/carta.model.js"
import CartaColecaoModel from "../models/cartaColecao.model.js";
import dotenv from "dotenv";
dotenv.config();

const url = "https://api.tcgapi.dev/v1";

// buscar carta da JustTCG
export const buscarCartas = async (req, res) => {
  try {
    const { q, game } = req.query;

    if (!q) {
      return res.status(400).json({
        error: "Parâmetro de busca não informado!",
      });
    }

    const params = new URLSearchParams({q});

    if(game) params.set('game', game)

    const response = await fetch(`${url}/search?${params}`, {
      headers: {
        "X-API-Key": process.env.TCG_API_KEY,
      },
    });

    const data = await response.json();

    if(!data.data || data.data.length === 0){
      return res.status(404).json({
        error: "Carta não encontrada"
      })
    }
    console.log("RESPOSTA TCG API:", data);

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

//listar as cartas da coleção
export const listarCartasDaColecao = async (req, res) => {
  try {
    const { colecaoId } = req.params;

    const cartas = await CartaColecaoModel.find({ colecaoId }).populate(
      "carta",
    );

    return res.status(200).json(cartas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// adicionar carta na coleção
export const addCartaColecao = async (req, res) => {
  try {
    const { colecaoId } = req.params;
    const { cartas } = req.body;

    if (!cartas || cartas.length === 0)
      return res.status(404).json({ error: "Cartas não encontradas ou Inválidas!" });

    const resultados = [];

    for(const c of cartas){
      const {cartaID, nome, jogo, setNome, raridade, printagem, imagem, quantidade = 1} = c;

      if(!cartaID) continue;

      //procura se a carta existe no banco
      let carta = await CartaModel.findOne({ cartaID });
  
      //se não existir, cria no banco
      if(!carta){
        carta = await CartaModel.create({
          cartaID,
          nome,
          jogo,
          setNome,
          raridade,
          printagem,
          imagem,
        });
      }

      console.log("carta: ", carta)
  
      //verifica se existe a carta na coleção
      let cartaExiste = await CartaColecaoModel.findOne({
        colecaoId,
        carta: carta._id,
      });

      // se existe, adiciona na propriedade de quantidade
      if(cartaExiste){
        cartaExiste.quantidade += quantidade;
        await cartaExiste.save();
        resultados.push(cartaExiste);
        continue;
      }

      //adiciona a carta na coleção
      const addCarta = await CartaColecaoModel.create({
        colecaoId,
        carta,
        quantidade,
      });
      // await addCarta.save();
      resultados.push(addCarta);
    }
    return res.status(200).json(resultados);
  } catch (erro) {
    console.error("ERRO NO CONTROLLER:", erro);
    res.status(500).json({ error: erro.message });
  }
};

export const editarCartaColecao = async(req,res) =>{
  try{
    const cartaColecao = await CartaColecaoModel.findById(req.params.id);
    if(!cartaColecao) return res.status(404).json({error: "Carta Coleção não encontrada"});
    // if(!cartaColecao.colecaoId.dono) return res.status(404).json({error: "Dono da coleção não encontrado"})

    //edita a coleção
    const cartaColecaoAtualizada = await CartaColecaoModel.findByIdAndUpdate(req.params.id, req.body, {$set: req.body, new: true, runValidators: true});

    return res.status(200).json(cartaColecaoAtualizada);
  }catch(erro){
    return res.status(500).json({erro: erro.message})
  }
}

// remover Coleção de cartas
export const deletarCartaColecao = async (req, res) => {
  try {
    const cartaColecao = await CartaColecaoModel.findByIdAndDelete(req.params.id);
    console.log("CartaColecao", cartaColecao)
    if (!cartaColecao) return res.status(404).json({ error: "Carta Coleção não encontrada" });

    await cartaColecao.save();

    return res.status(200).json({ message: "Carta Colecao removida com sucesso" });
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
};

// remover Coleção de cartas
export const removerCartaColecao = async (req, res) => {
  try {
    const { id } = req.params;
    const carta = await CartaColecaoModel.findByIdAndDelete(id);

    if (!carta) return res.status(404).json({ error: "Carta Coleção não encontrada" });

    await carta.save();

    return res.status(200).json({ message: "Carta removida com sucesso" });
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
};


// APENAS PARA CONVENIENCIA
export const deletarTodasCartas = async (req, res) => {
    try {
        // Apenas administradores podem fazer isso
        if (req.userRole !== "admin") {
            return res.status(403).json({ error: "Apenas administradores podem deletar tudo" });
        }

        const resultado = await CartaModel.deleteMany({});
        return res.status(200).res.json({ message: `Todas as cartas foram deletadas (${resultado.deletedCount} itens).` });
    } catch (erro) {
        return res.status(500).json({ error: erro.message });
    }
};

// APENAS PARA CONVENIENCIA
export const deletarTodasCartasColecao = async (req, res) => {
    try {
        // Apenas administradores podem fazer isso
        if (req.userRole !== "admin") {
            return res.status(403).json({ error: "Apenas administradores podem deletar tudo" });
        }

        const resultado = await CartaColecaoModel.deleteMany({});
        return res.status(200).res.json({ message: `Todas as coleçoes de cartas foram deletadas (${resultado.deletedCount} itens).` });
    } catch (erro) {
        return res.status(500).json({ error: erro.message });
    }
};
