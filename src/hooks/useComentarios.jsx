import { useContext, useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

export const useComentarios = (targetId, targetTipo, token) => {
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const {usuario} = useContext(AuthContext)
  //api.get(`/comentarios/${targetId}?targetTipo=colecao`)
  //busca comentarios existentes
  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const res = await api.get(`/comentarios/${targetId}?targetTipo=${targetTipo}`);
        console.log("Buscando comentários:", targetId, targetTipo);

        setComentarios(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (targetId) fetchComentarios();
  }, [targetId]);

  const criarComentario = async (conteudo, parentId = null) => {
    if (!token) return toast.error("Precisa estar logado");

    if (usuario?.banido === true) {
      toast.error("Você está banido. Entre em contato com a moderação.");
      return;
    }

    try {
      const res = await api.post("/comentarios", {
        conteudo,
        targetId,
        targetTipo,
        parentId,
      });
      setComentarios((prev) => [res.data, ...prev]);
      toast.success("Comentário publicado!")
    } catch (err) {
      console.error("Erro ao criar comentário: ", err);
      toast.error("Erro ao publicar comentário :(");
    }
  };

  const deletarComentario = async (id) => {
    if (usuario?.banido === true) {
        toast.error("Você está banido. Entre em contato com a moderação.");
        return;
    }
    try {
      await api.delete(`/comentarios/${id}`);

      setComentarios((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Erro ao deletar comentário: ", err);
    }
  };

  const curtirComentario = async (id) => {
    if (usuario?.banido === true) {
      toast.error("Você está banido. Entre em contato com a moderação.");
      return;
    }
    try {
      const res = await api.post(`/likes`, {targetId, targetTipo});

      //likes: Array(res.data.totalLikes).fill(0)
      setComentarios((prev) =>
        prev.map((c) =>
          c._id === id
            ? { ...c, curtidasTotais: res.data.curtidasTotais }
            : c,
        ),
      );
    } catch (err) {
      console.error("Erro ao curtir comentário: ", err);
    }
  };

  return {
    comentarios,
    criarComentario,
    deletarComentario,
    curtirComentario,
    loading,
  };
};
