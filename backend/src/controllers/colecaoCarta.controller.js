import Carta from "../models/carta.model"
import CartaColecao from "../models/cartaColecao.model"
import dotenv from "dotenv";
dotenv.config();

const url = "https://api.justtcg.com/v1/cards";

// buscar carta da JustTCG
export const buscarCartas = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q)
      return res
        .status(400)
        .json({ error: "Parâmetro de busca não informado!" });

    const respostaCarta = await fetch(`${url}?q=${encodeURIComponent(q)}`, {
      headers: {
        "x-api-key": process.env.JUSTTCG_API_KEY,
      },
    });

    if (!respostaCarta.ok)
      return res
        .status(respostaCarta.status)
        .json({ error: "Erro ao consultar API JustTCG" });

    const dados = await respostaCarta.json();

    if (!dados || dados.length === 0)
      return res.status(404).json({ error: "Carta não encontrada" });

    return res.status(200).json(dados);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

// adicionar carta na coleção
export const addCartaColecao = async (req, res) => {
  try {
    const { colecaoId } = req.params.id;
    const { cartaID, nome, quantidade, imagem, jogo, setNome } = req.body;

    if (!cartaID)
      return res.status(404).json({ error: "Carta não encontrada ou Inválida!" });

    //procura se a carta existe no banco
    let carta = await Carta.findOne({cartaID});

    //se não existir, cria no banco
    if(!carta){
      carta = await Carta.create({
        cartaID,
        nome,
        jogo,
        setNome
      })
    }

    //verifica se existe a carta na coleção
    let cartaExiste = await CartaColecao.findOne({
      colecaoId,
      carta: cartaID
    })

    // se existe, adiciona na propriedade de quantidade
    if(cartaExiste){
      cartaExiste.quantidade += 1;
      await cartaExiste.save();
      return res.status(200).json(cartaExiste);
    }

    //adiciona a carta na coleção
    const addCarta = new CartaColecao({
      colecaoId,
      carta: carta.cartaID,
      quantidade: quantidade,
      imagem,
    });

    await addCarta.save();

    return res.status(200).json(addCarta);
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
};

// remover carta da Coleção
export const deletarCartaColecao = async (req, res) => {
  try {
    const { id } = req.params;
    const carta = await CartaColecao.findByIdAndDelete(id);

    if (!carta) return res.status(404).json({ error: "Carta não encontrada" });

    await carta.save();

    return res.status(200).json({ message: "Carta removida com sucesso" });
  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
};