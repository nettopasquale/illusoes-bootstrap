import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cloudinaryUpload } from "../utils/cloudinaryUpload";
import api from "../services/api";
import { toast } from "react-toastify";

export const useColecao = (colecaoId, edicao) => {
  const [colecoes, setColecoes] = useState([]);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [capa, setCapa] = useState("");
  const [uploadingCapa, setUploadingCapa] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const navigate = useNavigate();

  //busca coleção
  useEffect(() => {
    const buscarColecao = async () => {
      try {
        const response = await api.get(`/colecoes`);
        console.log("resposta: ", response.data);
        setColecoes(response.data);
      } catch (error) {
        setErro("Erro ao buscar coleção.");
        console.error("Erro:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarColecao();
  }, []);

  //buscar dados se for edição
  useEffect(() => {
    if (edicao) {
      const buscarColecaoExistente = async () => {
        try {
          const res = await api.get(`/colecoes/${colecaoId}`);
          const colecao = res.data;
          console.log("Colecao atual: ", colecao);

          setNome(colecao.nome);
          setDescricao(colecao.descricao);
          setCapa(colecao.capa);
        } catch (error) {
          console.error("Erro ao buscar coleção: ", error);
        }
      };
      buscarColecaoExistente();
    }
  }, [colecaoId, edicao]);

  const publicarColecao = async (e) => {
    e.preventDefault();

    if (!nome.trim()) {
      toast.error("O nome da coleção é obrigatório.");
      return;
    }

    if (!capa) {
      toast.error("Aguarde o upload da capa terminar!");
      return;
    }

    const payload = {
      nome,
      descricao,
      capa,
    };

    try {
      //checa se modo edição é verdadeiro, se não procede apenas com a criação
      if (edicao) {
        await api.put(`/colecoes/${colecaoId}`, payload);
        setMensagem("Coleção atualizada com sucesso!");
      } else {
        const resultado = await api.post(`/colecoes`, payload);
        console.log("coleção enviada: ", payload);

        setMensagem(`Coleção criada com sucesso! ${resultado.data}`);
        setErro(null);
      }
      setTimeout(() => navigate("/colecoes"), 2000);
    } catch (error) {
      console.error("Erro ao publicar a coleção: ", error);
    }
  };

  //salva a imagem na variavel capa e envia a imagem para o cloudinary
  const handleCapa = async (e) => {
    const file = e.target.files[0];
    console.log("a imagem:", file);

    if (!file) return;
    setUploadingCapa(true);

    try {
      const url = await cloudinaryUpload(file, "capa");
      console.log("URL da capa: ", url);

      setCapa(url);
    } catch (error) {
      console.error("Erro ao subir capa: ", error);
    } finally {
      setUploadingCapa(false);
    }
  };

  const excluirColecao = async (colecaoId) => {
    if (!isDono) return;

    const confirmacao = window.confirm(
      "Tem certeza que deseja excluir a coleção?",
    );
    if (!confirmacao) return;
    try {
      await api.delete(`/colecoes/${colecaoId}`);
      navigate(`/colecoes`);
    } catch (error) {
      console.error("Erro ao excluir a coleção: ", error);
    }
  };

  return {
    nome,
    setNome,
    descricao,
    setDescricao,
    capa,
    setCapa,
    mensagem,
    setMensagem,
    colecoes,
    handleCapa,
    publicarColecao,
    excluirColecao,
    setColecoes,
    erro,
    carregando,
    navigate,
  };
};;
