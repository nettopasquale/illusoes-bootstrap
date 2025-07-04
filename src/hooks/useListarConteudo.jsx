// src/hooks/useListarConteudo.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useListarConteudo =(baseURL, tipo)=>{
  const [conteudos, setConteudos] = useState([]);
  const [erro, setErro] = useState(null);
    const [carregando, setCarregando] = useState(true);
    
      const navigate = useNavigate();

  useEffect(() => {
    const buscarConteudo = async () => {
      try {
        const response = await axios.get(`${baseURL}/${tipo}`);
        setConteudos(response.data);
      } catch (error) {
        setErro("Erro ao buscar conteúdo.");
        console.error("Erro:", error);
      } finally {
        setCarregando(false);
      }
    };

    if (tipo) buscarConteudo();
  }, [baseURL, tipo]);

  return { conteudos, erro, carregando, navigate };
}
