import { Link } from "react-router-dom";
import { useState } from "react";
import logoImg from "../assets/logo.jpg";

const Navbar = () => {
  const [language, setLanguage] = useState("en"); // default language

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    // Here you can also call a function to update i18n or translation state
    console.log("Selected language:", e.target.value);
  };

  return (
    <nav className="sticky top-0 z-50 w-full flex items-center justify-between px-10 py-1 bg-white border-b border-gray-100 shadow-sm">
      {/* 1. Left Section: Logo */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center gap-1">
          <img
            src={logoImg}
            alt="KindDrop Logo"
            width={110}
            height={40}
            className="object-contain"
          />
        </Link>
      </div>

      {/* 2. Middle Section */}
      <div className="hidden md:flex items-center gap-10 font-medium text-[#444] text-base">
        <Link to="/" className="bg-[#F094B5] text-black px-6 py-2.5 rounded-md">
          Home
        </Link>
        <Link to="/donate" className="hover:text-black">
          Donate
        </Link>
        <Link to="/browse" className="hover:text-black">
          Browse
        </Link>
        <Link to="/how-it-works" className="hover:text-black">
          How It Work
        </Link>
        <Link to="/contact" className="hover:text-black">
          Contact
        </Link>
      </div>

      {/* 3. Right Section */}
      <div className="flex items-center gap-4 text-base font-medium">
        {/* Language Dropdown */}
        <select
          value={language}
          onChange={handleLanguageChange}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
        >
          <option value="km">Khmer</option>
          <option value="en">English</option>
          <option value="zh">Chinese</option>
        </select>

        <Link to="/login" className="text-[#444] hover:text-black">
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-[#E03080] text-white px-7 py-3 rounded-lg font-semibold"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
