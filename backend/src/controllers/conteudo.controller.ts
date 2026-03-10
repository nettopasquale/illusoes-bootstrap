import ConteudoModel from "../models/conteudo.model.js";
import { type Request, type Response } from "express";
import { 
    type TypedRequestBody, 
    type TypedRequestParams, 
    type TypedResponse,
    type TypedRequestQuery } from "../types/http.types.js";

//Criar Conteúdo de Noticias, Artigos, Evento ou Campeonato
export const criarConteudo = async (
    req: Request,
    res: Response) => {
    try {
        const { titulo, subTitulo, conteudo, tags, dataEvento, valorEntrada,thumbs } = req.body;
        const { tipo } = req.params;


        console.log("THUMBS RECEBIDO:", thumbs);

        const imagens = req.files?.imagem
            // @ts-ignore
            ? req.files.imagem.map(img => img.filename)
            : [];


        // Validação simples para evitar valores inválidos
        if (!["noticia", "artigo", "evento", "campeonato"].includes(tipo)) {
            return res.status(400).json({ error: "Tipo inválido: deve ser 'noticia', 'artigo','evento' ou 'campeonato'" });
        }

        if (!titulo || !subTitulo || !conteudo) {
            return res.status(400).json({ error: "Campos obrigatórios devem ser preenchidos!" });
        }


        const novoConteudo = new ConteudoModel({
            titulo,
            subTitulo,
            conteudo,
            thumbs,
            imagens,
            tipo,
            autor: req.userId,
            dataPublicacao: new Date(),
            tags: JSON.parse(tags || "[]"),
            dataEvento,
            valorEntrada
        });

        console.log("NOVO CONTEÚDO:", req.body);
        console.log("NOVA THUMB ENVIADA:", novoConteudo.thumbs);

        await novoConteudo.save();
        return res.status(201).json(novoConteudo);
    } catch (erro) {
        // @ts-ignore
        return res.status(500).json({ error: erro.message });
    }
};

// listar Conteúdo de Noticias, Artigos, Evento ou Campeonato
// @ts-ignore
export const listarConteudos = async (req, res) => {
    try {
        const { tipo } = req.params;

        const conteudos = await ConteudoModel.find({ tipo: tipo.toLowerCase() }).populate("autor", "usuario").sort({ createdAt: -1 });
        console.log("Conteúdo populado:", conteudos);
        return res.status(200).json(conteudos);
    } catch (erro) {
        // @ts-ignore
        return res.status(500).json({ error: erro.message });
    }
};


// listar Conteúdo de Noticias, Artigos, Evento ou Campeonato por ID
// @ts-ignore
export const listarConteudoPorID = async (req, res) => {
    try {
        const conteudo = await ConteudoModel.findById(req.params.id).populate("autor", "usuario");

        if (!conteudo) return res.status(404).json({ error: "Conteúdo não encontrado" });

        return res.status(200).json(conteudo);
    }
    catch (erro) {
        // @ts-ignore
        return res.status(500).json({ erro: erro.message })
    }
}

// atualizar Conteúdo de Noticias, Artigos, Evento ou Campeonato
// @ts-ignore
export const editarConteudo = async (req, res) => {
    try {
        const conteudo = await ConteudoModel.findById(req.params.id);

        if (!conteudo) return res.status(404).json({ error: "Conteudo não encontrado" });

        if (!conteudo.autor) return res.status(404).json({ error: "Autor não encontrado" });

        // Garante que só o autor  ou admn pode editar
        if (conteudo.autor.toString() !== req.userId
            && req.userRole !== "admin") {
            return res.status(403).json({ error: "Não autorizado" });
        }

        //thumb
        // if (req.file?.thumbs?.length) {
        //     req.body.thumbs = `/uploads/thumbs/${req.file.filename}`;
        // }
        if (req.file?.thumbs?.length) {
            conteudo.thumbs = req.body.thumbs;
        }


        // Atualiza com os novos dados
        const conteudoAtualizado = await ConteudoModel.findByIdAndUpdate(req.params.id, req.body, { $set: req.body, new: true, runValidators: true });

        return res.status(200).json(conteudoAtualizado);
    } catch (erro) {
        // @ts-ignore
        return res.status(500).json({ error: erro.message });
    }
};

// deletar Conteúdo de Noticias, Artigos, Evento ou Campeonato
// @ts-ignore
export const deletarConteudo = async (req, res) => {
    try {
        const conteudo = await ConteudoModel.findById(req.params.id);

        if (!conteudo) return res.status(404).json({ error: "Conteúdo não encontrado" });

        //só o autor ou o admn podem deletar
        // @ts-ignore
        if (conteudo.autor.toString() !== req.userId
            && req.userRole !== "admin") {
            return res.status(403).json({ error: "Não autorizado" });
        }

        await conteudo.deleteOne();
        return res.status(200).json({ message: "Conteúdo deletado com sucesso" });
    } catch (erro) {
        // @ts-ignore
        return res.status(500).json({ error: erro.message });
    }
};

// deleter conteudos sem criador -- APENAS ADMIN
// @ts-ignore
export const deletarConteudosSemCriador = async (req, res) => {
    try {
        if (req.userRole !== "admin") {
            return res.status(403).json({ error: "Apenas administradores podem deletar órfãos" });
        }

        const resultado = await ConteudoModel.deleteMany({ autor: { $exists: false } });
        return res.status(200).json({ message: `${resultado.deletedCount} conteúdos sem criador foram deletados.` });
    } catch (erro) {
        // @ts-ignore
        return res.status(500).json({ error: erro.message });
    }
};

// APENAS PARA CONVENIENCIA
// @ts-ignore
export const deletarTodosEventos = async (req, res) => {
    try {
        // Apenas administradores podem fazer isso
        if (req.userRole !== "admin") {
            return res.status(403).json({ error: "Apenas administradores podem deletar tudo" });
        }

        const resultado = await ConteudoModel.deleteMany({});
        return res.status(200).res.json({ message: `Todas os conteúdos foram deletados (${resultado.deletedCount} itens).` });
    } catch (erro) {
        // @ts-ignore
        return res.status(500).json({ error: erro.message });
    }
};