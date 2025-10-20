import ForumCategoria from "../models/forumCategoria.model.js";
import forumSubForum from "../models/forumSubForum.model.js";


//Criar Categoria
export const criarCategoria = async (req, res) => {
  try {
    const { nome, descricao, restrito, ordem } = req.body;

    const novaCategoria = new ForumCategoria({
      nome,
      descricao,
      restrito: restrito || false,
      ordem: ordem || 0,
    });

    await novaCategoria.save();
    res.status(201).json(novaCategoria);

  } catch (error) {
    res.status(500).json({ message: "Erro ao criar categoria", error })
  }
};

//Editar Categoria
export const editarCategoria = async (req, res) => {
  try {
    const categoriaAtualizada = await ForumCategoria.findByIdAndUpdate(req.params.id, req.body, { new: true }
    );

    if (!categoriaAtualizada) return res.status(404).json({ error: "Categoria não encontrada" });

    res.json(categoriaAtualizada);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar categoria", error });
  }
};

// Excluir Categoria
export const excluirCategoria = async (req, res) => {
  try {
    const categoria = await ForumCategoria.findByIdAndDelete(req.params.id);

    if (!categoria) return res.status(404).json({ message: "Categoria não encontrada" });

    //deletar subforuns caso existam

    await forumSubForum.deleteMany({ categoriaId: req.params.id });
    res.json({ message: "Categoria e subforums removidos com sucesso." })
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir categoria", error });
  }
};

//Listar Categoria
export const listarCategoria = async (req, res) => {
  try {
    const categorias = await ForumCategoria.find()
      .sort({ ordem: 1 }) // ordem pode ser personalizada
      .populate("subforums");
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar categorias", error });
  }
};


//Criar Subforum
export const criarSubforum = async (req, res) => {
  try {
    const { nome, descricao, categoriaId } = req.body;

    const categoria = await ForumCategoria.findById(categoriaId);
    if (!categoria) return res.status(404).json({ message: "Categoria não encontrada" });

    //atenção aqui
    const novoSubForum = new forumSubForum({ nome, descricao, categoriaId: categoria });
    await novoSubForum.save();

    //vincular subforum à categoria
    categoria.subforuns.push(novoSubForum._id);
    await categoria.save();

    res.status(201).json(novoSubForum);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar subfórum", error });
  }
};

//Editar Subforum
export const editarSubforum = async (req, res) => {
  try {
    const subForumAtualizado = await forumSubForum.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!subForumAtualizado) return res.status(404).json({ message: "Subfórum não encontrado" });
    res.json(subForumAtualizado);

  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar subfórum", error });
  }
};

// Excluir Subforum
export const excluirSubForum = async (req, res) => {
  try {
    const subForum = await forumSubForum.findByIdAndDelete(req.params.id);
    if (!subForum) return res.status(404).json({ message: "Subfórum não encontrado" });

    //remover referência na categoria
    await ForumCategoria.updateOne(
      { _id: subForum.categoriaId },
      { $pull: { subforuns: subForum._id } }
    );
    res.json({ message: "Subfórum excluído com sucesso" });

  } catch (erro) {
    res.status(500).json({ message: "Erro ao excluir subfórum", erro });
  }
};
