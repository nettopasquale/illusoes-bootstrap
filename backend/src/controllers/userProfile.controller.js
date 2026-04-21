import UserModel from "../models/user.model.js";
import UserProfile from "../models/userProfile.model.js";

//Criar Profile usuário

export const createUserProfile = async (req, res) => {
    try {
    const userId = req.userId;

    const perfilExistente = await UserModel.findOne({ usuario: userId });
    if (perfilExistente) {
      return res.status(400).json({ erro: "Perfil já existe para este usuário" });
    }

    const {usuario, sobrenome, avatar, dataNascimento} = req.body;

    if(!usuario || !sobrenome || !dataNascimento){
      return res.status(400).json({error: "Campos obrigatórios não preenchidos!"});
    }

    const novoPerfil = await perfilExistente.findByIdAndUpdate({
      usuario: userId,
      sobrenome,
      avatar,
      dataNascimento,
    });
    await novoPerfil.save();
    return res.status(201).json(novoPerfil);
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
}

// listar Profile de usuários por ID

export const getUserProfileByOne = async (req, res) => {
  try {
    const userId = req.userId;
    const perfil = await UserProfile.findOne({ usuario: userId });

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

    // tenta encontrar o perfil do usuário logado
    let userProfile = await UserModel.findOne({ usuario: userId });

    if (!userProfile) {
      return res.status(404).json({ message: "Perfil de usuário não encontrado!" });
    }

    // Atualiza os campos
    const userProfileAtualizado = await userProfile.findByIdAndUpdate(
      req.params.userId,
      {$set: req.body},
      {new: true, runValidators: true}
    )

    return res.status(200).json({ message: "Perfil de usuário atualizado com sucesso!" });
  } catch (erro) {
    console.error("Erro ao atualizar perfil:", erro);
    return res.status(500).json({ erro: erro.message });
  }
};


// deletar Profile do usuario

export const deleteUserProfile = async (req, res) => {
    try {
        const userProfile = await UserProfile.findOne({ usuario: userId });

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