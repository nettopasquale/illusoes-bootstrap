import ConteudoModel from "../models/conteudo.model.js";
//Criar Conteúdo de Noticias, Artigos, Evento ou Campeonato
export const criarConteudo = async (req,res) => {
    try {
        const { titulo, subTitulo, texto, tags, dataEvento, valorEntrada,thumbs } = req.body;
        const { tipo } = req.params;

        const imagens = req.files?.imagem
            ? req.files.imagem.map(img => img.filename)
            : [];

        // Validação simples para evitar valores inválidos
        if (!["noticia", "artigo", "evento", "campeonato"].includes(tipo)) {
            return res.status(400).json({ error: "Tipo inválido: deve ser 'noticia', 'artigo','evento' ou 'campeonato'" });
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
        if (conteudo.autor.toString() !== req.userId
            && req.userRole !== "admin") {
            return res.status(403).json({ error: "Não autorizado" });
        }

        // Atualiza com os novos dados
        const conteudoAtualizado = await ConteudoModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body},
            {new: true, runValidators: true}
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