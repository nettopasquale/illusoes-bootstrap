import UserProfile from "../models/userProfile.model.js";

//Criar Profile usuário

export const createUserProfile = async (req, res) => {
    try {
    const userId = req.userId;

    const perfilExistente = await UserProfile.findOne({ usuario: userId });
    if (perfilExistente) {
      return res.status(400).json({ erro: "Perfil já existe para este usuário" });
    }

      const novoPerfil = new UserProfile({
        ...req.body,
        imagemProfile: req.file ? `/uploads/${req.file.filename}` : null,
        usuario: userId
      });
    await novoPerfil.save();
    res.status(201).json(novoPerfil);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

// listar Profile de usuários por ID

export const getUserProfileByOne = async (req, res) => {
  try {
    const userId = req.userId;
    const perfil = await UserProfile.findOne({ usuario: userId });

    if (!perfil) return res.status(404).json({ erro: "Perfil não encontrado" });

    res.json(perfil);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}


// atualizar Profile do usuário

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    // tenta encontrar o perfil do usuário logado
    let userProfile = await UserProfile.findOne({ usuario: userId });

    if (!userProfile) {
      return res.status(404).json({ message: "Perfil de usuário não encontrado!" });
    }

    // Atualiza os campos
    Object.assign(userProfile, req.body);

    if (req.file) {
      userProfile.imagemProfile = `/uploads/${req.file.filename}`;
    }

    await userProfile.save();

    res.json({ message: "Perfil de usuário atualizado com sucesso!" });
  } catch (erro) {
    console.error("Erro ao atualizar perfil:", erro);
    res.status(500).json({ erro: erro.message });
  }
};


// deletar Profile do usuario

export const deleteUserProfile = async (req, res) => {
    try {
        const userProfile = await UserProfile.findByIdAndDelete(req.params.id);

        if (!userProfile) return res.status(404).json({ message: "Perfil de Usuário não foi encontrado!" });
        res.json({ message: "Perfil de Usuário deletado com sucesso!" })
    }
    catch (erro) {
        res.status(500).json({ erro: erro.message })
    }
}