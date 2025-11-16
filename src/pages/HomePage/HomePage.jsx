import Carrossel from "../../components/Carrossel/Carrossel";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { ListarNoticias } from "../../components/ListarConteudos/ListarNoticias";
import { ListarEventos } from "../../components/ListarConteudos/ListarEventos";
import { ListarConteudos } from "../../components/ListarConteudos/ListarConteudos";

export default function HomePage() {
  return (
    <LayoutGeral>
      <Carrossel></Carrossel>
      {/* <ListarNoticias tipo="noticia"></ListarNoticias>
      <ListarNoticias tipo="artigo"></ListarNoticias>
      <ListarEventos tipo="evento"></ListarEventos>
      <ListarEventos tipo="campeonato"></ListarEventos> */}
      <ListarConteudos tipo="noticia"></ListarConteudos>
      <ListarConteudos tipo="artigo"></ListarConteudos>
      <ListarConteudos tipo="evento"></ListarConteudos>
      <ListarConteudos tipo="campeonato"></ListarConteudos>
    </LayoutGeral>
  );
}
