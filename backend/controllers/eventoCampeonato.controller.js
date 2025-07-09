import EventoCamp from "../models/eventoCamp.model.js";

//Criar Evento ou Campeonato
export const criarEvento = async (req, res) => {
    try {
        const { titulo, subTitulo, conteudo, tags, dataEvento, valorEntrada } = req.body;
        const { tipo } = req.params;

        // Validação simples para evitar valores inválidos
        if (!["evento", "campeonato"].includes(tipo)) {
            return res.status(400).json({ error: "Tipo inválido: deve ser 'evento' ou 'campeonato'" });
        }

        const novoEvento = new EventoCamp({
            titulo,
            subTitulo,
            conteudo,
            imagem: req.file ? `/uploads/${req.file.filename}` : null,
            tipo,
            criador: req.userId,
            dataPublicacao: new Date(),
            tags: JSON.parse(tags || '[]'),
            dataEvento,
            valorEntrada

        });

        if (!titulo || !subTitulo || !conteudo) {
            return res.status(400).json({ error: "Campos obrigatórios devem ser preenchidos!" });
        }
        await novoEvento.save();
        res.status(201).json(novoEvento);
    } catch (erro) {
        res.status(500).json({ error: erro.message });
    }
};

// listar Evento ou Campeonato
export const listarEventos = async (req, res) => {
    try {
        const { tipo } = req.params; // Ex: ?tipo=evento

        const filtro = tipo ? { tipo } : {};

        const eventos = await EventoCamp.find(filtro).populate("criador", "usuario").sort({ createdAt: -1 });
        console.log("Evento populado:", eventos);
        res.json(eventos);
    } catch (erro) {
        res.status(500).json({ error: erro.message });
    }
};


// listar Evento ou Campeonato por ID
export const listarEventoPorID = async (req, res) => {
    try {
        const evento = await EventoCamp.findById(req.params.id).populate("criador", "usuario");

        if (!evento) return res.status(404).json({ error: "Evento não encontrado" });

        res.json(evento);
    }
    catch (erro) {
        res.status(500).json({ erro: erro.message })
    }
}

// atualizar Evento ou Campeonato
export const editarEvento = async (req, res) => {
    try {
        const evento = await EventoCamp.findById(req.params.id);

        if (!evento) return res.status(404).json({ error: "Evento não encontrado" });

        // Garante que só o autor  ou admn pode editar
        if (evento.criador.toString() !== req.userId
            && req.userRole !== "admin") {
            return res.status(403).json({ error: "Não autorizado" });
        }

        //imagem
        if (req.file) {
            req.body.imagem = `/uploads/${req.file.filename}`;
        }

        // Atualiza com os novos dados
        const eventoAtualizado = await EventoCamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        res.json(eventoAtualizado);
    } catch (erro) {
        res.status(500).json({ error: erro.message });
    }
};

// deletar Evento ou Campeonato
export const deletarEvento = async (req, res) => {
    try {
        const evento = await EventoCamp.findById(req.params.id);

        if (!evento) return res.status(404).json({ error: "Evento não encontrado" });

        //só o autor ou o admn podem deletar
        if (evento.criador.toString() !== req.userId
            && req.userRole !== "admin") {
            return res.status(403).json({ error: "Não autorizado" });
        }

        await evento.deleteOne();
        res.json({ message: "Evento deletado com sucesso" });
    } catch (erro) {
        res.status(500).json({ error: erro.message });
    }
};

// deleter eventos e campeonatos sem criador
export const deletarEventosSemCriador = async (req, res) => {
    try {
        if (req.userRole !== "admin") {
            return res.status(403).json({ error: "Apenas administradores podem deletar órfãos" });
        }

        const resultado = await EventoCamp.deleteMany({ criador: { $exists: false } });
        res.json({ message: `${resultado.deletedCount} eventos/campeonatos sem criador foram deletados.` });
    } catch (erro) {
        res.status(500).json({ error: erro.message });
    }
};

// APENAS PARA CONVENIENCIA
export const deletarTodosEventos = async (req, res) => {
    try {
        // Apenas administradores podem fazer isso
        if (req.userRole !== "admin") {
            return res.status(403).json({ error: "Apenas administradores podem deletar tudo" });
        }

        const resultado = await EventoCamp.deleteMany({});
        res.json({ message: `Todas os eventos/campeonatos foram deletados (${resultado.deletedCount} itens).` });
    } catch (erro) {
        res.status(500).json({ error: erro.message });
    }
};