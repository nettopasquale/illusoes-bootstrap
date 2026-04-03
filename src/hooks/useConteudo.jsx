// src/hooks/useConteudo.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import api from "../services/api";

export const useConteudo = () => {
  const { id, tipo } = useParams(); 
  const [conteudo, setConteudo] = useState(null);
  const [erro, setErro] = useState(null);

  console.log("useConteudo", {tipo, id });

  useEffect(() => {
    const buscarConteudo = async () => {
      try {
        const response = await api.get(`/${tipo}/${id}`);
        setConteudo(response.data);
      } catch (err) {
        setErro("Conteúdo não encontrado.");
      }
    };

    if (id) buscarConteudo();
  }, [id]);

  return { tipo, id, conteudo, erro };
};
