import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import Donate from "./pages/Donate";
import Browse from "./pages/Browse";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
