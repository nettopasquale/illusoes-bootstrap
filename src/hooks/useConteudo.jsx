// src/hooks/useConteudo.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export const useConteudo = (baseURL) => {
  const { id, tipo } = useParams(); 

  const [conteudo, setConteudo] = useState(null);
  const [erro, setErro] = useState(null);

  console.log("useConteudo", { baseURL, tipo, id });

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

  return { tipo, id, conteudo, erro };
};
