import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export const useListarConteudo = (tipo) => {
  const [conteudos, setConteudos] = useState([]);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const buscarConteudo = async () => {
      try {
        const response = await api.get(`/conteudos/${tipo}`);
        setConteudos(response.data);
      } catch (error) {
        setErro("Erro ao buscar conteúdo.");
        console.error("Erro:", error);
      } finally {
        setCarregando(false);
      }
    };

    if (tipo) {
      buscarConteudo();
    }
  }, [tipo]);

  return { conteudos, erro, carregando, navigate };
};
