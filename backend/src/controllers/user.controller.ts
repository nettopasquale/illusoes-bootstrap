import UserModel, {type User, type UserDocument} from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { key } from "../config.js";
import ConteudoModel, {type Conteudo, type ConteudoDocument} from "../models/conteudo.model.js";
import { type Request, type Response } from "express";
import { 
    type TypedRequestBody, 
    type TypedRequestParams, 
    type TypedResponse,
    type TypedRequestQuery } from "../types/http.types.js";


//interfaces
interface CriarUsuario{
    usuario: string
    email: string
    senha:string
}

interface UsuarioParams{
    id:string
}

interface LoginBody{
    login: string
    senha: string
}

interface LoginResponse{
    token: string
    usuario:{
        id: string
        nome: string
        email: string
    }
}

interface ConteudoResponse{

}

// rota do Login

export const login = async (
    req: TypedRequestBody<LoginBody>,
    res: TypedResponse<LoginResponse | {message: string} | {erro: string}>) => {
    const { login, senha } = req.body;

    try {
        const user = await UserModel.findOne({
            $or: [{ email: login }, { usuario: login }],
        });

        if (!user) return res.status(401).json({ message: "Usuário não encontrado" });

        const senhaValida = await bcrypt.compare(senha, user.senha);

        if (!senhaValida) return res.status(401).json({ message: "Senha inválida" })

        const token = jwt.sign(
        { 
            id: user._id, 
            email: user.email, 
            role: user.tipo 
        },
        key,
        { expiresIn: "24h" }
        );

        // console.log(token);

        res.json({
            token, 
            usuario:{ 
                id: user._id.toString(), 
                nome: user.usuario, 
                email: user.email 
            }
        })
        console.log("Requisição de login:");
        console.log("Login:", login);
        console.log("Email:", user.email);
        console.log("Usuário:", user.usuario);
        console.log("Tipo:", user.tipo);
        console.log("Senha enviada:", senha);
        console.log("Senha no banco:", user?.senha);
    } catch (erro) {
        if(erro instanceof Error){
            res.status(500).json({ message: erro.message })
            console.error("Erro ao logar: ", erro.message);
            console.log("Erro detalhado", erro)
        }
    }

}

//função protegida
export const funcaoProtegida = (req: Request, res: Response) => {
    res.json({ message: "Você acessou uma rota protegida!", userId: req.userId });
}

//Criar usuário

export const createUser = async (
    req: TypedRequestBody<CriarUsuario>,
    res: TypedResponse<User | {erro: string}>) => {
    const { usuario, email, senha } = req.body;

    try {
        const hash = await bcrypt.hash(senha, 10);

        const user = new UserModel({ 
            usuario, 
            email, 
            senha: hash 
        });
        console.log(`Este é o usuário: ${user.usuario}, ${user.email}, ${user.senha} `);
        await user.save();
        res.status(201).json(user);
    } catch (erro) {
        if (erro instanceof Error){
            res.status(400).json({ erro: erro.message });
            console.error("Erro ao salvar: ", erro.message);
            console.log("Detalhes: ", erro);
        }
    }

    console.log("Corpo da requisição: ", req.body);
}

// listar usuários

export const getAllUsers = async (
    req: Request, 
    res: Response) => {
    try {
        const users = await UserModel.find();
        res.json(users);
    }
    catch (erro) {
        if( erro instanceof Error) res.status(500).json({ erro: erro.message });
    }
}

// listar usuários por ID

export const getUserByID = async (
    req: TypedRequestParams<UsuarioParams>, 
    res: TypedResponse<UserDocument | {message: string} | {erro: string}>) => {
    try {
        const user = await UserModel.findById(req.params.id);

        if (!user) return res.status(404).json({ message: "Usuário não foi encontrado!" });
        res.json(user);
    }
    catch (erro) {
        if (erro instanceof Error) res.status(500).json({ erro: erro.message })
    }
}

// atualizar usuário

export const updateUser = async (
    req: TypedRequestParams<UsuarioParams>, 
    res: TypedResponse<UserDocument | {message: string} | {erro: string}>) => {
    try {
        const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });

        if (!user) return res.status(404).json({ message: "Usuário não foi encontrado!" });

        // Atualiza com os novos dados
        Object.assign(user, req.body);

        await user.save();
        res.json({ message: "Usuário atualizado com sucesso!" })
    }
    catch (erro) {
        if (erro instanceof Error) res.status(500).json({ erro: erro.message })
    }
}

// deletar usuario

export const deleteUser = async (
    req: TypedRequestParams<UsuarioParams>,
    res: TypedResponse<UserDocument | {message: string} | {erro: string}>) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.id);

        if (!user) return res.status(404).json({ message: "Usuário não foi encontrado!" });
        res.json({ message: "Usuário deletado com sucesso!" })
    }
    catch (erro) {
        if (erro instanceof Error) res.status(500).json({ erro: erro.message })
    }
}


//listar conteúdo do usuário

export const getUserContent = async (
    req: TypedRequestParams<UsuarioParams>, 
    res: TypedResponse<UserDocument | {message: string} | {erro: string}>) => {
    try {
        // console.log("Chegou na rota /user/conteudos");
        // console.log("Query tipo:", req.query.tipo);
        // console.log("UserID:", req.userId);

        const tipo = req.query.tipo;
        const userId = req.userId;

        const filtroBase = { autor: userId };

        if (tipo && tipo !== "todos") {
            filtroBase.tipo = tipo;
        }

        const conteudos = await ConteudoModel.find(filtroBase)
            .sort({ dataPublicacao: -1 })
            .lean();

        res.status(200).json(conteudos);
    } catch (erro) {
        if(erro instanceof Error){
            console.error("Erro ao buscar conteúdos do usuário:", erro);
            res.status(500).json({ erro: erro.message });
        }
    }
}