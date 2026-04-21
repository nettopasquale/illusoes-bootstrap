import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { key } from "../configs/jwtConfig.js";
import ConteudoModel from "../models/conteudo.model.js";
import ColecaoModel from "../models/colecao.model.js";
import TopicoPost from "../models/TopicoPost.model.js";

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

    // console.log(token);

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

    const colecoes = await ColecaoModel.findById(userId)
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
      .sort({ dataPublicacao: -1 })
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

    const filtroBase = { autor: userId };

    const topicos = await TopicoPost.find(filtroBase);
    const posts = topicos.postagens.autor(filtroBase)

    return res.status(200).json(conteudos);
  } catch (erro) {
    console.error("Erro ao buscar conteúdos do usuário:", erro);
    return res.status(500).json({ erro: erro.message });
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