import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import HomePage from "./pages/HomePage/HomePage";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/artigos" element={<HomePage/>}/>
        <Route path="/campeonatos" element={<HomePage/>}/>
        <Route path="/decks" element={<HomePage/>}/>
        <Route path="/marketplace" element={<HomePage/>}/>

      </Routes>
    </>
  );
};

export default App;
