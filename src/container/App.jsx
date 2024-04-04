import { BrowserRouter, Route, Routes } from "react-router-dom";
import Calculadora from "../page/Calculator";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Calculadora />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;