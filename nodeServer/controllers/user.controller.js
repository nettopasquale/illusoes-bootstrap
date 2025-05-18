import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const key = process.env.MONGO_URI;

// rota do Login

export const login = async(req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await User.findOne({ email });

        if (!usuario) return res.status(401).json({ message: "Usuário não encontrado" });

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) return res.status(401).json({ message: "Senha inválida" })
        
        const token = jwt.sign(
            { id: usuario._id, email: usuario.email },
            key,
            { expiresIn: "2h" }
        );

        res.json({
            token, usuario:
                { id: usuario._id, nome: usuario.nome, email: usuario.email }
        })
    } catch (erro) {
        res.status(500).json({message: erro.message})
    }
}

//função protegida
export const funcaoProtegida = (req, res) => {
    res.json({ message: "Você acessou uma rota protegida!", usuarioId: req.usuarioId });
}

//Criar usuário

export const createUser = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const hash = await bcrypt.hash(senha, 8);
        const user = new User({ nome, email, senha: hash});
        await user.save();
        res.status(201).json(user);
    } catch (erro) {
        res.status(400).json({ erro: erro.message });
    }
}

// listar usuários

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    }
    catch(erro) {
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
    catch(erro) {
        res.status(500).json({erro: erro.message})
    }
}

// atualizar usuário

export const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });

        if (!user) return res.status(404).json({ message: "Usuário não foi encontrado!" });
        res.json({message: "Usuário atualizado com sucesso!"})
    }
    catch(erro) {
        res.status(500).json({erro: erro.message})
    }
}

// deletar usuario

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) return res.status(404).json({ message: "Usuário não foi encontrado!" });
        res.json({message: "Usuário deletado com sucesso!"})
    }
    catch(erro) {
        res.status(500).json({erro: erro.message})
    }
}