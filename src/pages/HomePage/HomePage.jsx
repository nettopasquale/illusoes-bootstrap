import Cards from "../../components/Cards/Cards";
import Footer from "../../components/Footer/Footer";
import BarraNav from "../../components/Navbar/BarraNav";
import BarraNavTab from "../../components/NavBar_Tab/BarraNavTab";


export default function HomePage() {
  return (
    <>
      <main>

        <BarraNav></BarraNav>

        <p>Embbeded</p>

        <BarraNavTab></BarraNavTab>

        <Cards></Cards>
        
        
      </main>

      <Footer></Footer>

    
    </>
  );
};
