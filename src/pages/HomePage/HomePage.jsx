import Cards from "../../components/Cards/Cards";
//import HomeCards from "../../components/Cards/HomeCards";
import Carrossel from "../../components/Carrossel/Carrossel";
import BarraNavTab from "../../components/NavBar_Tab/BarraNavTab";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";

export default function HomePage() {

  return (
    <LayoutGeral>
      <Carrossel></Carrossel>
      {/* <HomeCards activeKey="/artigos" linkRef="/artigos" linkName="Artigos"></HomeCards>
      <HomeCards activeKey="/eventos" linkRef="/eventos" linkName="Eventos"></HomeCards>
      <HomeCards activeKey="/campeonatos" linkRef="/campeonatos" linkName="Campeonatos"></HomeCards> */}
      <BarraNavTab></BarraNavTab>
      <Cards></Cards>
    </LayoutGeral>
  );
};