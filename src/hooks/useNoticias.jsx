import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export function useNoticias() {
  const { tipo, id } = useParams();
  const [conteudo, setConteudo] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const carregarNoticia = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/noticias/${id}`
        );
        setConteudo(response.data);
      } catch (error) {
        console.error("Erro ao buscar notícia:", error);
        setErro("Não foi possível carregar a notícia.");
      }
    };

    carregarNoticia();
  }, [id]);

    return {
        tipo,
        conteudo,
        erro,
        id,
        setConteudo,
        setErro
  };
}
