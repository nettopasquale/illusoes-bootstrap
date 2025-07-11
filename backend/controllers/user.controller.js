import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { key } from "../config.js";
import NoticiaArtigo from "../models/noticiaArtigo.model.js";
import EventoCamp from "../models/eventoCamp.model.js";
// rota do Login

export const login = async (req, res) => {
    const { login, senha } = req.body;

    try {
        const user = await User.findOne({
            $or: [{ email: login }, { usuario: login }],
        });

        if (!user) return res.status(401).json({ message: "Usuário não encontrado" });

        const senhaValida = await bcrypt.compare(senha, user.senha);

        if (!senhaValida) return res.status(401).json({ message: "Senha inválida" })

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.tipo },
            key,
            { expiresIn: "24h" }
        );
        console.log(token);

        res.json({
            token, usuario:
                { id: user._id, nome: user.usuario, email: user.email }
        })
        console.log("Requisição de login:");
        console.log("Login:", login);
        console.log("Email:", user.email);
        console.log("Usuário:", user.usuario);
        console.log("Tipo:", user.tipo);
        console.log("Senha enviada:", senha);
        console.log("Senha no banco:", user?.senha);
    } catch (erro) {
        res.status(500).json({ message: erro.message })
        console.error("Erro ao logar: ", erro.message);
        console.log("Erro detalhado", erro)
    }

}

//função protegida
export const funcaoProtegida = (req, res) => {
    res.json({ message: "Você acessou uma rota protegida!", userId: req.userId });
}

//Criar usuário

export const createUser = async (req, res) => {
    const { usuario, email, senha } = req.body;

    try {
        const hash = await bcrypt.hash(senha, 10);
        const user = new User({ usuario, email, senha: hash });
        console.log(`Este é o usuário: ${user.usuario}, ${user.email}, ${user.senha} `);
        await user.save();
        res.status(201).json(user);
    } catch (erro) {
        res.status(400).json({ erro: erro.message });
        console.error("Erro ao salvar: ", erro.message);
        console.log("Detalhes: ", erro);
    }

    console.log("Corpo da requisição: ", req.body);
}

// listar usuários

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    }
    catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

// listar usuários por ID

export const getUserByID = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ message: "Usuário não foi encontrado!" });
        res.json(user);
    }
    catch (erro) {
        res.status(500).json({ erro: erro.message })
    }
}

// atualizar usuário

export const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });

        if (!user) return res.status(404).json({ message: "Usuário não foi encontrado!" });

        // Atualiza com os novos dados
        Object.assign(user, req.body);

        await user.save();
        res.json({ message: "Usuário atualizado com sucesso!" })
    }
    catch (erro) {
        res.status(500).json({ erro: erro.message })
    }
}

// deletar usuario

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) return res.status(404).json({ message: "Usuário não foi encontrado!" });
        res.json({ message: "Usuário deletado com sucesso!" })
    }
    catch (erro) {
        res.status(500).json({ erro: erro.message })
    }
}


//listar conteúdo do usuário

export const getUserContent = async (req, res) => {
    try {
        console.log("Chegou na rota /user/conteudos");
        console.log("Query tipo:", req.query.tipo);
        console.log("UserID:", req.userId);

        const tipo = req.query.tipo;
        const userId = req.userId;

        let resultados = [];

        if (!tipo || tipo === "todos") {
            const [noticias, eventos] = await Promise.all([
                NoticiaArtigo.find({ autor: userId }).lean(),
                EventoCamp.find({ criador: userId }).lean(),
            ]);

            resultados = [
                ...noticias.map((item) => ({ ...item, tipo: item.tipo })), // noticia ou artigo
                ...eventos.map((item) => ({ ...item, tipo: item.tipo })), // evento ou campeonato
            ];
            console.log(resultados)
        } else if (["noticia", "artigo"].includes(tipo)) {
            const noticias = await NoticiaArtigo.find({ autor: userId, tipo }).lean();
            resultados = noticias.map((item) => ({ ...item, tipo }));
            console.log(resultados)
        } else if (["evento", "campeonato"].includes(tipo)) {
            const eventos = await EventoCamp.find({ criador: userId, tipo }).lean();
            resultados = eventos.map((item) => ({ ...item, tipo }));
            console.log(resultados)
        } else {
            return res.status(400).json({ error: "Tipo inválido" });
        }

        // Ordena por data de publicação decrescente
        resultados.sort((a, b) => new Date(b.dataPublicacao).getTime() - new Date(a.dataPublicacao).getTime());

        res.json(resultados);
    } catch (err) {
        console.error("Erro ao buscar conteúdos do usuário:", err);
        console.error(err.stack);

        res.status(500).json({ error: err.message });
    }
}