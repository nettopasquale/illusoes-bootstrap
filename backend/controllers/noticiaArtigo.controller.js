
import NoticiaArtigo from "../models/noticiaArtigo.model.js";

//Criar Noticia ou Artigo
export const criarNoticia = async (req, res) => {
    try {
        const { titulo, subTitulo, conteudo, imagem, tipo } = req.body;

        // Validação simples para evitar valores inválidos
        if (!["noticia", "artigo"].includes(tipo)) {
            return res.status(400).json({ error: "Tipo inválido: deve ser 'noticia' ou 'artigo'" });
        }

        const novaNoticia = new NoticiaArtigo({
            titulo,
            subTitulo,
            conteudo,
            imagem,
            tipo,
            autor: req.userId,
            dataPublicacao: new Date()

        });

        if (!titulo || !subTitulo || !conteudo) {
            return res.status(400).json({ error: "Campos obrigatórios devem ser preenchidos!" });
        }
        await novaNoticia.save();
        res.status(201).json(novaNoticia);
    } catch (erro) {
        res.status(500).json({ error: erro.message });
    }
};

// listar Noticias ou Artigos
export const listarNoticias = async (req, res) => {
    try {
        const { tipo } = req.query; // Ex: ?tipo=artigo

        const filtro = tipo ? { tipo } : {};

        const noticias = await NoticiaArtigo.find(filtro).populate("autor", "nome");
        res.json(noticias);
    } catch (erro) {
        res.status(500).json({ error: erro.message });
    }
};


// listar Noticias ou Artigos por ID
export const listarNoticiaPorID = async (req, res) => {
    try {
        const noticia = await NoticiaArtigo.findById(req.params.id);

        if (!noticia) return res.status(404).json({ error: "Notícia não encontrada" });

        res.json(noticia);
    }
    catch (erro) {
        res.status(500).json({ erro: erro.message })
    }
}

// atualizar Noticia ou Artigo
export const editarNoticia = async (req, res) => {
    try {
        const noticia = await NoticiaArtigo.findById(req.params.id);

        if (!noticia) return res.status(404).json({ error: "Notícia não encontrada" });

        // Garante que só o autor pode editar
        if (noticia.autor.toString() !== req.usuarioId) {
            return res.status(403).json({ error: "Não autorizado" });
        }

        // Atualiza com os novos dados
        Object.assign(noticia, req.body);

        await noticia.save();
        res.json(noticia);
    } catch (erro) {
        res.status(500).json({ error: erro.message });
    }
};

// deletar Noticia ou Artigo
export const deletarNoticia = async (req, res) => {
    try {
        const noticia = await NoticiaArtigo.findById(req.params.id);

        if (!noticia) return res.status(404).json({ error: "Notícia não encontrada" });

        if (noticia.autor.toString() !== req.usuarioId) {
            return res.status(403).json({ error: "Não autorizado" });
        }

        await noticia.deleteOne();
        res.json({ message: "Notícia deletada com sucesso" });
    } catch (erro) {
        res.status(500).json({ error: erro.message });
    }
};
