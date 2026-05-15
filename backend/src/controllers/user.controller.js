import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { key } from "../configs/jwtConfig.js";
import ConteudoModel from "../models/conteudo.model.js";
import ColecaoModel from "../models/colecao.model.js";
import TopicoPost from "../models/TopicoPost.model.js";
import DenunciaModel from "../models/denuncia.model.js";
import ComentarioModel from "../models/comentario.model.js";
import LikeModel from "../models/like.model.js"
import mongoose from "mongoose";
import { enviarEmailRedefinicao } from "../configs/resend.js";


// rota do Login
export const login = async (req, res) => {
  const { login, senha } = req.body;

  try {
    const user = await UserModel.findOne({
      $or: [{ email: login }, { usuario: login }],
    });

    if (!user)
      return res.status(401).json({ message: "Usuário não encontrado" });

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida)
      return res.status(401).json({ message: "Senha inválida" });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.tipo,
      },
      key,
      { expiresIn: "24h" },
    );

    res.json({
      token,
      usuario: {
        _id: user._id.toString(),
        nome: user.usuario,
        email: user.email,
        tipo: user.tipo,
      },
    });
  } catch (erro) {
    res.status(500).json({ message: erro.message });
    console.error("Erro ao logar: ", erro.message);
    console.log("Erro detalhado", erro);
  }
};

//função protegida
export const funcaoProtegida = (req, res) => {
  res.json({ message: "Você acessou uma rota protegida!", userId: req.userId });
};

//Criar usuário
export const createUser = async (req, res) => {
  const { usuario, email, senha } = req.body;

  try {
    const hash = await bcrypt.hash(senha, 10);

    const user = new UserModel({
      usuario,
      email,
      senha: hash,
    });
    console.log(
      `Este é o usuário: ${user.usuario}, ${user.email}, ${user.senha} `,
    );
    await user.save();
    res.status(201).json(user);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
    console.error("Erro ao salvar: ", erro.message);
    console.log("Detalhes: ", erro);
  }

  console.log("Corpo da requisição: ", req.body);
};

// listar usuários
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (erro) {
    if (erro instanceof Error) res.status(500).json({ erro: erro.message });
  }
};

// listar usuários por ID
export const getUserByID = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "Usuário não foi encontrado!" });
    res.json(user);
  } catch (erro) {
    if (erro instanceof Error) res.status(500).json({ erro: erro.message });
  }
};

// atualizar usuário
export const updateUser = async (req, res) => {
  try {    
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user)
      return res.status(404).json({ message: "Usuário não foi encontrado!" });

    // Atualiza com os novos dados
    Object.assign(user, req.body);

    await user.save();
    res.json({ message: "Usuário atualizado com sucesso!" });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

// deletar usuario
export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);

    if (!user)
      return res.status(404).json({ message: "Usuário não foi encontrado!" });
    res.json({ message: "Usuário deletado com sucesso!" });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

//redefinir senha
export const solicitarRedefinicaoSenha = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    // Responde igual mesmo se email não existir — evita enumerar usuários
    if (!user)
      return res
        .status(200)
        .json({ message: "Se este email existir, você receberá um link." });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetSenhaToken = token;
    user.resetSenhaExpira = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    await user.save();

    // Enviar email com o link
    await enviarEmailRedefinicao(user.email, token); // função separada com nodemailer

    return res
      .status(200)
      .json({ message: "Se este email existir, você receberá um link." });
  } catch (erro) {
    return res.status(500).json({ error: erro.message });
  }
};

// user.controller.js — redefinir senha com o token
export const redefinirSenha = async (req, res) => {
  try {
    const { token, novaSenha } = req.body;

    const user = await UserModel.findOne({
      resetSenhaToken: token,
      resetSenhaExpira: { $gt: new Date() }, // token ainda válido
    });

    if (!user)
      return res.status(400).json({ error: "Token inválido ou expirado." });

    user.senha = await bcrypt.hash(novaSenha, 10);
    user.resetSenhaToken = null;
    user.resetSenhaExpira = null;
    await user.save();

    return res.status(200).json({ message: "Senha redefinida com sucesso." });
  } catch (erro) {
    return res.status(500).json({ error: erro.message });
  }
};

