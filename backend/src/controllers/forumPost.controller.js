import ForumTopico from "../models/forumTopico.model.js";
import ForumPost from "../models/forumPost.model.js";

//Criar Postagem
export const criarPost = async (req, res) => {
    try {
        const { conteudo } = req.body;
        const { topicoId } = req.params;
        const userId = req.user.id;

        const topico = await ForumTopico.findById(topicoId);
        if (!topico) return res.status(404).json({ message: "Tópico não encontrado" });

        if (topico.status === "trancado") return res.status(403).json({ message: "O tópico está trancado." });

        const novoPost = new ForumPost({
            topico: topicoId,
            autor: userId,
            conteudo,
            dataCriacao: new Date(),
        });

        await novoPost.save();

        // Atualiza o tópico
        topico.posts.push(novoPost._id);
        topico.totalPosts += 1;
        topico.ultimoPost = {
            usuarioId: userId,
            data: new Date(),
        };
        topico.dataModificacao = new Date();
        await topico.save();

        res.status(201).json(novoPost);
    } catch (erro) {
        res.status(500).json({ message: "Erro ao criar post", erro });
    }
};

// listar postagens
export const listarPosts = async (req, res) => {
    try {
        const { topicoId } = req.params;

        const posts = await ForumPost.find({ topico: topicoId })
            .populate("autor", "nome")
            .sort({ dataCriacao: 1 }); // mais antigos primeiro

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar posts", error });
    }
}

//Editar postagem
export const editarPost = async (req, res) => {
    try {
        const { conteudo } = req.body;
        const userId = req.user.id;

        const post = await ForumPost.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post não encontrado" });

        // Permite apenas autor ou admin editar
        if (post.autor.toString() !== userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Permissão negada" });
        }

        post.conteudo = conteudo || post.conteudo;
        post.dataModificacao = new Date();
        post.editado = true; // rever aqui
        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Erro ao editar post", error });
    }
};

// Excluir Postagem
export const excluirPost = async (req, res) => {
    try {
        const userId = req.user.id;

        const post = await ForumPost.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post não encontrado" });

        if (post.autor.toString() !== userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Permissão negada" });
        }

        // Remove do banco e do tópico
        await ForumPost.findByIdAndDelete(req.params.id);
        await ForumTopico.updateOne({ _id: post.topicoId }, { $pull: { posts: post._id } });

        res.json({ message: "Post excluído com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao excluir post", error });
    }
};

// curtir post
export const curtirPost = async (req, res) => {
    try {
        const userId = req.user.id;

        const post = await ForumPost.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post não encontrado" });

        // Evita curtidas duplicadas
        if (post.curtidas.includes(userId)) {
            post.curtidas = post.curtidas.filter((uid) => uid.toString() !== userId);
        } else {
            post.curtidas.push(userId);
        }

        await post.save();
        res.json({ message: "Curtida atualizada", totalCurtidas: post.curtidas.length });
    } catch (error) {
        res.status(500).json({ message: "Erro ao curtir post", error });
    }
};