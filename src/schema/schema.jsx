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