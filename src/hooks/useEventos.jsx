import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export function useEventos() {
  const { tipo, id } = useParams();
  const [conteudo, setConteudo] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const carregarEvento = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/eventos/${id}`
        );
        setConteudo(response.data);
      } catch (error) {
        console.error("Erro ao buscar evento/campeonato:", error);
        setErro("Não foi possível carregar o evento/campeonato.");
      }
    };

    carregarEvento();
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
