import { BrowserRouter, Route, Routes } from "react-router-dom";
import Calculator from "../page/Calculator";
import Calculadora from "../page/Calculadora";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Calculadora />} />
                <Route path="/fail" element={<Calculator />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;