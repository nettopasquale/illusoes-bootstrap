import Cards from "../../components/Cards/Cards";
import Carrossel from "../../components/Carrossel/Carrossel";
import BarraNavTab from "../../components/NavBar_Tab/BarraNavTab";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";

export default function HomePage() {

  return (
    <LayoutGeral>
      <Carrossel></Carrossel>
      <BarraNavTab></BarraNavTab>
      <Cards></Cards>
    </LayoutGeral>
  );
};