//listar conteúdo do usuário
export const getUserConteudo = async (req, res) => {
  try {
    const tipo = req.query.tipo;
    const userId = req.userId;

    const filtroBase = { autor: userId };

    if (tipo && tipo !== "todos") {
      filtroBase.tipo = tipo;
    }

    const conteudos = await ConteudoModel.find(filtroBase)
      .sort({ dataPublicacao: -1 })
      .lean();

    return res.status(200).json(conteudos);
  } catch (erro) {
    console.error("Erro ao buscar conteúdos do usuário:", erro);
    return res.status(500).json({ erro: erro.message });
  }
};

//listar coleções do usuário
export const getUserColecoes = async (req, res) => {
  try {
    const userId = req.userId;

    const colecoes = await ColecaoModel.find({ dono: userId })
      .sort({ dataPublicacao: -1 })
      .lean();

    return res.status(200).json(colecoes);
  } catch (erro) {
    console.error("Erro ao buscar coleções do usuário:", erro);
    return res.status(500).json({ erro: erro.message });
  }
};

//listar tópicos do usuário
export const getUserTopicos = async (req, res) => {
  try {
    const userId = req.userId;

    const filtroBase = { autor: userId };

    const topicos = await TopicoPost.find(filtroBase)
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(topicos);
  } catch (erro) {
    console.error("Erro ao buscar conteúdos do usuário:", erro);
    return res.status(500).json({ erro: erro.message });
  }
};

//listar postagens do usuário
export const getUserPosts = async (req, res) => {
  try {
    const userId = req.userId;

    const topicos = await TopicoPost.find(
      {
        "postagens.autor": userId,
        deletado: false,
      },
      { titulo: 1, categoria: 1, postagens: 1 },
    );

    const posts = topicos.flatMap((t) =>
      t.postagens
        .filter((p) => String(p.autor) === String(userId) && !p.deletado)
        .map((p) => ({
          ...p.toObject(),
          topicoId: t._id,
          topicoTitulo: t.titulo,
          categoria: t.categoria,
        })),
    );

    return res.status(200).json(posts);
  } catch (erro) {
    console.error("Erro ao buscar conteúdos do usuário:", erro);
    return res.status(500).json({ erro: erro.message });
  }
};

//listar curtidas do usuário
//buscar likes
// user.controller.js — getUserLikes corrigido
export const getUserLikes = async (req, res) => {
  try {
    const userId = req.userId;

    const likes = await LikeModel.aggregate([
      { $match: { usuario: new mongoose.Types.ObjectId(userId) } },

      // Busca conteúdos que batem com o targetId
      {
        $lookup: {
          from: "conteudos",
          let: { tid: "$targetId", tipo: "$targetTipo" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$tid"] },
                    { $eq: ["$$tipo", "conteudo"] },
                  ],
                },
              },
            },
            { $project: { titulo: 1, tipo: 1, thumbs: 1 } },
          ],
          as: "conteudoData",
        },
      },

      // Busca coleções que batem com o targetId
      {
        $lookup: {
          from: "colecaos", // Mongoose pluraliza "Colecao" como "colecaos"
          let: { tid: "$targetId", tipo: "$targetTipo" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$tid"] },
                    { $eq: ["$$tipo", "colecao"] },
                  ],
                },
              },
            },
            { $project: { nome: 1, capa: 1 } },
          ],
          as: "colecaoData",
        },
      },

      // Monta um campo "entidade" com o documento encontrado
      {
        $addFields: {
          entidade: {
            $cond: {
              if:   { $eq: ["$targetTipo", "conteudo"] },
              then: { $arrayElemAt: ["$conteudoData", 0] },
              else: { $arrayElemAt: ["$colecaoData",  0] },
            },
          },
        },
      },

      { $sort: { createdAt: -1 } },

      {
        $project: {
          targetId:   1,
          targetTipo: 1,
          createdAt:  1,
          entidade:   1,  // título, thumbs, etc já populados
        },
      },
    ]);

    return res.status(200).json(likes);
  } catch (erro) {
    return res.status(500).json({ error: erro.message });
  }
};

