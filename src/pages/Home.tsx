import React from "react";
import { Link } from "react-router-dom";
import hero from "../assets/hero-home.webp"; // adjust path to your assets
import {
  ClipboardList,
  Search,
  CalendarClock,
  LineChart,
  Bell,
  Star,
  Shirt,
  Book,
  Sofa,
  Laptop,
  Baby,
  Boxes,
} from "lucide-react";

const HomePage: React.FC = () => {
  // Features data
  const features = [
    {
      title: "Easy Item Listing",
      icon: <ClipboardList size={24} />,
      desc: "List your surplus items with ease for charities to find.",
    },
    {
      title: "Find Nearby Charities",
      icon: <Search size={24} />,
      desc: "Discover active local charities in your neighborhood.",
    },
    {
      title: "Schedule Pickup",
      icon: <CalendarClock size={24} />,
      desc: "Easily arrange a time for items to be collected.",
    },
    {
      title: "Track Your Impact",
      icon: <LineChart size={24} />,
      desc: "See exactly how your donations are helping people.",
    },
    {
      title: "Real-time Notifications",
      icon: <Bell size={24} />,
      desc: "Stay updated on your donation status instantly.",
    },
    {
      title: "Rate & Review",
      icon: <Star size={24} />,
      desc: "Share your experience and build trust in the community.",
    },
  ];

  // Categories data
  const categories = [
    { name: "Clothing", icon: <Shirt size={32} /> },
    { name: "Furniture", icon: <Sofa size={32} /> },
    { name: "Books", icon: <Book size={32} /> },
    { name: "Electronics", icon: <Laptop size={32} /> },
    { name: "Baby & Kids", icon: <Baby size={32} /> },
    { name: "Others", icon: <Boxes size={32} /> },
  ];

  // How it works steps
  const steps = [
    {
      id: "01",
      title: "Create an Account",
      desc: "Join our community by creating a simple profile.",
    },
    {
      id: "02",
      title: "List or Browse Items",
      desc: "Post items you want to give or find things you need.",
    },
    {
      id: "03",
      title: "Connect & Schedule",
      desc: "Message directly and set a pickup or drop-off time.",
    },
    {
      id: "04",
      title: "Make an Impact",
      desc: "Help the environment and someone in your community.",
    },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-16 gap-10">
        <div className="flex-1 space-y-6">
          <span className="text-[#B33D11] bg-[#FDF2F0] px-4 rounded-full text-sm font-semibold bottom-5 relative">
            Connecting people with each other
          </span>
          <h1 className="text-5xl font-bold leading-tight text-gray-900">
            Give What You Have, <br />
            <span className="text-[#B33D11]">Change a Life</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-md">
            Donate clothes, furniture, books, and more to local charities and
            individuals in need. Help us reduce waste and build a stronger
            community.
          </p>
          <div className="flex gap-4">
            <button className="bg-[#B33D11] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#96320e] transition-all">
              Get Starting →
            </button>
            <Link to="/how-it-works">
              <button className="border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all">
                How it works
              </button>
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <img
            src={hero}
            alt="Donation Boxes"
            className="rounded-2xl shadow-xl object-cover w-full h-auto"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#F9F9F9] py-20 px-10">
        <div className="max-w-6xl mx-auto text-center">
          <h4 className="text-[#B33D11] font-bold mb-2">Features</h4>
          <h2 className="text-4xl font-bold mb-12">
            Everything You Need to Give Back
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-left hover:shadow-md transition-all"
              >
                <div className="text-gray-700 mb-4">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto text-center px-10">
          <h4 className="text-[#B33D11] font-bold mb-2">Categories</h4>
          <h2 className="text-4xl font-bold mb-12">What Can You Donate?</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {categories.map((c, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-6 flex flex-col items-center gap-3 hover:border-[#B33D11] hover:text-[#B33D11] transition-all cursor-pointer"
              >
                <div className="text-gray-600">{c.icon}</div>
                <span className="font-bold text-sm text-black">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-10 text-center">
        <h4 className="text-[#B33D11] font-bold mb-2 uppercase tracking-widest text-sm">
          How it works
        </h4>
        <h2 className="text-4xl font-bold mb-16 italic">Four Simple Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step) => (
            <div key={step.id} className="space-y-4">
              <span className="text-5xl font-extrabold text-[#B33D11]/10 block">
                {step.id}
              </span>
              <h3 className="font-bold text-xl">{step.title}</h3>
              <p className="text-gray-500 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
