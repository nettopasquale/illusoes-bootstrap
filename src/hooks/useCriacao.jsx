// src/hooks/useCriacao.js
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function useCriacao(schema, rotaAPI) {
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();
  const { token } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(rotaAPI, data, {
        headers: { Authorization: token },
      });

      setMensagem("Cadastro criado com sucesso!");
      reset();
      setTimeout(
        () => navigate(`/${data.tipo}/${response.data._id}`),
        1500
      );
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao criar.");
    }
  };

  return {
    mensagem,
    register,
    handleSubmit,
    reset,
    errors,
    onSubmit,
  };
}
