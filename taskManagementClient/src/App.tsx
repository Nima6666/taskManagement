import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./pages/components/header";
import Home from "./pages/home";
import Signup from "./pages/signup";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
