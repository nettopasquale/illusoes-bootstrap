import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { schemaNoticia } from "../schema/schema";

export default function useCriarNoticia() {
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  //react hook com yup para controlar os dados do cadastro
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
      resolver: yupResolver(schemaNoticia)
  });

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/noticias",
        data,
        {
          headers: { Authorization: token },
        }
      );

      setMensagem("Notícia criada com sucesso!");
      reset();
      setTimeout(
        () => navigate(`/noticias/${data.tipo}/${response.data._id}`),
        1500
      );
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao criar a notícia.");
    }
  };
  return {
    mensagem,
    register,
    handleSubmit,
    reset,
    formState,
    errors,
    navigate,
    onSubmit,
    useForm,
  };
}
