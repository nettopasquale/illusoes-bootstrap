import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { criarDenuncia } from "../services/denunciasService";
import { 
    listarTopicosPorId,
    curtirTopico,
    criarBookmarkTopico,
    editarTopico,
    deletarTopico,
    publicarPostagem,
} from "../services/forumService";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export const useForumTopicos = (topicoId) => {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  const [topico, setTopico] = useState(null);
  const [error, setError] = useState(null);
  const [curtidas, setCurtidas] = useState(0);
  const [curtiu, setCurtiu] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [successo, setSuccesso] = useState("");
  const [denunciaMotivo, setDenunciaMotivo] = useState("");
  const [showDenuncia, setShowDenuncia] = useState(false);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [editandoTopico, setEditandoTopico] = useState(false);
  const [tituloEditado, setTituloEditado] = useState("");
  const [conteudoEditado, setConteudoEditado] = useState("");
  const [tagsEditadas, setTagsEditadas] = useState("");
  const POSTS_POR_PAGINA = 20;

  //carregar topicos existentes
  useEffect(() => {
    const buscarTopico = async () => {
      try {
        const { data } = await listarTopicosPorId(topicoId);
        setTopico(data);
        setCurtidas(data.curtidas);
        setCurtiu(data.curtidoPor?.map(String).includes(String(usuario?._id)));
        setBookmarked(
          data.bookmarkedPor?.map(String).includes(String(usuario?._id)),
        );
      } catch {
        setError("Tópico não encontrado.");
      } finally {
        setLoading(false);
      }
    };
    buscarTopico();
  }, [topicoId, usuario]);

  const flash = (msg) => {
    setSuccesso(msg);
    setTimeout(() => setSuccesso(""), 3500);
  };

  const handleCurtida = async () => {
    if (!usuario) return navigate("/login");

    if (usuario?.banido === true) {
      toast.error("Você está banido. Entre em contato com a moderação.");
      return;
    }
    try {
      const { data } = await curtirTopico(topicoId);
      setCurtidas(data.curtidas);
      setCurtiu(data.curtiu);
    } catch {
      /* silencioso */
    }
  };

  const handleBookmark = async () => {
    if (!usuario) return navigate("/login");

    if (usuario?.banido === true) {
          toast.error("Você está banido. Entre em contato com a moderação.");
          return;
    }

    try {
      const { data } = await criarBookmarkTopico(topicoId);
      setBookmarked(data.bookmarked);
      console.log("Bookmarked?: ", data.bookmarked);
      flash(
        data.bookmarked ? "Tópico salvo nos bookmarks!" : "Bookmark removido.",
      );
    } catch {
      /* silencioso */
    }
  };

  const handleDeletarTopico = async () => {
    const msg =
      usuario?.tipo === "admin" &&
      String(topico.autor?._id) !== String(usuario?._id)
        ? "Remover este tópico como administrador?"
        : "Excluir este tópico?";
    if (!window.confirm(msg)) return;

    if (usuario?.banido === true) {
      toast.error("Você está banido. Entre em contato com a moderação.");
      return;
    }
    try {
      await deletarTopico(topicoId);
      navigate("/forum");
    } catch {
      toast.error("Erro ao excluir.");
    }
  };

  const handleDenunciarTopico = async () => {
    if (usuario?.banido === true) {
      toast.error("Você está banido. Entre em contato com a moderação.");
      return;
    }

    if (!denunciaMotivo.trim()) return;
    setSalvando(true);
    try {
      await criarDenuncia({
        denunciado: topico.autor?._id, // ID do autor do tópico
        targetId: topicoId, // ID do tópico em si
        targetTipo: "topico",
        motivo: denunciaMotivo,
      });
      setShowDenuncia(false);
      setDenunciaMotivo("");
      toast.success("Denúncia enviada. Obrigado!");
    } catch {
      toast.error("Erro ao enviar denúncia.");
    } finally {
      setSalvando(false);
    }
  };
  // Ativa o modo de edição — popula os states com os valores atuais do tópico
  const handleAbrirEdicaoTopico = () => {
    setTituloEditado(topico.titulo);
    setConteudoEditado(topico.conteudo);
    setTagsEditadas(topico.tags?.join(", ") || "");
    setEditandoTopico(true);
  };

  // Salva as alterações chamando a API
  const handleSalvarEdicaoTopico = async () => {

    if (usuario?.banido === true) {
      toast.error("Você está banido. Entre em contato com a moderação.");
      return;
    }
    if (!tituloEditado.trim() || !conteudoEditado.trim()) {
      toast.error("Título e conteúdo são obrigatórios.");
      return;
    }
    setSalvando(true);
    try {
      const tagsArray = tagsEditadas
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const { data } = await editarTopico(topicoId, {
        titulo: tituloEditado.trim(),
        conteudo: conteudoEditado.trim(),
        tags: tagsArray,
      });

      // Atualiza o state local com o retorno da API
      setTopico((prev) => ({ ...prev, ...data }));
      setEditandoTopico(false);
      flash("Tópico editado com sucesso!");
    } catch {
      toast.error("Erro ao salvar edição.");
    } finally {
      setSalvando(false);
    }
  };

  //VER AQUI
  const handlePublicarPost = async (postData) => {
    if (!usuario) return navigate("/login");

    if (usuario?.banido === true) {
      toast.error("Você está banido. Entre em contato com a moderação.");
      return;
    }
    setPostLoading(true);
    try {
      const { data } = await publicarPostagem(topicoId, postData);
      setTopico((prev) => ({
        ...prev,
        postagens: [...prev.postagens, data],
        postagensContador: (prev.postagensContador || 0) + 1,
      }));
      setQuotedPost(null);
      flash("Resposta publicada!");
      const totalPaginas = Math.ceil(
        (topico.postagens.length + 1) / POSTS_POR_PAGINA,
      );
      setPagina(totalPaginas);
      setTimeout(
        () =>
          document
            .getElementById(`reply-${data._id}`) //ver aqui
            ?.scrollIntoView({ behavior: "smooth" }),
        200,
      );
    } catch {
      toast.error("Erro ao publicar resposta.");
    }
    setPostLoading(false);
  };

  const handleDeletarPost = (postId) => {
    if (usuario?.banido === true) {
      toast.error("Você está banido. Entre em contato com a moderação.");
      return;
    }

    setTopico((prev) => ({
      ...prev,
      postagens: prev.postagens.map((r) =>
        r._id === postId
          ? { ...r, deletado: true, conteudo: "[Post removido]" }
          : r,
      ),
      postagensContador: Math.max((prev.postagensContador || 1) - 1, 0),
    }));
  };

  const handleAtualizarPost = (postId, postAtualizado) => {
    
  if (usuario?.banido === true) {
      toast.error("Você está banido. Entre em contato com a moderação.");
      return;
  }

    setTopico((prev) => ({
      ...prev,
      postagens: prev.postagens.map((r) =>
        r._id === postId ? { ...r, ...postAtualizado } : r,
      ),
    }));
  };

  return {
    topico,
    setTopico,
    error,
    setError,
    curtidas,
    setCurtidas,
    curtiu,
    bookmarked,
    postLoading,
    setPostLoading,
    successo,
    setSuccesso,
    denunciaMotivo,
    setDenunciaMotivo,
    showDenuncia,
    setShowDenuncia,
    salvando,
    setSalvando,
    pagina,
    setPagina,
    editandoTopico,
    setEditandoTopico,
    tituloEditado,
    setTituloEditado,
    conteudoEditado,
    setConteudoEditado,
    tagsEditadas,
    setTagsEditadas,
    // funções
    flash,
    handleCurtida,
    handleBookmark,
    handleDeletarTopico,
    handleDenunciarTopico,
    handleAbrirEdicaoTopico,
    handleSalvarEdicaoTopico,
    handlePublicarPost,
    handleDeletarPost,
    handleAtualizarPost,
  };
};
