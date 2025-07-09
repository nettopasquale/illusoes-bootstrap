import * as yup from "yup";

export const schemaNoticia = yup
  .object({
    titulo: yup.string().required("O título é obrigatório"),
    subTitulo: yup.string().required("O subtítulo é obrigatório"),
    conteudo: yup.string().required("O conteúdo é obrigatório"),
    imagem: yup.string().url("Insira uma URL válida").optional(),
    tipo: yup.string().oneOf(["noticia", "artigo"]).required(),
  })
  .required();

  export const schemaEvento = yup.object().shape({
  titulo: yup.string().required("O título é obrigatório"),
  subTitulo: yup.string().required("O subtítulo é obrigatório"),
  conteudo: yup.string().required("O conteúdo é obrigatório"),
  imagem: yup.string().url("Insira uma URL válida").nullable(),
  tipo: yup.string().oneOf(["evento", "campeonato"], "Tipo inválido").required("O tipo é obrigatório"),
  dataEvento: yup.date().required("A data do evento é obrigatória"),
  });

  export const schemaCadastro = yup.object().shape({
    usuario: yup.string().required("Nome do usuário é obrigatório"),
    email: yup.string().email("Email inválido").required("Email é obrigatório"),
    senha: yup
      .string()
      .min(8, "A senha deve conter no mínimo 8 caracteres!")
      .matches(/[A-Z]/, "A senha deve conter no mínimo um caracter maiúsculo")
      .matches(/[a-z]/, "A senha deve conter no mínimo um caracter minísculo")
      .matches(/\d/, "A senha deve conter pelo menos um número")
      .matches(
        /[!@#$%^&*]/,
        "A senha deve conter pelo menos um caracter especial"
      )
      .required("Senha é obrigatória"),
    confirmarSenha: yup
      .string()
      .oneOf([yup.ref("senha"), null], "As senhas devem coincidir")
      .required("Confirmação de senha é obrigatória"),
  });

  export const schemaLogin = yup.object().shape({
    login: yup.string().required("Usuário ou Email é obrigatório"),
    senha: yup
      .string()
      .min(8, "A senha deve conter no mínimo 8 caracteres!")
      .matches(/[A-Z]/, "A senha deve conter no mínimo um caracter maiúsculo")
      .matches(/[a-z]/, "A senha deve conter no mínimo um caracter minísculo")
      .matches(/\d/, "A senha deve conter pelo menos um número")
      .matches(
        /[!@#$%^&*]/,
        "A senha deve conter pelo menos um caracter especial"
      )
      .required("Senha é obrigatória"),
  });