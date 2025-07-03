import Cards from "../../components/Cards/Cards";
import Carrossel from "../../components/Carrossel/Carrossel";
import BarraNavTab from "../../components/NavBar_Tab/BarraNavTab";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import ListarNoticias from "../../components/ListarConteudos/ListarNoticias";
import ListarEventos from "../../components/ListarConteudos/ListarEventos";

export default function HomePage() {

  return (
    <LayoutGeral>
      <Carrossel></Carrossel>
      <BarraNavTab></BarraNavTab>
      <ListarNoticias tipo="noticia"></ListarNoticias>
      <ListarNoticias tipo="artigo"></ListarNoticias>
      <ListarEventos tipo="evento"></ListarEventos>
      <ListarEventos tipo="campeonato"></ListarEventos>
      {/* <Cards to="/artigos"></Cards> */}
    </LayoutGeral>
  );
};