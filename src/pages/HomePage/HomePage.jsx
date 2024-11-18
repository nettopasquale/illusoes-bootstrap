import Cards from "../../components/Cards/Cards";
import Carrossel from "../../components/Carrossel/Carrossel";
import Footer from "../../components/Footer/Footer";
import BarraNav from "../../components/Navbar/BarraNav";
import BarraNavTab from "../../components/NavBar_Tab/BarraNavTab";


export default function HomePage() {
  return (
    <>
      <main className="w-100">
        <BarraNav></BarraNav>
        <Carrossel></Carrossel>
        <BarraNavTab></BarraNavTab>
        <Cards></Cards>
      </main>

      <Footer></Footer>

    
    </>
  );
};
