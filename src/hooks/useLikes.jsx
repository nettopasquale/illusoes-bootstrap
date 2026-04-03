import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

export const useLike = (targetId, targetTipo, token) => {
  const [curtido, setCurtido] = useState(false);
  const [curtidasTotais, setcurtidasTotais] = useState(0);
  const [loading, setLoading] = useState(false);

  // buscar total inicial
  useEffect(() => {
    const fetchLikes = async () => {
        if(!targetId){
            setLoading(false);
            return;
        }
      try {
        const res = await api.get(`/likes/${targetId}/${targetTipo}`);
        setcurtidasTotais(res.data.curtidasTotais);
      } catch (err) {
        console.error(err);
      }
    };

    if (targetId) fetchLikes();
  }, [targetId, targetTipo]);

  const toggleLike = async () => {
    if (!token) return toast.error("Você precisa estar logado");

    setLoading(true);

    try {
      const res = await api.post("/likes",{ targetId, targetTipo });

      setCurtido(res.data.curtiu);
      setcurtidasTotais(res.data.curtidasTotais);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    curtido,
    curtidasTotais,
    toggleLike,
    loading,
  };
};
