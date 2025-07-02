// src/hooks/useConteudo.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export function useConteudo(baseURL) {
  const { tipo, id } = useParams();
  const [conteudo, setConteudo] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarConteudo = async () => {
      try {
        const response = await axios.get(`${baseURL}/${tipo}/${id}`);
        setConteudo(response.data);
      } catch (err) {
        setErro("Conteúdo não encontrado.");
      }
    };

    if (id) buscarConteudo();
  }, [baseURL, id]);

  return { tipo, conteudo, erro };
}
