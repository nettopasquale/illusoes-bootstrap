import Carrossel from "../../components/Carrossel/Carrossel";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { ListarConteudos } from "../../components/ListarConteudos/ListarConteudos";

export default function HomePage() {
  return (
    <LayoutGeral>
      <Carrossel></Carrossel>
      <ListarConteudos tipo="noticia"></ListarConteudos>
      <ListarConteudos tipo="artigo"></ListarConteudos>
      <ListarConteudos tipo="evento"></ListarConteudos>
      <ListarConteudos tipo="campeonato"></ListarConteudos>
    </LayoutGeral>
  );
}
