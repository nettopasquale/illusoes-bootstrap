import EventoCamp from "../models/eventoCamp.model.js";

//Criar Evento ou Campeonato
export const criarEvento = async (req, res) => {
    try {
        const { titulo, subTitulo, conteudo, imagem, tipo } = req.body;

        // Validação simples para evitar valores inválidos
        if (!["evento", "campeonato"].includes(tipo)) {
            return res.status(400).json({ error: "Tipo inválido: deve ser 'evento' ou 'campeonato'" });
        }

        const novoEvento = new EventoCamp({
            titulo,
            subTitulo,
            conteudo,
            imagem,
            tipo,
            criador: req.userId,
            dataPublicacao: new Date()

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
        const { tipo } = req.query; // Ex: ?tipo=evento

        const filtro = tipo ? { tipo } : {};

        const eventos = await EventoCamp.find(filtro).populate("criador", "evento");
        res.json(eventos);
    } catch (erro) {
        res.status(500).json({ error: erro.message });
    }
};


// listar Evento ou Campeonato por ID
export const listarEventoPorID = async (req, res) => {
    try {
        const evento = await EventoCamp.findById(req.params.id);

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

        // Garante que só o autor pode editar
        if (evento.criador.toString() !== req.usuarioId) {
            return res.status(403).json({ error: "Não autorizado" });
        }

        // Atualiza com os novos dados
        Object.assign(evento, req.body);

        await evento.save();
        res.json(evento);
    } catch (erro) {
        res.status(500).json({ error: erro.message });
    }
};

// deletar Evento ou Campeonato
export const deletarEvento = async (req, res) => {
    try {
        const evento = await EventoCamp.findById(req.params.id);

        if (!evento) return res.status(404).json({ error: "Evento não encontrado" });

        if (evento.criador.toString() !== req.usuarioId) {
            return res.status(403).json({ error: "Não autorizado" });
        }

        await evento.deleteOne();
        res.json({ message: "Evento deletado com sucesso" });
    } catch (erro) {
        res.status(500).json({ error: erro.message });
    }
};
