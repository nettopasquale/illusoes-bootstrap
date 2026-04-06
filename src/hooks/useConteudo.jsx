// src/hooks/useConteudo.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cloudinaryUpload } from "../utils/cloudinaryUpload";
import api from "../services/api";
import { toast } from "react-toastify";

export const useConteudo = (id, edicao) => {
  const [conteudo, setConteudo] = useState(null);
  const [texto, setTexto] = useState("");
  const [titulo, setTitulo] = useState("");
  const [subTitulo, setSubTitulo] = useState("");
  const [tipo, setTipo] = useState(null);
  const [tags, setTags] = useState([]);
  const [thumbs, setThumbs] = useState(null);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [imagems, setImagens] = useState(null);
  const [dataEvento, setDataEvento] = useState(null);
  const [valorEntrada, setValorEntrada] = useState("");
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);
 
  const navigate = useNavigate();
  const { tipo: tipoParam } = useParams();

  const tipoFinal = tipo?.value || tipoParam;

  //busca Conteudo pelo id quando a rota de edição é acessada
  useEffect(() => {
    const buscarConteudo = async () => {
      try {
        const response = await api.get(`/conteudos/${tipoFinal}/${id}`);
        setConteudo(response.data);
      } catch (err) {
        setErro("Conteúdo não encontrado.");
      }
    };

    if (id) buscarConteudo();
  }, [id, tipoFinal]);

  //popular dados se for edicao
  useEffect(() => {
    if (edicao && conteudo) {
      setTitulo(conteudo.titulo);
      setSubTitulo(conteudo.subTitulo);
      setTipo({value: conteudo.tipo, label: conteudo.tipo})
      setTexto(conteudo.texto);
      setThumbs(conteudo.thumbs);
      setDataEvento(conteudo.dataEvento ? new Date(conteudo.dataEvento) : null);
      setValorEntrada(
        conteudo.valorEntrada != null ? conteudo.valorEntrada.toString() : "",
      );
      setTags(conteudo.tags?.map((tag) => ({ value: tag, label: tag })) || []);
      
    }
  }, [edicao, conteudo]);

  //Publicar ou Editar Conteudo
  const publicarEditarConteudo = async (e) => {
    e.preventDefault();
    if (!tipo) return setErro("Escolha um tipo de conteúdo");
    if (!thumbs) {
      toast.error("Aguarde o upload da thumb terminar!");
      return;
    }

    //formatar valor de entrada, caso exista
    const valorLimpo = typeof valorEntrada === "string" 
    ? valorEntrada.replace("R$", "").trim().replace(",", ".")
    : String(valorEntrada);
    const valorNumerico = parseFloat(valorLimpo);

    const payload = {
      titulo,
      subTitulo,
      tipo: tipo.value,
      tags: JSON.stringify(tags.length ? tags.map((t) => t.value) : []),
      texto,
      dataEvento: dataEvento ? dataEvento.toISOString() : "",
      valorEntrada: isNaN(valorNumerico) ? 0 : valorNumerico,
      thumbs,
    };

    //checa se é edicao, se n vai para a criacao
    if(edicao){
      try {
        await api.put(`/conteudos/${tipo.value}/${id}`,payload);
        setMensagem(`Alterações realizadas com sucesso!`);
        toast.success("Alterações realizadas com sucesso!");
        setErro("");
        setTimeout(() => navigate("/dashboard"), 2000);
      }catch(err) {
        console.error(err);
        setErro("Erro ao alterar conteúdo");
        toast.error("Erro ao alterar conteúdo :(");
      }
    }else{
      try{
        const result = await api.post(`/conteudos/${tipo.value}`, payload);
        // console.log("dados enviados:", payload);
        setMensagem(`Publicação realizada com sucesso! ${result.data}`);
        toast.success("Publicação realizada com sucesso!");
        setErro(null);
        setTimeout(() => navigate("/"), 3000);
        }catch (err) {
          console.error(err);
          console.log(`Erro: ${err.data}`);
          setErro("Erro ao publicar conteúdo");
          toast.error("Erro ao publicar conteúdo :(");
        }
      }
  };

  // Excluir conteúdo
  const excluirConteudo = async () => {
    try {
      await api.delete(`/conteudos/${tipo.value}/${id}`);
      setMensagem("Conteúdo excluído com sucesso!");
      toast.success("Conteúdo deletado com sucesso!")
      setErro(null);
      setTimeout(() => navigate("/usuario"), 3000);
    } catch (err) {
      console.error(err);
      setErro("Erro ao excluir conteúdo");
      toast.success("Erro ao deletar conteúdo :(");
    }
  };

  //handleThumb
  const handleThumb = async (e) => {
    const file = e.target.files[0]
    console.log(file);
  
    if (!file) return;
    setUploadingThumb(true);
    try {
      const url = await cloudinaryUpload(file, "thumbs");
      console.log("URL da thumb:", url);
  
      setThumbs(url);
    } catch (err) {
      console.error("Erro ao subir thumb:", err);
    } finally {
      setUploadingThumb(false);
    }
  };

  //handleImagens
    const handleImagens = async(e) => {
      const file = e.target.files[0]
      console.log(file);
  
      if (!file) return;
      setUploadingImagens(true);
      try {
        const url = await cloudinaryUpload(file, "imagesConteudo");
        console.log("URL das imagens:", url); // 👈 teste
  
        setImagens(url);
      } catch (err) {
        console.error("Erro ao subir imagens:", err);
      } finally {
        setUploadingImagens(false);
      }
    };

  return {
    titulo,
    setTitulo,
    subTitulo,
    setSubTitulo,
    tipo,
    setTipo,
    tags,
    setTags,
    thumbs,
    setThumbs,
    uploadingThumb,
    setUploadingThumb,
    dataEvento,
    setDataEvento,
    valorEntrada,
    setValorEntrada,
    texto,
    setTexto,
    mensagem,
    setMensagem,
    erro,
    setErro,
    conteudo,
    setConteudo,
    id,
    navigate,
    publicarEditarConteudo,
    excluirConteudo,
    handleThumb,
    handleImagens,
  };
};;;