//listar comentários do usuário
export const getUserComentarios = async(req, res)=>{
  try {
    const userId = req.userId;

    const comentarios = await ComentarioModel.aggregate([
      { $match: { autor: new mongoose.Types.ObjectId(userId) } },

      // Busca conteúdos que batem com o targetId
      {
        $lookup: {
          from: "conteudos",
          let: { tid: "$targetId", tipo: "$targetTipo" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$tid"] },
                    { $eq: ["$$tipo", "conteudo"] },
                  ],
                },
              },
            },
            { $project: { titulo: 1, tipo: 1, thumbs: 1 } },
          ],
          as: "conteudoData",
        },
      },

      // Busca coleções que batem com o targetId
      {
        $lookup: {
          from: "colecaos", // Mongoose pluraliza "Colecao" como "colecaos"
          let: { tid: "$targetId", tipo: "$targetTipo" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$tid"] },
                    { $eq: ["$$tipo", "colecao"] },
                  ],
                },
              },
            },
            { $project: { nome: 1, capa: 1 } },
          ],
          as: "colecaoData",
        },
      },

      // Monta um campo "entidade" com o documento encontrado
      {
        $addFields: {
          entidade: {
            $cond: {
              if: { $eq: ["$targetTipo", "conteudo"] },
              then: { $arrayElemAt: ["$conteudoData", 0] },
              else: { $arrayElemAt: ["$colecaoData", 0] },
            },
          },
        },
      },

      { $sort: { createdAt: -1 } },

      {
        $project: {
          targetId: 1,
          targetTipo: 1,
          createdAt: 1,
          entidade: 1, // título, thumbs, etc já populados
        },
      },
    ]);

    return res.status(200).json(comentarios);
  } catch (erro) {
    return res.status(500).json({ error: erro.message });
  }
}

//listar denuncias do usuário
// GET /denuncias/minhas
// Lista as denúncias que o usuário logado criou
export const getUserDenuncias = async (req, res) => {
  try {
    const { targetId } = req.params;
    const { targetTipo } = req.query;
    const denuncias = await DenunciaModel.find({ autor: req.userId })
      .populate("denunciado", "usuario")
      .sort({ createdAt: -1 });

    return res.status(200).json(denuncias);
  } catch (erro) {
    return res.status(500).json({ error: erro.message });
  }
};

// listar Profile de usuários por ID
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const perfil = await UserModel.findById(userId);
    console.log("Perfil: ", perfil)

    if (!perfil) return res.status(404).json({ erro: "Perfil não encontrado" });

    return res.status(200).json(perfil);
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
}

// atualizar Profile do usuário
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { usuario, ...rest } = req.body;

    if(usuario){
      const usuarioExistente = await UserModel.findOne({usuario});

      if(usuarioExistente && usuarioExistente._id.toString() !== userId)
        return res.status(400).json({erro: "Nome do usuário já em uso"})
    }

    // tenta encontrar o perfil do usuário logado
    let userProfile = await UserModel.findByIdAndUpdate(
      userId,
      {
        ...rest,
        ...(usuario && { usuario }),
      },
      { new: true, runValidators: true },
    );

    if(!userProfile)
      return res.status(404).json({erro: "Usuário não encontrado"})

    return res.status(200).json({ userProfile });
  } catch (erro) {
    console.error("Erro ao atualizar perfil:", erro);
    return res.status(500).json({ erro: erro.message });
  }
};

// deletar Profile do usuario
export const deleteUserProfile = async (req, res) => {
    try {
      const userId = req.userId;
      const userProfile = await UserModel.findById(userId);

      if (!userProfile)
        return res.status(404).json({ message: "Perfil de Usuário não foi encontrado!" });

      if(userProfile.usuario.toString() !== req.userId || req.userRole !== "admin")
        return res.status(403).json({error: "Não autorizado"});

      await userProfile.deleteOne()

      return res.status(200).json({ message: "Perfil de Usuário deletado com sucesso!" })
    }
    catch (erro) {
      return res.status(500).json({ erro: erro.message })
    }
}