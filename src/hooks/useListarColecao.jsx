import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useListarColecao = (baseURL) => {
  const [colecoes, setColecoes] = useState([]);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const buscarColecao = async () => {
      try {
        const response = await axios.get(`${baseURL}`);
        setColecoes(response.data);
      } catch (error) {
        setErro("Erro ao buscar coleção.");
        console.error("Erro:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarColecao();
  }, [baseURL]);

  return { colecoes, erro, carregando, navigate };
};
