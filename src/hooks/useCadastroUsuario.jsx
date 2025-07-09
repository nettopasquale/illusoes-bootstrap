import { useState } from "react";
import axios from "axios";
import { schemaCadastro } from "../schema/schema";

export const useCadastroUsuario = () => {
  //validação form
  const [formData, setFormData] = useState({
    usuario: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [erro, setErro] = useState({});
  const [sucesso, setSucesso] = useState(false);

  //controle de mudança dos inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSucesso(false);
    setErro({});
  };

  // controle de Submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await schemaCadastro.validate(formData, { abortEarly: false });
      setErro({});
      setSucesso(false);

      //enviar p o Backend
      const resposta = await axios.post("http://localhost:8080/users", {
        usuario: formData.usuario,
        email: formData.email,
        senha: formData.senha,
      });

      if (resposta.status === 201 || resposta.status === 200) {
        setSucesso(true);
        setFormData({
          usuario: "",
          email: "",
          senha: "",
          confirmarSenha: "",
        });
      }
    } catch (error) {
      if (error.response && error.response.data?.error) {
        //erro do backend
        setErro({ global: error.response.data.error || "Erro do servidor." });
      } else if (error.inner) {
        //erro de validação do yup
        const erroFormatado = {};
        error.inner.forEach((e) => {
          erroFormatado[e.path] = e.message;
        });
        setErro(erroFormatado);
      } else {
        setErro({ global: "Erro inesperado. Tente novamente" });
      }
      setSucesso(false);
    }
  };

  console.log("Enviando", formData);

  return {formData, erro, sucesso, handleChange, handleSubmit};
};