
import Anuncio from "../models/anuncio.model.js";

//Criar Anuncio
export const criarAnuncio = async (req, res) => {
    try {
        const { titulo, descricao, tipo, preco, imagem, disponivel } = req.body;

        // Validação simples para evitar valores inválidos
        if (!["carta", "deck", "box", "booster", "sleeve", "playmate"].includes(tipo)) {
            return res.status(400).json({ error: "Tipo inválido: deve ser 'carta' ou 'deck' ou 'box' ou 'booster' ou 'sleeve' ou 'playmate'" });
        }

        const novoAnuncio = new Anuncio({
            titulo,
            descricao,
            tipo,
            preco,
            imagem,
            disponivel,
            vendedor: req.userId,
            dataPublicacao: new Date()
        });

        if (!titulo || !descricao || !tipo || !preco || !imagem || !disponivel) {
            return res.status(400).json({ error: "Campos obrigatórios devem ser preenchidos!" });
        }
        await novoAnuncio.save();
        res.status(201).json(novoAnuncio);
    } catch (erro) {
        res.status(500).json({ error: erro.message });
    }
};

// listar Anuncio
export const listarAnuncios = async (req, res) => {
    try {
        const { tipo } = req.query; // Ex: ?tipo=artigo

        const filtro = tipo ? { tipo } : {};

        const anuncios = await Anuncio.find(filtro).populate("vendedor", "anuncio");
        res.json(anuncios);
    } catch (erro) {
        res.status(500).json({ error: erro.message });
    }
};


// listar Anuncio por ID
export const listarAnuncioPorID = async (req, res) => {
    try {
        const anuncio = await Anuncio.findById(req.params.id);

        if (!anuncio) return res.status(404).json({ error: "Anúncio não encontrado" });

        res.json(anuncio);
    }
    catch (erro) {
        res.status(500).json({ erro: erro.message })
    }
}

// atualizar Anuncio
export const editarAnuncio = async (req, res) => {
    try {
        const anuncio = await Anuncio.findById(req.params.id);

        if (!anuncio) return res.status(404).json({ error: "Anúncio não encontrado" });

        // Garante que só o vendedor ou admn pode editar
        if (anuncio.vendedor.toString() !== req.userId
            && req.usuarioTipo !== "admin") {
            return res.status(403).json({ error: "Não autorizado" });
        }

        //imagem
        if (req.file) {
            req.body.imagem = `/uploads/${req.file.filename}`;
        }

        // Atualiza com os novos dados
        const anuncioAtualizado = await Anuncio.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators:true });

        res.json(anuncioAtualizado);
    } catch (erro) {
        res.status(500).json({ error: erro.message });
    }
};

// deletar Anuncio
export const deletarAnuncio = async (req, res) => {
    try {
        const anuncio = await Anuncio.findById(req.params.id);

        if (!anuncio) return res.status(404).json({ error: "Anúncio não encontrado" });

        //apenas vendedor e admin podem deletar
        if (anuncio.vendedor.toString() !== req.userId
            && req.usuarioTipo !== "admin") {
            return res.status(403).json({ error: "Não autorizado" });
        }

        await anuncio.deleteOne();
        res.json({ message: "Anúncio deletado com sucesso" });
    } catch (erro) {
        res.status(500).json({ error: erro.message });
    }
};
