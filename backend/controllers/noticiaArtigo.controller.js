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
        const { tipo } = req.params; // Ex: ?tipo=artigo
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
        console.log("Conteúdo noticia");
        console.log(noticia);

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

        // Verifica se o campo autor existe antes de usar toString()
        if (
            (!noticia.autor || noticia.autor.toString() !== req.userId) &&
            req.userRole !== "admin"
        ) {
            return res.status(403).json({ error: "Autor inexistente ou incorreto" });
        }

        // Garante que só o autor ou o admin pode editar
        if (noticia.autor.toString() !== req.userId
            && req.userRole !== "admin") {
            return res.status(403).json({ error: "Não autorizado" });
        }

        //imagem
        if (req.file) {
            req.body.imagem = `/uploads/${req.file.filename}`;
        }

        // Atualiza com os novos dados
        const noticiaAtualizada = await NoticiaArtigo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        res.status(200).json(noticiaAtualizada);
    } catch (erro) {
        res.status(500).json({ error: erro.message });
    }
};

// deletar Noticia ou Artigo
export const deletarNoticia = async (req, res) => {
    try {
        const noticia = await NoticiaArtigo.findById(req.params.id);
        console.log("Conteúdo noticia");
        console.log(noticia);

        if (!noticia) return res.status(404).json({ error: "Notícia não encontrada" });

        if (
            (!noticia.autor || noticia.autor.toString() !== req.userId) &&
            req.userRole !== "admin"
        ) {
            return res.status(403).json({ error: "Não autorizado" });
        }

        // Garante que ou o autor ou o admin deletem a noticia/artigo
        if (noticia.autor.toString() !== req.userId
            && req.userRole !== "admin") {
            return res.status(403).json({ error: "Não autorizado" });
        }

        await noticia.deleteOne();
        res.json({ message: "Notícia deletada com sucesso" });
    } catch (erro) {
        res.status(500).json({ error: erro.message });
    }
};

//Deletar noticias sem autor
export const deletarNoticiasSemAutor = async (req, res) => {
    try {
        if (req.userRole !== "admin") {
            return res.status(403).json({ error: "Apenas administradores podem deletar órfãos" });
        }

        const resultado = await NoticiaArtigo.deleteMany({ autor: { $exists: false } });
        res.json({ message: `${resultado.deletedCount} notícias/artigos sem autor foram deletados.` });
    } catch (erro) {
        res.status(500).json({ error: erro.message });
    }
};

// APENAS PARA CONVENIENCIA
export const deletarTodasNoticias = async (req, res) => {
    try {
        // Apenas administradores podem fazer isso
        if (req.userRole !== "admin") {
            return res.status(403).json({ error: "Apenas administradores podem deletar tudo" });
        }

        const resultado = await NoticiaArtigo.deleteMany({});
        res.json({ message: `Todas as notícias/artigos foram deletados (${resultado.deletedCount} itens).` });
    } catch (erro) {
        res.status(500).json({ error: erro.message });
    }
};
